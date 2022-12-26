if (process.env.NODE_ENV === 'production') {
	module.exports = () => ({
		plugins: [
			require('postcss-import'),
			require('postcss-custom-media'),
			require('postcss-simple-vars'),
			require('postcss-mixins'),
			require('postcss-short'),
			require('postcss-center'),
			require('postcss-nested'),
			require('postcss-sort-media-queries'),
			require('postcss-flexbugs-fixes'),
			require('webp-in-css/plugin.js'),
			require('postcss-will-change-transition'),
			require('cssnano')({
				preset: [
					'advanced',
					{
						normalizeWhitespace: true,
						cssDeclarationSorter: { order: 'smacss' },
						discardComments: { removeAll: true },
					},
					// Preset options: https://cssnano.co/docs/what-are-optimisations/
				],
			}),
		],
	});
} else {
	module.exports = () => ({
		plugins: [
			require('postcss-import'),
			require('postcss-custom-media'),
			require('postcss-simple-vars'),
			require('postcss-mixins'),
			require('postcss-short'),
			require('postcss-center'),
			require('postcss-nested'),
			require('cssnano')({
				preset: [
					'lite',
					{
						normalizeWhitespace: false,
						discardComments: false,
						cssDeclarationSorter: { order: 'smacss' },
					},
				],
			}),
		],
	});
}
