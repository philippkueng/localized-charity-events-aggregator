load('application');

before(loadEvent, {only: ['show', 'edit', 'update', 'destroy']});

action('new', function () {
    this.title = 'New event';
    this.event = new Event;
    render();
});

action(function create() {
    Event.create(req.body, function (err, user) {
        if (err) {
            flash('error', 'Event can not be created');
            render('new', {
                event: user,
                title: 'New event'
            });
        } else {
            flash('info', 'Event created');
            redirect(path_to.events);
        }
    });
});

action(function index() {
    var events = [];

    this.title = 'Events index';

    require(__dirname + '/db/mongoose_schema')
        .Event
        .find({})
        .asc('startDate')
        .exec(
            {},

            function (err, events) {
                render({events: events});
            }
        );
});

action(function show() {
    this.title = 'Event show';
    render();
});

action(function edit() {
    this.title = 'Event edit';
    render();
});

action(function update() {
    this.event.updateAttributes(body, function (err) {
        if (!err) {
            flash('info', 'Event updated');
            redirect(path_to.event(this.event));
        } else {
            flash('error', 'Event can not be updated');
            this.title = 'Edit event details';
            render('edit');
        }
    }.bind(this));
});

action(function destroy() {
    this.event.destroy(function (error) {
        if (error) {
            flash('error', 'Can not destroy event');
        } else {
            flash('info', 'Event successfully removed');
        }
        send("'" + path_to.events + "'");
    });
});

action(function search() {
    if (req.query.q) {
        (function () {
            var mongodb = require('mongodb'),
                server = new mongodb.Server('127.0.0.1', 27017, {}),
                queryRegExp = new RegExp(req.query.q, 'i');

            new mongodb.Db('localized-charity-events-aggregator-dev', server, {}).open(function (error, client) {
                var collection = null;

                if (error) {
                    send({
                        'query': req.query.q,
                        'events': [],
                        'error': error
                    });

                    return;
                }

                collection = new mongodb.Collection(client, 'events');

                collection.find(
                    {$or: [
                        {title: {$regex: queryRegExp}},
                        {description: {$regex: queryRegExp}},
                        {location: {$regex: queryRegExp}}
                    ]},
                    {limit:100}
                ).toArray(function(error, events) {
                    send({
                        'query': req.query.q,
                        'events': events,
                        'error': error
                    });
                });
            });
        }())
    }
    else {
        send({
            'query': req.query.q,
            'events': [],
            'error': null
        });
    }
});

function loadEvent() {
    Event.find(params.id, function (err, event) {
        if (err) {
            redirect(path_to.events);
        } else {
            this.event = event;
            next();
        }
    }.bind(this));
}