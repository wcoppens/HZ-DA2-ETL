
/**
 * Global config file
 * @param data
 */
var global = function(data) {
    updateData(this, data);
}


var updateData = function(object, data) {

    Object.keys(data).forEach(function(key) {
        object[key] = data[key];
    }, object);
}


exports.global = global;