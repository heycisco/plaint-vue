export default {
	data() {
		return {
			webpSupported: false,
		};
	},
	data: function () {
		return {
			created: false,
		};
	},
	methods: {
		wepbUrl(url) {
			if (this.webpSupported) {
				return url.replace(/\.\w{1,5}$/, '.webp');
			} else {
				return url;
			}
		},
	},
	created() {
		(async () => {
			const webpData =
				'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';
			const blob = await fetch(webpData).then((r) => r.blob());
			this.webpSupported = await createImageBitmap(blob).then(
				() => true,
				() => false,
			);
			this.created = true;
		})();
	},
};
