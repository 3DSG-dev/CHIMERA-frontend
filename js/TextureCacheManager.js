function TextureCacheManager() {
}

TextureCacheManager.prototype.fileReceived;

TextureCacheManager.prototype.getFile = function (codice, lod) {
    var self = this;
    var storageOption = navigator.userAgent.toLowerCase().indexOf("android") > -1 ? "temporary" : "persistent";

    var myIdb = $.indexedDB("BIMTextureDB",
        {
            "version": 1,
            "storage": storageOption,
            "upgrade": function (transaction) {
            },
            "schema": {
                "1": function (versionTransaction) {
                    versionTransaction.createObjectStore("BIMTextureCache");
                }
            }
        }).then(
        function (ctx, arg) {
            var codiceStorage = codice + "-lod" + lod;
            $.indexedDB("BIMTextureDB").objectStore("BIMTextureCache").get(codiceStorage).then(
                function (ctx, arg) {
                    if (ctx === undefined) {
                        $.getJSON("./php/getTexture.php", {
                                codiceOggetto: codice.substring(1),
                                LOD: lod,
                                soloInfo: 'false'
                            })
                            .success(function (data, textStatus, jqXHR) {
                                $.indexedDB("BIMTextureDB").objectStore("BIMTextureCache").add(data, codiceStorage);
                                self.fileReceived(data)
                            })
                            .error(function (jqXHR, textStatus, errorThrown) {
                                //self.fileReceived(null);
                            })
                            .complete(function () {
                            });
                    }
                    else {
                        $.getJSON("./php/getTexture.php", {
                                codiceOggetto: codice.substring(1),
                                LOD: lod,
                                soloInfo: 'true'
                            })
                            .success(function (data, textStatus, jqXHR) {
                                if (data.lastModified == ctx.lastModified) {
                                    self.fileReceived(ctx)
                                }
                                else {
                                    $.getJSON("./php/getTexture.php", {
                                            codiceOggetto: codice.substring(1),
                                            LOD: lod,
                                            soloInfo: 'false'
                                        })
                                        .success(function (data, textStatus, jqXHR) {
                                            self.fileReceived(data)
                                            $.indexedDB("BIMTextureDB").objectStore("BIMTextureCache").delete(codiceStorage).then(
                                                function (ctx, arg) {
                                                    $.indexedDB("BIMTextureDB").objectStore("BIMTextureCache").add(data, codiceStorage);
                                                },
                                                function (ctx, arg) {
                                                },
                                                function (ctx, arg) {
                                                }
                                            );
                                        })
                                        .error(function (jqXHR, textStatus, errorThrown) {
                                        })
                                        .complete(function () {
                                        });
                                }
                            })
                            .error(function (jqXHR, textStatus, errorThrown) {
                            })
                            .complete(function () {
                            });
                        /////
                    }
                },
                function (ctx, arg) {
                    alert("transaction aborted");
                },
                function (ctx, arg) {
                    //alert("transaction in progress");
                }
            );
        },
        function (ctx, arg) {
            alert("errore");
        },
        function (ctx, arg) {
        }
    );
};
