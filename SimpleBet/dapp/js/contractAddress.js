var ContractFun = (function () {
    var _getContractAddressByFunctionId = function (functionId, userAddress, pageSize, pageNo) {
        $.ajax({
            url: 'https://api-dev.cmttracking.io/api/v3/contractsByType',
            dataType: 'json',
            type: 'GET',
            async: true,
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

    var ContractFun = function (...args) {
    };

    ContractFun.getContractAddressByApi = function (functionId, userAddress, pageSize, pageNo) {
        if (pageSize <= 0 || pageSize >= 10) {
            pageSize = 10;
        }
        if (pageNo <= 0) {
            pageNo = 1;
        }
        _getContractAddressByFunctionId(functionId, userAddress, pageSize, pageNo);
    }

    return ContractFun;
});