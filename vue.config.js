module.exports = {
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
	productionSourceMap: false,

	css: {
		loaderOptions: {
			css: {},
			postcss: {},
		},
		sourceMap: true,
	},
};
