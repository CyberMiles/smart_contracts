var ContractFun = (function () {
    var _getContractAddressByFunctionId = function (functionId, userAddress, pageSize, pageNo) {
        $.ajax({
            url: 'https://api-dev.cmttracking.io/api/v3/contractsByType?funcIds=de2fd8ab,83bd72ba,3cc4c6ce,9c16667c,340190ec&limit=10&page=1',
            dataType: 'json',
            data: {
                funcIds: functionId,
                address: userAddress,
                limit: pageSize,
                page: pageNo
            },
            success: function (data) {
                console.log(JSON.parse(data))
            },
            error: function (e) {
                console.log("Get user contract address failed" + e)
            }
        });
    };

    ContractFun.getContractAddress = function () {
        _getContractAddressByFunctionId;
    }


    var ContractFun = function (...args) {
    };

    return ContractFun;
}