function TextureCacheManager() {
}

TextureCacheManager.prototype.FileReceived = null;

TextureCacheManager.prototype.GetFile = function (codiceVersione, lod) {
    function GetNewFile(codiceVersione, lod) {
        $.ajax({
            url: './php/getTexture.php',
            dataType: "json",
            data: {
                codiceVersione: codiceVersione.substring(1),
                LoD: lod,
                soloInfo: 'false'
            },
            success: function (result) {
                cacheManager.FileReceived(result);
                db["TextureCache"].put({id: textureId, data: result})
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
    var textureId = codiceVersione + "-lod" + lod;

    var db = new Dexie("TextureDB", {storageOption: navigator.userAgent.toLowerCase().indexOf("android") > -1 ? "temporary" : "persistent"});
    db.version(1).stores({
        TextureCache: 'id'
    });

    db["TextureCache"].get(textureId).then(function (item) {
        if (item === undefined) {
            GetNewFile(codiceVersione, lod);
        }
        else {
            $.ajax({
                url: './php/getTexture.php',
                dataType: "json",
                data: {
                    codiceVersione: codiceVersione.substring(1),
                    LoD: lod,
                    soloInfo: 'true'
                },
                success: function (result) {
                    if (result["lastModified"] === item["data"]["lastModified"]) {
                        cacheManager.FileReceived(item["data"]);
                    }
                    else {
                        db["TextureCache"].delete(textureId);
                        GetNewFile(codiceVersione, lod);
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