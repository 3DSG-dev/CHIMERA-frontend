function BIMCacheManager () {
}

BIMCacheManager.prototype.fileReceived;

//BIMCacheManager.prototype.fileReceived = function (callback, file) {
//    callback.call(this, file);
//}

BIMCacheManager.prototype.getFile = function (BIMDuomoFile) {
    //$.indexedDB("BIMDuomoClientDB").deleteDatabase();
    //return;
    var self = this;
    var storageOption = navigator.userAgent.toLowerCase().indexOf("android") > -1 ? "temporary" : "persistent";
    
    var myIdb = $.indexedDB("BIMDuomoClientDB",
            {
                "version": 1,
                "storage": storageOption,
                "upgrade": function (transaction) {
                },
                "schema": {
                    "1": function (versionTransaction) {
                        versionTransaction.createObjectStore("BIMDuomoCache");
                    }
                }
            }).then(
                function (ctx, arg) {
                    //alert("1");
                    $.indexedDB("BIMDuomoClientDB").objectStore("BIMDuomoCache").get(BIMDuomoFile).then(
                        function (ctx, arg) {
                            //alert("transaction completed");
                            
                            var BIMDuomoFileSplitted = BIMDuomoFile.split("_");
                            if  (BIMDuomoFile.substring(0,1) == "a") BIMDuomoFileSplitted=BIMDuomoFile.substring(1).split("_");
                            if (ctx === undefined) {
                                /////
                                $.getJSON("./php/getFile.php", { codiceOggetto: BIMDuomoFileSplitted[0], LOD: BIMDuomoFileSplitted[2], parte: BIMDuomoFileSplitted[1], soloInfo: 'false' })
                                    .success(function (data, textStatus, jqXHR) {
                                        data.innerData.positions = new Float32Array(data.innerData.positions)
                                        data.innerData.normals = new Float32Array(data.innerData.normals);
                                        data.innerData.uv = new Float32Array(data.innerData.uv);
                                        data.innerData.indices = new Int32Array(data.innerData.indices);
                                        $.indexedDB("BIMDuomoClientDB").objectStore("BIMDuomoCache").add(data, BIMDuomoFile);
                                        self.fileReceived(data.innerData)
                                    })
                                    .error(function (jqXHR, textStatus, errorThrown) {
                                        var error = textStatus;
                                        error = errorThrown;
                                    })
                                    .complete(function () {
                                    });
                                /////
                            }
                            else {
                                /////
                                $.getJSON("./php/getFile.php", { codiceOggetto: BIMDuomoFileSplitted[0], LOD: BIMDuomoFileSplitted[2], parte: BIMDuomoFileSplitted[1], soloInfo: 'true' })
                                    .success(function (data, textStatus, jqXHR) {
                                        if (data.lastModified == ctx.lastModified) {
                                            self.fileReceived(ctx.innerData)
                                        }
                                        else {
                                            /////
                                            $.getJSON("./php/getFile.php", { codiceOggetto: BIMDuomoFileSplitted[0], LOD: BIMDuomoFileSplitted[2], parte: BIMDuomoFileSplitted[1], soloInfo: 'false' })
                                                .success(function (data, textStatus, jqXHR) {
                                                    data.innerData.positions = new Float32Array(data.innerData.positions)
                                                    data.innerData.normals = new Float32Array(data.innerData.normals);
                                                    data.innerData.uv = new Float32Array(data.innerData.uv);
                                                    data.innerData.indices = new Int32Array(data.innerData.indices);
                                                    self.fileReceived(data.innerData);
                                                    $.indexedDB("BIMDuomoClientDB").objectStore("BIMDuomoCache").delete(BIMDuomoFile).then(
                                                        function(ctx, arg){
                                                            $.indexedDB("BIMDuomoClientDB").objectStore("BIMDuomoCache").add(data, BIMDuomoFile);
                                                        },
                                                        function(ctx, arg){
                                                        },
                                                        function(ctx, arg){
                                                        }
                                                    );
                                                })
                                                .error(function (jqXHR, textStatus, errorThrown) {
                                                    var error = textStatus;
                                                    error = errorThrown;
                                                })
                                                .complete(function () {
                                                });
                                            /////
                                            
                                            ////////self.fileReceived(data.innerData)
                                        }
                                    })
                                    .error(function (jqXHR, textStatus, errorThrown) {
                                        var error = textStatus;
                                        error = errorThrown;
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
                    /*
                    $.indexeddb("BIMDuomoClientDB").objectStore("BIMDuomoCache").get(BIMDuomoFile).then(
                    function (ctx, arg) {
                    alert("transaction completed");
                    },
                    function (ctx, arg) {
                    alert("transaction aborted");
                    },
                    function (ctx, arg) {
                    alert("transaction in progress");
                    }
                    );?
                    */
                },
                function (ctx, arg) {
                    alert("errore");
                },
                function (ctx, arg) {
                    //alert("3");
                }
            );


    /*
    ///////////////
    var deleteBIMDuomoDb = $.indexedDB("BIMDuomoClientDB").deleteDatabase().then(
    function (q,w) {
    alert("delete qw")
    var myIdb = $.indexedDB("BIMDuomoClientDB",
    {
    "version": 1,
    "upgrade": function (transaction) {
    },
    "schema": {
    "1": function (versionTransaction) {
    versionTransaction.createObjectStore("BIMDuomoCache");
    }
    }
    }).then(
    function (ctx, arg) {
    alert("1")
    var trans = this.transaction("BIMDuomoCache", false);

    //var objectStore = myIdb.objectStore("BIMDuomoCache", false);
    },
    function (ctx, arg) {
    alert("2")
    },
    function (ctx, arg) {
    alert("3")
    }
    );
    },
    function (q,w) {
    //    alert("error qw")
    },
    function (q,w) {
    //    alert("info qw")
    }
    )
    */
    /*
    $.indexedDB("BIMDuomoClientDB").then(console.info, console.error, function (v) {
    v.deleteObjectStore("TempBookList");
    console.info("Object Store deleted");
    });
    /*
    var myIdb = $.indexedDB("BIMDuomoClientDB",
    {
    "version": 1,
    "upgrade": function (transaction) {
    },
    "schema": {
    "1": function (versionTransaction) {
    versionTransaction.createObjectStore("BIMDuomoCache");
    }
    }
    }).then(
    function (ctx, arg) {
    alert("1")
    var trans = this.transaction("BIMDuomoCache", false);

    //var objectStore = myIdb.objectStore("BIMDuomoCache", false);
    },
    function (ctx, arg) {
    alert("2")
    },
    function (ctx, arg) {
    alert("3")
    }
    );
    /*
    $.indexedDB("BIMDuomoClientDB2", {
    "schema": {
    "1": function (versionTransaction) {
    versionTransaction.createObjectStore("objectStore1");
    },
    "2": function (versionTransaction) {
    versionTransaction.createObjectStore("objectStore2");
    }
    }
    }).transaction(["objectStore1", "objectStore2"]).then(function () {
    alert("Transaction completed");
    }, function () {
    alert("Transaction aborted");
    }, function (t) {
    alert("Transaction in progress");
    t.objectStore("objectStore1").add({
    "valueProp": "val",
    "anotherProp": 2
    }, 1).then(function () {
    alert("Data added");
    }, function () {
    alert("Error adding data");
    });
    });
    */
}
/*
    return;
    var deleteBIMDuomoDb = $.indexedDB("BIMDuomoClientDB").deleteDatabase().done(function (NULL, event) {
        event; // The success event

        var openBIMDuomoDb = $.indexedDB("BIMDuomoClientDB", {
            "version": 1,
            "upgrade": function (transaction) {
            },
            "schema": {
                "1": function (transaction) {
                    var objectStore = transaction.createObjectStore("BIMDuomoCache", {
                        "autoIncrement": false//,
                        //"keyPath": id
                    });
                }
            }
        }).done(function (db, event) {
            db;  //  the native IndexedDB Database object (aka result of the IDBRequest) ,
            event; // the IndexedDB Event object.
            this; // Context inside the function is the native IDBRequest.
            var objectStore = $.indexedDB("BIMDuomoCache").objectStore("BIMDuomoCache", false);
            var promise = objectStore.get(BIMDuomoFile).done(function (result, event) {
                result; // Result of the operation. Some operations like delete will return undefined
                event; // Success Event
            }).fail(function (error, event) {
                error; // Type of error that has occured
                event; // Error event
                //event.type; // indicates if there was an error or an exception
                fileReceived("wwww");
            });
        }).progress(function (db, event) {
            event; //  is the IndexedDB Event object
            event.type; //indicates - blocked or upgrade
            this; // Context inside the function is the native IDBRequest
        }).fail(function (error, event) {
            error; //is the error object and has more details on what the error is
            event; //is the IndexedDB Event object. event.type indicates the type - 'error' or 'exception'
            this; // Context inside the function is the native IDBRequest
        });

    }).fail(function (error, event) {
        error; // Reason for the error
    }).progress(function (db, event) {
        db; // Database that is opened
        event.type // Indicates it is blocked, etc.
    });


    /*
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
    var request = indexedDB.open('BIMDuomoClientDB');
    request.onsuccess = function (event) {
    var db = this.result;
    db.onerror = function (event) {
    alert("Database error: " + event.target.errorCode);
    };
    var transaction = db.transaction(['BIMDuomoCache'], 'readwrite'); // default mode is "readonly"
    transaction.oncomplete = function (event) {
    };
    transaction.onerror = function (event) {
    alert("Why this transaction fail?!");
    };
    transaction.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("BIMDuomoCache", { keyPath: "fileFullName" });
    };
    //var curRequest = transaction.objectStore('BIMDuomoCache').openCursor();
    var objectStore = transaction.objectStore("BIMDuomoCache");
    var innerRequest = objectStore.get(BIMDuomoFile);
    request.onsuccess = function (event) {
    //request.result.name
    //fileReceived(this, BIMDuomoFile);
    };
    };
    request.onerror = function (event) {
    alert("Why didn't you allow my web app to use IndexedDB?!");
    };
    request.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("BIMDuomoCache", { keyPath: "fileFullName" });
    };
    */
//}