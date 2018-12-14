var ContractFun = (function () {
    var _getContractAddressByFunctionId = function (functionId, userAddress, pageSize, pageNo) {
        var url = 'https://api-dev.cmttracking.io/api/v3/contractsByType?funcIds=' + functionId + "&address=" + userAddress + "&limit=" + pageSize + "&page=" + pageNo
        alert(url);
        $.ajax({
            url: url,
            dataType: 'json',
            type: 'GET',
            async: true,
            success: function (result) {
                if (result && result.data && result.data.objects) {
                    console.log(result.data.objects[0].address);
                    console.log(result.data.objects[0].txhash);
                }
            },
            error: function (e) {
                console.log("Get user contract address failed" + e)
            }
        });
    };

    var ContractFun = function (...args) {
    };

    ContractFun.getContractAddressByApi = function (functionId, userAddress, pageSize, pageNo) {
        if (pageSize == null || pageSize == '' || pageSize == 'undefined' || pageSize <= 0 || pageSize >= 10) {
            pageSize = 10;
        }
        if (pageNo == null || pageNo == '' || pageNo == 'undefined' || pageNo <= 0) {
            pageNo = 1;
        }
        _getContractAddressByFunctionId(functionId, userAddress, pageSize, pageNo);
    }

    return ContractFun;
});