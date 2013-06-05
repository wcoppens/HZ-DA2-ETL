var async = require('async'),
    debug = require('debug')('load');

function load(etl) {

    etl.prototype.sync = function(self, callback) {

        async.parallel([
            function(callback) { self.syncInterval(self, callback); },
            function(callback) { self.syncDaily(self, callback); },
            function(callback) { self.syncMonthly(self, callback); }
        ], function(err) {

            callback();
        });
    };

    etl.prototype.syncInterval = function(self, callback) {

        self.sqlConnection.query('INSERT INTO consumptions(consumption, datetime, meter_id, rate) VALUES ?', [self.queryIntervalValues], function(err) {

            if(err) {
                debug('::sync Insert of new interval consumptions failed with: '+err);
            }

            callback();
        });
    }

    etl.prototype.syncDaily = function(self, callback) {

        self.sqlConnection.query('INSERT INTO daily_consumptions(consumption, datetime, meter_id,  rate) VALUES ?', [self.queryDailyValues], function(err) {

            if(err) {
                debug('::sync Insert of new daily consumptions failed with: '+err);
            }

            callback();
        });

    }

    etl.prototype.syncMonthly = function(self, callback) {

        self.sqlConnection.query('INSERT INTO monthly_consumptions(consumption, datetime, meter_id,  rate) VALUES ?', [self.queryMonthlyValues], function(err) {

            if(err) {
                debug('::sync Insert of new monthly consumptions failed with: '+err);
            }

            callback();
        });

    }
};

module.exports = load;