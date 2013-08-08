L.Shapefile =L.GeoJSON.extend({
    initialize: function (file, options) {
        if(typeof cw !== 'undefined'){
            this.worker = cw(function(data,cb){
                importScripts('shp.js');
	            shp(data).then(cb);
            });
        }
        L.GeoJSON.prototype.initialize.call(this,{features:[]},options);
        this.addFileData(file);
    },
    addFileData:function(file){
        var self = this;
        if(typeof file !== 'string' && !('byteLength' in file)){
            return self.addData(file);
        }
        if(self.worker){
            self.worker.data(cw.makeUrl(file)).then(function(data){
                self.addData(data);
            });
        }else{
            shp(file).then(function(data){
                self.addData(data);
            });
        }
        return this;
    }
});

L.shapefile= function(a,b){
    return new L.Shapfile(a,b);
}