var debug = require('debug')('load');

function load(etl) {

    etl.prototype.sync = function(self, callback) {

            self.sqlConnection.query('INSERT INTO weather(station, datetime, temperature) VALUES ?', [self.queryValues], function(err) {

            if(err) {
                debug('::sync Insert of new weatherdata failed with: '+err);
            }

            callback();
        });
    };
};

module.exports = load;