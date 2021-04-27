function ImageCacheManager() {
}

ImageCacheManager.prototype.FileReceived = null;

ImageCacheManager.prototype.GetFile = function (imageId) {
    function GetNewFile(imageId) {
        var imageIdSplit = imageId.split("|");
        $.ajax({
            url: './php/getImage.php',
            dataType: "json",
            data: {
                ref: imageIdSplit[0],
                codice: imageIdSplit[1],
                quality: imageIdSplit[2],
                url: imageIdSplit[3],
                soloInfo: 'false'
            },
            success: function (result) {
                cacheManager.FileReceived("data:Content-Type: " + result["mimeType"] + ";base64," + result["imageFile"]);
                db["ImageCache"].put({id: imageId, data: result})
                    .catch(function (error) {
                        console.log(error);
                        kendo.alert("Unexpected error while saving image into cache!");
                    });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                kendo.alert("Unexpected error while loading image from cache!");
            }
        });
    }

    var cacheManager = this;

    var db = new Dexie("ImageDB", {storageOption: navigator.userAgent.toLowerCase().indexOf("android") > -1 ? "temporary" : "persistent"});
    db.version(1).stores({
        ImageCache: 'id'
    });

    db["ImageCache"].get(imageId).then(function (item) {
        if (item === undefined) {
            GetNewFile(imageId);
        } else {
            var imageIdSplit = imageId.split("|");
            $.ajax({
                url: './php/getImage.php',
                dataType: "json",
                data: {
                    ref: imageIdSplit[0],
                    codice: imageIdSplit[1],
                    quality: imageIdSplit[2],
                    url: imageIdSplit[3],
                    soloInfo: 'true'
                },
                success: function (result) {
                    if (result["lastModified"] === item["data"]["lastModified"]) {
                        cacheManager.FileReceived("data:Content-Type: " + item["data"]["mimeType"] + ";base64," + item["data"]["imageFile"]);
                    } else {
                        db["ImageCache"].delete(imageId);
                        GetNewFile(imageId);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                    kendo.alert("Unexpected error while loading image from cache!");
                }
            });
        }
    });
};