var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports['Event'] = mongoose.model(
    'Event',

    new Schema({
        title: String,
        location: String,
        description: String,
        startDate: Date,
        duration: String
    })
);

module.exports['Event'].modelName = 'Event';