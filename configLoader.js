var async = require('async')
    ,fs = require('fs')
    ,path = require('path')
    ,debug = require('debug')('::configLoader');

/* File locations */
var configFiles = [__dirname+'/config/global.json']
    ,configModels = require('./models/configModels');

/**
 * This method loops all config files, assigns a model to it and adds the config to memStore
 * so it's accessible from everywhere
 *
 * @param memStore
 */
module.exports = function(memStore, callback) {

    async.each(configFiles, function(file, callback) {
        fs.readFile(file, function(err, data) {

            if(err) {
                callback(err);
            } else {

                JSON.parse(data).forEach(function(config) {

                    if(typeof(configModels[path.basename(file,'.json')]) == 'function') {

                        memStore.add(new configModels[path.basename(file,'.json')](config));
                    } else {
                        callback('Unable to find '+path.basename(file,'.json')+' method in configModels');
                    }
                });

                callback();
            }
        });

    }, function(err) {
        if(err) {
            debug(err);
        }

        callback();
    });
}