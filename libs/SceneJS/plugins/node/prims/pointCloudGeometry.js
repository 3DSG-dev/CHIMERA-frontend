/**
 * Box geometry node type
 *
 * Usage example:
 *
 * someNode.addNode({
 *      type: "prims/pointCloudGeometry",
 *      id: "filename",
 *      wire: false // Default
 *  });
 */
(function () {

    SceneJS.Types.addType("prims/pointCloudGeometry", {
        construct: function (params) {
            var pointCloudCacheManager = new PointCloudCacheManager();
            var that = this;
            pointCloudCacheManager.FileReceived = function (modelJSONdata) {
                params.jsondata = modelJSONdata;
                that.addNode(build.call(that, params));
            }
            pointCloudCacheManager.GetFile(params.fid)
        }
    });

    function build(params) {
        var fid;
        if (params.fid) {
            fid = params.fid;
        }
        else {
            fid = "";
        }

        var coreId = "prims/pointCloudGeometry" + fid + "_pointCloud";

        // If a node core already exists for a prim with the given properties,
        // then for efficiency we'll share that core rather than create another geometry
        if (this.getScene().hasCore("geometry", coreId)) {
            return {
                type: "geometry",
                coreId: coreId
            };
        }

        // Otherwise, create a new geometry
        return {
            type: "geometry",
            primitive: "points",
            coreId: coreId,
            positions: params.jsondata.positions,
            colors: params.jsondata.colors,
            pointSize:1
        };
    }
})();