L.Shapefile =L.GeoJSON.extend({
    initialize: function (file, options, importUrl) {
        if(typeof cw !== 'undefined'){
            if (typeof importUrl === 'undefined') {
            	importUrl = 'shp.js';
            }
            this.worker = cw(function(data,cb){
                importScripts(importUrl);
	            shp(data).then(cb);
            });
        }
        L.GeoJSON.prototype.initialize.call(this,{features:[]},options);
        this.addFileData(file);
    },
    addFileData:function(file){
        var self = this;
        self.fire('data:loading');
        if(typeof file !== 'string' && !('byteLength' in file)){
            var data = self.addData(file);
            self.fire('data:loaded');
            return data;
        }
        if(self.worker){
            self.worker.data(cw.makeUrl(file)).then(function(data){
                self.addData(data);
                self.fire('data:loaded');
                self.worker.close();
            });
        }else{
            shp(file).then(function(data){
                self.addData(data);
                self.fire('data:loaded');
            });
        }
        return this;
    }
});

L.shapefile= function(a,b,c){
    return new L.Shapefile(a,b,c);
}
