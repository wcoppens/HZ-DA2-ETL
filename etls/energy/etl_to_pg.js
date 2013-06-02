var fs = require('fs'),
    _ = require('lodash'),
    async = require('async'),
    mysql = require('mysql'),
    debug = require('debug')('etl');

function etl(inputFile, callback) {

    this.sqlConnection = mysql.createConnection(global.memStore.getById('database'));

    this.meterTable = [];
    this.queryIntervalValues = [];
    this.queryDailyValues = [];
    this.queryMonthlyValues = [];

    if(fs.existsSync(inputFile)) {

        this.sqlConnection.connect();

        this.inputFile = inputFile;

        callback(this);
    } else {

        debug('::init input file cannot be found.');

        callback(false);
    }
}

etl.prototype.run = function(callback) {

    var self = this;

    async.waterfall([
        function(callback) { self.extract(self, callback) },
        function(callback) { self.transform(self, callback) },
        function(callback) { self.load(self, callback) }
    ], function(err) {
        if(err) {
            debug('::run encountered the following error:\n'+ err);
        } else {
            debug('::run completed!');
        }

        self.sqlConnection.end();

        callback();
    });
};

module.exports = etl;

require('./processes/extract')(etl);
require('./processes/transform')(etl);
require('./processes/load')(etl);


etl.prototype.extract = function(self, callback) {

    async.waterfall([
        function(callback) { self.loadConversionTable(self, callback); },
        function(callback) { self.loadCsv(self, callback); }
    ], function(err) {

        if(err) {
           debug('::extract Error ocurred during extraction.');
        }
        callback();

    });
}

etl.prototype.transform = function(self, callback) {

    //This conversion does not require any additional transformations yet.

    callback();
}

etl.prototype.load = function(self, callback) {

    async.parallel([
        function(callback) { self.sync(self, callback); }
    ], function(err) {

        if(err) {
            debug('::load failed with error: \n'+ err);
        }

        callback();

    });

}