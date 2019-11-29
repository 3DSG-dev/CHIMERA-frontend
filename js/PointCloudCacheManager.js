function PointCloudCacheManager() {
}

PointCloudCacheManager.prototype.FileReceived = null;

PointCloudCacheManager.prototype.GetFile = function (pointCloudId) {
    function GetNewFile(pointCloudId) {
        var pointCloudIdSplit = pointCloudId.substring(1).split("_");
        $.ajax({
            url: './php/getModelJSON.php',
            dataType: "json",
            data: {
                codiceVersione: pointCloudIdSplit[0],
                LoD: pointCloudIdSplit[2],
                parte: pointCloudIdSplit[1],
                soloInfo: 'false'
            },
            success: function (result) {
                result["modelData"]["positions"] = new Float32Array(result["modelData"]["positions"]);
                //result["modelData"]["normals"] = new Float32Array(result["modelData"]["normals"]);
                //result["modelData"]["uv"] = new Float32Array(result["modelData"]["uv"]);
                //result["modelData"]["indices"] = new Int32Array(result["modelData"]["indices"]);
                cacheManager.FileReceived(result["modelData"]);
                db["PointCloudCache"].put({id: pointCloudId, data: result})
                    .catch(function (error) {
                        console.log(error);
                        kendo.alert("Unexpected error while saving model into cache!");
                    });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                kendo.alert("Unexpected error while loading model from cache!");
            }
        });
    }

    var cacheManager = this;

    var db = new Dexie("PointCloudDB", {storageOption: navigator.userAgent.toLowerCase().indexOf("android") > -1 ? "temporary" : "persistent"});
    db.version(1).stores({
        PointCloudCache: 'id'
    });

    db["PointCloudCache"].get(pointCloudId).then(function (item) {
        var pointCloudIdSplit = pointCloudId.substring(1).split("_");
        if (item === undefined) {
            GetNewFile(pointCloudId);
        }
        else {
            $.ajax({
                url: './php/getModelJSON.php',
                dataType: "json",
                data: {
                    codiceVersione: pointCloudIdSplit[0],
                    LoD: pointCloudIdSplit[2],
                    parte: pointCloudIdSplit[1],
                    soloInfo: 'true'
                },
                success: function (result) {
                    if (result["lastModified"] === item["data"]["lastModified"]) {
                        cacheManager.FileReceived(item["data"]["modelData"]);
                    }
                    else {
                        db["PointCloudCache"].delete(pointCloudId);
                        GetNewFile(pointCloudId);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                    kendo.alert("Unexpected error while loading model from cache!");
                }
            });
        }
    });
};