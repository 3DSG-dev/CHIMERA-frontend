function ImageCacheManager() {
}

ImageCacheManager.prototype.fileReceived;

ImageCacheManager.prototype.getFile = function (codice, url, quality, tipo) {
    var self = this;
    var storageOption = navigator.userAgent.toLowerCase().indexOf("android") > -1 ? "temporary" : "persistent";

    var myIdb = $.indexedDB("BIMImageDB",
        {
            "version": 1,
            "storage": storageOption,
            "upgrade": function (transaction) {
            },
            "schema": {
                "1": function (versionTransaction) {
                    versionTransaction.createObjectStore("BIMImageCache");
                }
            }
        }).then(
        function (ctx, arg) {
            var codiceStorage = "a" + codice + "-" + tipo + "-" + url + "-" + quality;
            var script = tipo == 0 ? "./php/getImmagineOggetto.php" : "./php/getImmagineVersione.php";
            $.indexedDB("BIMImageDB").objectStore("BIMImageCache").get(codiceStorage).then(
                function (ctx, arg) {
                    if (ctx === undefined) {
                        $.getJSON(script, {
                                codice: codice,
                                url: url,
                                quality: quality,
                                soloInfo: 'false'
                            })
                            .success(function (data, textStatus, jqXHR) {
                                $.indexedDB("BIMImageDB").objectStore("BIMImageCache").add(data, codiceStorage);
                                self.fileReceived(data)
                            })
                            .error(function (jqXHR, textStatus, errorThrown) {
                                //self.fileReceived(null);
                            })
                            .complete(function () {
                            });
                    }
                    else {
                        $.getJSON(script, {
                                codice: codice,
                                url: url,
                                quality: quality,
                                soloInfo: 'true'
                            })
                            .success(function (data, textStatus, jqXHR) {
                                if (data.lastModified == ctx.lastModified) {
                                    self.fileReceived(ctx)
                                }
                                else {
                                    $.getJSON(script, {
                                            codice: codice,
                                            url: url,
                                            quality: quality,
                                            soloInfo: 'false'
                                        })
                                        .success(function (data, textStatus, jqXHR) {
                                            self.fileReceived(data)
                                            $.indexedDB("BIMImageDB").objectStore("BIMImageCache").delete(codiceStorage).then(
                                                function (ctx, arg) {
                                                    $.indexedDB("BIMImageDB").objectStore("BIMImageCache").add(data, codiceStorage);
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
