define([
    "dojo/_base/declare",
    "JBrowse/Util",
    "JBrowse/Model/FileBlob",
    "JBrowse/Model/XHRBlob",
], function (declare, Util, FileBlob, XHRBlob) {
    var uniqCounter = 0;
    return declare(null, {
        storeType: "JBrowse/Store/SeqFeature/GFF3",

        tryResource: function (configs, resource) {
            if (resource.type == "gff3") {
                var basename = Util.basename(
                    resource.file
                        ? resource.file.name
                        : resource.url
                          ? resource.url
                          : "",
                    [".gff3", ".gff"],
                );
                if (!basename) return false;

                var newName = "GFF3_" + basename + "_" + uniqCounter++;
                configs[newName] = {
                    type: this.storeType,
                    fileBasename: basename,
                    blob: this._makeBlob(resource),
                    name: newName,
                };
                return true;
            } else return false;
        },

        finalizeConfiguration: function (configs) {},

        _makeBlob: function (resource) {
            var r = resource.file
                ? new FileBlob(resource.file)
                : resource.url
                  ? new XHRBlob(resource.url)
                  : null;
            if (!r) throw "unknown resource type";
            return r;
        },

        confIsValid: function (conf) {
            return conf.blob || conf.urlTemplate;
        },
    });
});
