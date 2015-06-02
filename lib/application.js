var koa = require('koa')
	, app = koa()
	, serve = require('koa-static')
	, console = require('color-console')
	, pkg = require('./../package.json')
	, options = require('./options')
	, views = require('koa-views');

// Main
module.exports = function() {
	console.green('-------------');
	console.green('Baxel ' + pkg.version);
	console.green('-------------\n');
	console.green('Configuration');
	 
	// If publicPath is null we don't serve static files
	if (options.server.publicPath != null) {
		console.green('\tStatic files:\t' + options.server.publicPath);
		app.use(serve(options.server.publicPath));
	} else {
		console.yellow('\tStatic files:\tOff');
	}
	
	console.green('\tSetup view engine');
	app.use(views(options.viewPath, options.view));
	
	app.use(function *(next){
		console.grey('\t' + this.request.method + '\t' +this.request.url);
		yield next;
	});
	
	var router = require('./router')();
	
	app
	  .use(router.routes())
	  .use(router.allowedMethods());
	  
	console.grey('\nwaiting to server start running (baxel.run)\n');
	
	// Return Baxel
	return {
		app: app,
		run: function () {
			console.green('Server running on port ' + options.server.port);
			app.listen(options.server.port);
		}
	};
};