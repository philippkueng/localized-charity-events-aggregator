require('../test_helper.js').controller('events', module.exports);

var sinon  = require('sinon');

function ValidAttributes () {
    return {
        title: '',
        location: '',
        description: '',
        startDate: '',
        duration: ''
    };
}

exports['events controller'] = {

    'GET new': function (test) {
        test.get('/events/new', function () {
            test.success();
            test.render('new');
            test.render('form.' + app.set('view engine'));
            test.done();
        });
    },

    'GET index': function (test) {
        test.get('/events', function () {
            test.success();
            test.render('index');
            test.done();
        });
    },

    'GET edit': function (test) {
        var find = Event.find;
        Event.find = sinon.spy(function (id, callback) {
            callback(null, new Event);
        });
        test.get('/events/42/edit', function () {
            test.ok(Event.find.calledWith('42'));
            Event.find = find;
            test.success();
            test.render('edit');
            test.done();
        });
    },

    'GET show': function (test) {
        var find = Event.find;
        Event.find = sinon.spy(function (id, callback) {
            callback(null, new Event);
        });
        test.get('/events/42', function (req, res) {
            test.ok(Event.find.calledWith('42'));
            Event.find = find;
            test.success();
            test.render('show');
            test.done();
        });
    },

    'POST create': function (test) {
        var event = new ValidAttributes;
        var create = Event.create;
        Event.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, event);
            callback(null, event);
        });
        test.post('/events', event, function () {
            test.redirect('/events');
            test.flash('info');
            test.done();
        });
    },

    'POST create fail': function (test) {
        var event = new ValidAttributes;
        var create = Event.create;
        Event.create = sinon.spy(function (data, callback) {
            test.strictEqual(data, event);
            callback(new Error, null);
        });
        test.post('/events', event, function () {
            test.success();
            test.render('new');
            test.flash('error');
            test.done();
        });
    },

    'PUT update': function (test) {
        Event.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(null); }});
        });
        test.put('/events/1', new ValidAttributes, function () {
            test.redirect('/events/1');
            test.flash('info');
            test.done();
        });
    },

    'PUT update fail': function (test) {
        Event.find = sinon.spy(function (id, callback) {
            test.equal(id, 1);
            callback(null, {id: 1, updateAttributes: function (data, cb) { cb(new Error); }});
        });
        test.put('/events/1', new ValidAttributes, function () {
            test.success();
            test.render('edit');
            test.flash('error');
            test.done();
        });
    },

    'DELETE destroy': function (test) {
        test.done();
    },

    'DELETE destroy fail': function (test) {
        test.done();
    }
};

