/**
 * Box geometry node type
 *
 * Usage example:
 *
 * someNode.addNode({
 *      type: "prims/meshGeometry",
 *      id: "filename",
 *      wire: false // Default
 *  });
 */
(function () {

    SceneJS.Types.addType("prims/meshGeometry", {
        construct: function (params) {
            var meshCacheManager = new MeshCacheManager();
            var that = this;
            meshCacheManager.FileReceived = function (modelJSONdata) {
                params.jsondata = modelJSONdata;
                that.addNode(build.call(that, params));
            }
            meshCacheManager.GetFile(params.fid)
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

        var coreId = "prims/meshGeometry_" + fid + (params.wire ? "_wire" : "_solid");

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
            primitive: params.wire ? "lines" : "triangles",
            coreId: coreId,
            positions: params.jsondata.positions,
            normals: params.jsondata.normals,
            uv: params.jsondata.uv,
            indices: params.jsondata.indices
        };
    }
})();