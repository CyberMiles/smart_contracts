#!/usr/bin/env python

from hashlib import sha256

def flip(s):
    return s[::-1]

def dblSha256(s):
    return sha256(sha256(s).digest()).digest()

def dblSha256Flip(s):
    return flip(sha256(sha256(s).digest()).digest())

# Compute Merkle Root
#   curl -s https://blockchain.info/block-height/123456?format=json | jq '[ .blocks[0].tx[] | .hash ]'
txs = [
"5b75086dafeede555fc8f9a810d8b10df57c46f9f176ccc3dd8d2fa20edd685b",
"e3d0425ab346dd5b76f44c222a4bb5d16640a4247050ef82462ab17e229c83b4",
"137d247eca8b99dee58e1e9232014183a5c5a9e338001a0109df32794cdcc92e",
"5fd167f7b8c417e59106ef5acfe181b09d71b8353a61a55a2f01aa266af5412d",
"60925f1948b71f429d514ead7ae7391e0edf965bf5a60331398dae24c6964774",
"d4d5fc1529487527e9873256934dfb1e4cdcb39f4c0509577ca19bfad6c5d28f",
"7b29d65e5018c56a33652085dbb13f2df39a1a9942bfe1f7e78e97919a6bdea2",
"0b89e120efd0a4674c127a76ff5f7590ca304e6a064fbc51adffbd7ce3a3deef",
"603f2044da9656084174cfb5812feaf510f862d3addcf70cacce3dc55dab446e",
"9a4ed892b43a4df916a7a1213b78e83cd83f5695f635d535c94b2b65ffb144d3",
"dda726e3dad9504dce5098dfab5064ecd4a7650bfe854bb2606da3152b60e427",
"e46ea8b4d68719b65ead930f07f1f3804cb3701014f8e6d76c4bdbc390893b94",
"864a102aeedf53dd9b2baab4eeb898c5083fde6141113e0606b664c41fe15e1f"
]
targetTxIndex = 5
siblings = []
print('Target Tx Hash: {}'.format(txs[targetTxIndex]))
print('Target Tx Index: {}'.format(targetTxIndex))
while len(txs) != 1:
    new_txs = []
    txs.append(txs[-1])
    for i in xrange(len(txs) / 2):
        left, right = (txs[2 * i].decode('hex'), txs[2 * i + 1].decode('hex'))
        new_txs.append(dblSha256Flip(flip(left) + flip(right)).encode('hex'))
        if targetTxIndex / 2 == i:
            if targetTxIndex % 2 == 0:
                siblings.append(right.encode('hex'))
            else:
                siblings.append(left.encode('hex'))
            targetTxIndex = i
    txs = new_txs

print('Merkle Root Hash: {}'.format(txs[0]))
print('Merkle Proof:')
for s in siblings:
    print('  ' + s)
