define('User', function () {
    property('email', String, { index: true });
    property('password', String);
    property('activated', Boolean, {default: false});
});

var Event = describe('Event', function () {
    property('title', String);
    property('location', String);
    property('description', String);
    property('startDate', Date);
    property('duration', String);
});