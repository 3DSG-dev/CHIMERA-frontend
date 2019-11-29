function MeshCacheManager() {
}

MeshCacheManager.prototype.FileReceived = null;

MeshCacheManager.prototype.GetFile = function (meshId) {
    function GetNewFile(meshId) {
        var meshIdSplit = meshId.substring(1).split("_");
        $.ajax({
            url: './php/getModelJSON.php',
            dataType: "json",
            data: {
                codiceVersione: meshIdSplit[0],
                LoD: meshIdSplit[2],
                parte: meshIdSplit[1],
                soloInfo: 'false'
            },
            success: function (result) {
                result["modelData"]["positions"] = new Float32Array(result["modelData"]["positions"]);
                result["modelData"]["normals"] = new Float32Array(result["modelData"]["normals"]);
                result["modelData"]["uv"] = new Float32Array(result["modelData"]["uv"]);
                result["modelData"]["indices"] = new Int32Array(result["modelData"]["indices"]);
                cacheManager.FileReceived(result["modelData"]);
                db["MeshCache"].put({id: meshId, data: result})
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

    var db = new Dexie("MeshDB", {storageOption: navigator.userAgent.toLowerCase().indexOf("android") > -1 ? "temporary" : "persistent"});
    db.version(1).stores({
        MeshCache: 'id'
    });

    db["MeshCache"].get(meshId).then(function (item) {
        var meshIdSplit = meshId.substring(1).split("_");
        if (item === undefined) {
            GetNewFile(meshId);
        }
        else {
            $.ajax({
                url: './php/getModelJSON.php',
                dataType: "json",
                data: {
                    codiceVersione: meshIdSplit[0],
                    LoD: meshIdSplit[2],
                    parte: meshIdSplit[1],
                    soloInfo: 'true'
                },
                success: function (result) {
                    if (result["lastModified"] === item["data"]["lastModified"]) {
                        cacheManager.FileReceived(item["data"]["modelData"]);
                    }
                    else {
                        db["MeshCache"].delete(meshId);
                        GetNewFile(meshId);
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