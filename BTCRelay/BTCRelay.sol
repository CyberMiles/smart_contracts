pragma solidity ^0.4.0;

contract BTCRelay {

    event StoreHeaderEvent(uint256 hash);

    struct Block {
        bytes header;
        uint256 height;
    }

    mapping(uint256 => Block) private blocks;

    modifier validatorOnly() {
        require(
            isValidator(msg.sender),
            "Only validator can use this function."
        );
        _;
    }

    function storeHeader(bytes header, uint256 height) public validatorOnly returns (uint256) {
        uint256 hash = dblShaFlip(header);
        blocks[hash] = Block(header, height);
        emit StoreHeaderEvent(hash);
        return hash;
    }

    function verifyTx(bytes txBytes, uint256 txIndex, uint256[] sibling, uint256 txBlockHash) public view returns (uint256) {
        uint256 txHash = dblShaFlip(txBytes);
        bool res = helperVerifyHash(txHash, txIndex, sibling, txBlockHash);
        return res ? txHash : 0;
    }

    function helperVerifyHash(uint256 txHash, uint256 txIndex, uint256[] sibling, uint256 txBlockHash) private view returns (bool) {
        uint256 merkle = computeMerkle(txHash, txIndex, sibling);
        bytes storage blockBytes = blocks[txBlockHash].header;
        uint256 realMerkleRoot = getMerkleRoot(blockBytes);
        return merkle == realMerkleRoot;
    }

    function computeMerkle(uint256 txHash, uint256 txIndex, uint256[] sibling) private pure returns (uint256 resultHash) {
        resultHash = txHash;
        uint256 proofLen = sibling.length;
        uint256 i = 0;
        while (i < proofLen) {
            uint256 proofHex = sibling[i];
            uint256 sideOfSibling = txIndex % 2;

            if (sideOfSibling == 1) {
                resultHash = flip32(uint256(sha256(abi.encodePacked(sha256(abi.encodePacked(flip32(proofHex), flip32(resultHash)))))));
            }
            else {
                resultHash = flip32(uint256(sha256(abi.encodePacked(sha256(abi.encodePacked(flip32(resultHash), flip32(proofHex)))))));
            }

            txIndex = txIndex / 2;
            i = i + 1;
        }
    }

    function targetFromBits(uint32 bits) private pure returns (uint256) {
        uint256 exp = uint(bits) >> 24;
        uint256 c = uint(bits) & 0xffffff;
        uint256 result = c * 2**(8*(exp - 3));
        return result;
    }

    function flip32(uint256 le) private pure returns (uint256 be) {
        be = 0x0;
        for (uint256 i = 0; i < 32; i++) {
            be <<= 8;
            be |= (le & 0xff);
            le >>= 8;
        }
    }

    function flip4(uint256 le) private pure returns (uint256 be) {
        be = 0x0;
        for (uint256 i = 0; i < 4; i++) {
            be <<= 8;
            be |= (le & 0xff);
            le >>= 8;
        }
        return be;
    }

    function dblShaFlip(bytes data) private pure returns (uint256) {
        return flip32(uint256(sha256(abi.encodePacked(sha256(data)))));
    }

    function getHeight(uint256 hash) private view returns (uint256 height) {
        height = blocks[hash].height;
    }

    function getVersion(bytes header) private pure returns (uint256 ret) {
        assembly {
            ret := mload(add(header, 32))
        }
        ret = flip4(ret >> 224);
    }

    function getPrevBlock(bytes header) private pure returns (uint256 ret) {
        assembly {
            ret := mload(add(header, 36))
        }
        ret = flip32(ret);
    }

    function getMerkleRoot(bytes header) private pure returns (uint256 ret) {
        assembly {
            ret := mload(add(header, 68))
        }
        ret = flip32(ret);
    }

    function getTimestamp(bytes header) private pure returns (uint256 ret) {
        assembly {
            ret := mload(add(header, 100))
        }
        ret = flip4(ret >> 224);
    }

    function getBits(bytes header) private pure returns (uint256 ret) {
        assembly {
            ret := mload(add(header, 104))
        }
        ret = flip4(ret >> 224);
    }

    function getNonce(bytes header) private pure returns(uint256 ret) {
        assembly {
            ret := mload(add(header, 108))
        }
        ret = flip4(ret >> 224);
    }

}
