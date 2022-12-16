module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/plaint-test/' : '/',
	productionSourceMap: false,

	css: {
		loaderOptions: {
			css: {},
			postcss: {},
		},
		sourceMap: true,
	},
};
