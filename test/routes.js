var route = require('../lib/routing/route')
  , routes = [
  // ==== HTML
  {
    url: '/campaigns',
    ctrl: 'campaigns#index',
    method: 'GET',
  },

  // ===== JSON
  {
    url: '/campaigns/:id',
    ctrl: 'campaigns#details',
    method: 'GET',
  },
  // CRUD
  {
    url: '/campaigns/new',
    ctrl: 'campaigns#save',
    method: 'POST',
  },
  {
    url: '/campaigns/:id/edit',
    ctrl: 'campaigns#save',
    method: 'POST',
  },
  // Send
  {
    url: '/campaigns/:id/send',
    ctrl: 'campaigns#send',
    method: 'POST',
  }
];

for (var i in routes) {
  var tmp = route(routes[i]);
}
