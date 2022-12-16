if (process.env.NODE_ENV === 'production') {
	module.exports = () => ({
		plugins: [
			require('postcss-import'),
			require('postcss-custom-media'),
			require('postcss-nested'),
			require('postcss-simple-vars'),
			require('postcss-short'),
			require('postcss-center'),
			require('postcss-mixins'),
			require('postcss-combine-duplicated-selectors')({
				removeDuplicatedProperties: true,
				removeDuplicatedValues: true,
			}),
			require('postcss-calc'),
			require('postcss-flexbugs-fixes'),
			require('postcss-will-change-transition'),
			require('postcss-sort-media-queries'),
			require('postcss-preset-env')({
				autoprefixer: { grid: true },
			}),
		],
	});
} else {
	module.exports = () => ({
		plugins: [
			require('postcss-import'),
			require('postcss-custom-media'),
			require('postcss-nested'),
			require('postcss-simple-vars'),
			require('postcss-short'),
			require('postcss-center'),
			require('postcss-mixins'),
		],
	});
}
