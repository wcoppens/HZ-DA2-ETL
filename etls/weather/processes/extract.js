var async = require('async'),
    lineReader = require('line-reader'),
    moment = require('moment'),
    _ = require('lodash'),
    debug = require('debug')('extract');


function extract(etl) {

    etl.prototype.loadCsv = function(self, callback) {

        lineReader.eachLine(self.inputFile, function(line, last) {

            if(line.substring(0,1) != '#') {

                //split line on seperator
                var lineArr = line.split(',');

                self.queryValues.push([
                    lineArr[0].trim(),
                    moment(lineArr[1].trim()+lineArr[2].trim(), 'YYYYMMDD HH').format('YYYY-MM-DD HH:mm:ss'),
                    (parseFloat(lineArr[3].replace('\r','').trim()) / 10)
                ]);
            }

            if(last) {
                callback();
            }
        });
    };
};

module.exports = extract;