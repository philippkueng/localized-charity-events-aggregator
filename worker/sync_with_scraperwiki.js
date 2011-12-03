var Step = require('step'),
    fs = require('fs');

require('../db/mongoose_schema');

// --- MONGODB ---
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.ObjectId;
    
db = mongoose.connect('mongodb://localhost/localized-charity-events-aggregator-dev');
Event = db.model('Event');

var sync_with_scraperwiki = function(){
  var ngos = null;
  Step(
    function load_scraper(){
      ngos = JSON.parse(fs.readFileSync('./scrapers.json'));
    },
    function print(err, data){
      console.log(ngos);
    }
  )
};

sync_with_scraperwiki();