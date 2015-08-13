'use strict';

/* global cw, shp */
L.Shapefile =L.GeoJSON.extend({
  options: {
    isArrayBufer: false,
    importUrl: 'shp.js'
  },

  initialize: function (file, options) {
    L.Util.setOptions(this, options);
    if(typeof cw !== 'undefined'){
      /*jslint evil: true */
      if(!options.isArrayBufer) {
        this.worker = cw(new Function('data', 'cb', 'importScripts("' + this.options.importUrl + '");shp(data).then(cb);'));
      } else {
        this.worker = cw(new Function('data', 'importScripts("' + this.options.importUrl + '"); return shp.parseZip(data);'));
      }
    }
    L.GeoJSON.prototype.initialize.call(this, {features:[]}, options);
    this.addFileData(file);
  },

  addFileData:function(file) {
    var self = this;
    self.fire('data:loading');
    if(typeof file !== 'string' && !('byteLength' in file)) {
      var data = self.addData(file);
      self.fire('data:loaded');
      return data;
    }

    if(self.worker) {
      if(!self.options.isArrayBufer) {
        self.worker.data(cw.makeUrl(file)).then(function(data){
          self.addData(data);
          self.fire('data:loaded');
          self.worker.close();
        });
      } else {
        self.worker.data(file, [file]).then(function(data){
          self.addData(data);
          self.fire('data:loaded');
          self.worker.close();
        });
      }
    } else{
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
};
