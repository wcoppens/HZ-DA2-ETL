process.env.DEBUG = '*';

var sys = require('sys'),
    program = require('commander'),
    asciimo = require('asciimo').Figlet,
    colors = require('colors'),
    memStore = require('./models/storage').Memory,
    memStore = new memStore();

var energyEtl = require('./etls/energy/etl_to_pg');
var weatherEtl = require('./etls/weather/weather_to_sql.js')

var init = function() {

    global.memStore = memStore;

        program
            .version('Current version: '+global.memStore.getById('global').version)
            .option('-e, --run_energy [file]', 'Run the ETL proces for energy data')
            .option('-w, --run_weather [file]', 'Run the ETL proces for weather data')
            .parse(process.argv);




    if(program.run_energy) {

        var file = program.run_energy;

        new energyEtl(file, function(instance) {

            if(instance) {
                instance.run(function() {
                    console.log('done');
                });
            }
        });

    } else if(program.run_weather) {
    	
    	var file = program.run_weather;

        new weatherEtl(file, function(instance) {

            instance.run(function() {
                console.log('done');
            });
        });

    } else {
        program.help();
    }


}

asciimo.write('Hz ETL', 'starwars', function(art){

    sys.puts(art.blue);

    require('./configLoader')(memStore, init);
});



