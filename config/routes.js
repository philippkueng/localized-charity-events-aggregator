exports.routes = function (map) {
    map.resources('events');
    map.get('search', 'events#search');
};