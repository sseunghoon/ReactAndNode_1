const proxy = require('http-proxy-middleware');

module.exports = function(app){
	app.use(
		'/api',
			proxy({
			target:'https://reactandnode-2try-jzddk.run.goorm.io/',
			changeOrigin:true,
		})
	);
};