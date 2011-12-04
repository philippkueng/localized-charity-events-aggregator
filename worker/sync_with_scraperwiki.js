var Step = require('step'),
    fs = require('fs');
    
var util = require('util'),
    exec = require('child_process').exec;

require('../db/mongoose_schema');

// --- MONGODB ---
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = mongoose.ObjectId,
    request = require('request');
    
db = mongoose.connect('mongodb://localhost/localized-charity-events-aggregator-dev');
Event = db.model('Event');

var upsert_entry = function(ngo, entry, callback){
  Step(
    function is_event_in_db(){
      Event.where('title', entry.title).find(this);
    },
    function insert_or_skip(err, results){
      if (err){
        throw err;
      } else {
        if(results !== null && results.length > 0){
          callback(null, true);
        } else { // insert the record into the database
          new_event = new Event({
            title: entry.title,
            startDate: new Date(12,11,10)
          });
          new_event.save(this);
        }
      }
    },
    function end_function(err, results){
      callback(err, results);
    }
  );
};

var request_scraperwiki_json = function(name, callback){
  var limit_of_events = 200;
  var url = "http://api.scraperwiki.com/api/1.0/datastore/sqlite?format=jsondict&name=" + name + "&query=select%20*%20from%20%60swdata%60%20limit%20" + limit_of_events;
  Step(
    function request_json(){
      request({url: url, json: true}, this);
    },
    function return_data(err, response, body){
      if(!err && response.statusCode == 200){
        callback(null, body);
      } else {
        console.log('statusCode: ' + response.statusCode);
        callback(null, null);
      }
    }
  );
};

var process_site = function(ngo, callback){
  Step(
    function request_json(){
      request_scraperwiki_json(ngo.scraperwiki_name, this);
    },
    function upsert_in_batch(err, results){
      console.log(results);
      if(err){
        throw err;
      } else {
        if(results !== null && results.length > 0){
          var group = this.group();
          results.forEach(function(entry){
            upsert_entry(ngo, entry, group());
          });
        } else {
          return false;
        }
      }      
    },
    function done(err, results){
      callback(err, results);
    }
  );
};

var sync_with_scraperwiki = function(callback){
  var ngos = null;
  Step(
    function load_scraper(){
      ngos = JSON.parse(fs.readFileSync('./scrapers.json'));
      return ngos;
    },
    function process_each_site(err, data){
      if(err){
        throw err;
      }
      var group = this.group();
      ngos.forEach(function(site){
        process_site(site, group());
      });
    },
    function print(err, response){
      if (err){
        throw err;
      }
      callback(err, response);
    }
  )
};

// ---- ICALS

var process_ical = function(ical, callback){
  Step(
    function download_ics(){
      child = exec('/opt/local/bin/curl ' + ical.ical_url, this);
    },
    function save_to_disk(err, results){
      fs.writeFile(ical.ical_name + '.ical', results, this);
    },
    function start_ruby_process(err, results){
      if(err){
        throw err;
      }
      child = exec('ruby fetch_ical.rb ' + ical.ical_name, this);
    },
    function print(err, results){
      callback(err, results);
    }
  )
};

var sync_with_icals = function(){
  var icals = null;
  Step(
      function load_icals(){
        icals = JSON.parse(fs.readFileSync('./icals.json'));
        return icals;
      },
      function process_each_ical(err, data){
        if(err){
          throw err;
        }
        var group = this.group();
        icals.forEach(function(ical){
          process_ical(ical, group());
        });
      },
      function print(err, results){
        if(err){
          throw err;
        }
        // console.log(results);
        // mongoose.connection.close();
        // process.exit();
        sync_with_scraperwiki(this);
      },
      function close(err, results){
        if(err){
          throw err;
        }
        mongoose.connection.close();
        process.exit();
      }
  )
};

// sync_with_scraperwiki();
sync_with_icals();

// request(
//       {uri: 'https://api.scraperwiki.com/api/1.0/datastore/sqlite?format=jsondict&name=greenpeace_switzerland_agenda_1&query=select%20*%20from%20%60swdata%60%20limit%2010',
//         json: true
//       },
//       function(err, response, body){
//         console.log(body);
//         // console.log(err);
//         // console.log(response);
//         // console.log(body);
//       });