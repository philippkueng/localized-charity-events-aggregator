var Faker = require('Faker'),
    _ = require('underscore');

var randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var capitalize = function (s) {
    var res = s.trim();

    if (res.length <= 0) return '';
    return res[0].toUpperCase() + res.substr(1);
};

var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1", 27017, {});

new mongodb.Db('localized-charity-events-aggregator-dev', server, {}).open(function (error, client) {
    if (error) throw error;

    var collection = new mongodb.Collection(client, 'events');

    _(100).times(function () {
        collection.insert(
            {
                title: capitalize(Faker.Lorem.sentence()),
                location: Faker.Address.city(),
                description: Faker.Lorem.paragraphs() + "\n\n" + 'http://' + Faker.Internet.domainName(),
                startDate: new Date(randomInt(2009, 2012), randomInt(0, 11), randomInt(1, 28), randomInt(12, 20)),
                duration: "about " + randomInt(2, 4) + " hours"
            },

            {}
        );
    });
});

