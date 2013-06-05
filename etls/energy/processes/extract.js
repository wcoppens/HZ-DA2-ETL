var async = require('async'),
    lineReader = require('line-reader'),
    moment = require('moment'),
    _ = require('lodash'),
    debug = require('debug')('extract');


function extract(etl) {

    etl.prototype.loadConversionTable = function(self, callback) {

        if(self.meterTable.length == 0) {

            self.sqlConnection.query('SELECT * FROM meters', function(err, rows, fields) {

                if(err) {
                    debug('::loadConversionTable There was a problem retrieving the meter table.');
                }

                if(rows.length > 0) {

                    async.each(rows, function(row, callback) {

                        self.meterTable.push({
                            identifier: row.identifier,
                            type_consumption: row.meter_type,
                            meter_id: row.id
                        });

                        callback();

                    }, function(err) {

                        callback();

                    });

                } else {
                    callback();
                }
            });
        } else {
            console.log(1);
            callback();
        }
    }

    etl.prototype.loadCsv = function(self, callback) {

        var lastMeter,
            lastConsumption,
            lowRateConsumption,
            normalRateConsumption;

        lineReader.eachLine(self.inputFile, function(line, last) {

            //split line on seperator
            var lineArr = line.split(';');

            if(_.isObject(_.find(self.meterTable, {identifier: lineArr[0]}))) {

                var conversionTableObject = _.find(self.meterTable, {identifier: lineArr[0]});

                var meter_id = conversionTableObject.meter_id;
                var type_consumption = conversionTableObject.type_consumption;

                if(lastMeter != meter_id) {
                    lastConsumption = 0;
                    lowRateConsumption = 0;
                    normalRateConsumption = 0;
                }

                if(isNaN(parseFloat(lineArr[3]))) {
                    lineArr[3] = 0;
                } else {

                    lineArr[3] = parseFloat(lineArr[3].replace(',', '.'));
                }

                lastConsumption = lastConsumption + lineArr[3];

                var lineTime = moment(lineArr[1]);
                var meter_id = _.find(self.meterTable, {identifier: lineArr[0]}).meter_id;


                if(type_consumption == 1) {

                    normalRateConsumption = normalRateConsumption + lineArr[3];

                } else {

                    if(parseFloat(lineTime.format('HHmm')) > 0 && parseFloat(lineTime.format('HHmm')) <= 700) {
                        //Low
                        //console.log('123'+'-'+parseFloat(lineTime.format('HHmm')));
                        lowRateConsumption = lowRateConsumption + lineArr[3];

                    }
                    if(parseFloat(lineTime.format('HHmm')) > 700 && parseFloat(lineTime.format('HHmm')) <= 2300) {
                        //Normal
                        //console.log('456'+'-'+parseFloat(lineTime.format('HHmm')));
                        normalRateConsumption = normalRateConsumption + lineArr[3];
                    }
                    if(parseFloat(lineTime.format('HHmm')) > 2300 || parseFloat(lineTime.format('HHmm')) == 0) {
                        //Low
                        //console.log('789'+'-'+parseFloat(lineTime.format('HHmm')));
                        lowRateConsumption = lowRateConsumption + lineArr[3];
                    }
                }


                lastMeter = meter_id;

                self.queryIntervalValues.push([
                    lastConsumption,
                    moment(lineArr[1]).format('YYYY-MM-DD HH:mm:ss'),
                    meter_id,
                    ((type_consumption == 0) ? 1:7)
                ]);

                if(lineTime.format('HHmm') == 0000) {

                    if(type_consumption == 1) {
                        //gas
                        self.queryDailyValues.push(
                            [normalRateConsumption, lineTime.format('YYYY-MM-DD HH:mm:ss'), meter_id, 7]
                        );


                    } else {
                        self.queryDailyValues.push(
                            [lowRateConsumption, lineTime.format('YYYY-MM-DD HH:mm:ss'), meter_id, 3],
                            [normalRateConsumption, lineTime.format('YYYY-MM-DD HH:mm:ss'), meter_id, 4]
                        );
                    }

                    if(lineTime.format('D') == '1') {

                        if(type_consumption == 1) {
                            //gas
                            self.queryMonthlyValues.push(
                                [normalRateConsumption, lineTime.format('YYYY-MM-DD HH:mm:ss'), meter_id, 7]
                            );

                        } else {

                            self.queryMonthlyValues.push(
                                [lowRateConsumption, lineTime.format('YYYY-MM-DD HH:mm:ss'), meter_id, 3],
                                [normalRateConsumption, lineTime.format('YYYY-MM-DD HH:mm:ss'), meter_id, 4]
                            );
                        }
                    }
                }
            }

            if(last) {

                callback();
            }
        });
    };
};

module.exports = extract;