var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
    
var Event = new Schema({
    title: String,
    location: String,
    description: String,
    startDate: Date,
    duration: String
  });

mongoose.model('Event', Event);
module.exports['Event'] = mongoose.model('Event');
module.exports['Event'].modelName = 'Event';