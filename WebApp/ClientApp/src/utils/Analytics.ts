import * as Sentry from "@sentry/browser";

class Tracker {
	private matomoIdentifier?: { hostname: string; siteId: string };
	private gaguesIdentifier?: string;
	private isInitialized: boolean = false;
	private DNT: boolean = navigator.doNotTrack === "1";

	public init(options: { gaugesIdentifier?: string; matomoIdentifier?: { hostname: string; siteId: string }; sentryDSN?: string; sentryRelease?: string }) {
		if (this.DNT) {
			this.log("I respect your decision to be not tracked. Analytics & error tracking have been");
			this.log("disabled. Learn more about DNT: https://en.wikipedia.org/wiki/Do_Not_Track");
			this.log(`Sincerely, ${window.location.origin}`);
			this.isInitialized = true;
			return;
		}

		this.matomoIdentifier = options.matomoIdentifier;
		this.gaguesIdentifier = options.gaugesIdentifier;

		// initialize Sentry.io
		if (!this.DNT && options.sentryDSN) {
			if (options.sentryRelease) {
				Sentry.init({ dsn: options.sentryDSN, release: options.sentryRelease });
			} else {
				Sentry.init({ dsn: options.sentryDSN });
			}
		}

		this.isInitialized = true;
	}
	public track = () => {
		// skip tracking if DNT is enabled, or if things haven't been intiaized
		if (this.DNT || !this.isInitialized) {
			return;
		}

		if (this.matomoIdentifier) {
			const w = window as any;
			const matomo = w._paq;
			const siteId = this.matomoIdentifier.siteId;
			const hostname = this.matomoIdentifier.hostname;
			if (!matomo) {
				let _paq = w._paq || [];
				_paq.push(["trackPageView"]);
				_paq.push(["enableLinkTracking"]);
				(function() {
					var u = `https://${hostname}.matomo.cloud/`;
					_paq.push(["setTrackerUrl", u + "matomo.php"]);
					_paq.push(["setSiteId", siteId]);
					var d = document,
						g = d.createElement("script"),
						s = d.getElementsByTagName("script")[0];
					g.type = "text/javascript";
					g.async = true;
					g.defer = true;
					g.src = `//cdn.matomo.cloud/${hostname}.matomo.cloud/matomo.js`;
					s.parentNode!.insertBefore(g, s);
				})();
			} else {
				matomo.push(["setCustomUrl", window.location.pathname]);
				matomo.push(["setDocumentTitle", document.title]);
				matomo.push(["deleteCustomVariables", "page"]);
				matomo.push(["setGenerationTimeMs", 0]);
				matomo.push(["trackPageView"]);
				setImmediate(() => {
					matomo.push(["enableLinkTracking"]);
				});
			}
		}

		if (this.gaguesIdentifier) {
			// trigger gaug.es tracker
			const w = window as any;
			const gauges = w._gauges;
			if (!gauges) {
				// initialize gaug.es tracker which auto tracks once when loaded
				w._gauges = w._gauges || [];
				(() => {
					const t = document.createElement("script");
					t.type = "text/javascript";
					t.async = true;
					t.id = "gauges-tracker";
					t.setAttribute("data-site-id", this.gaguesIdentifier);
					t.setAttribute("data-track-path", "https://track.gaug.es/track.gif");
					t.src = "https://d2fuc4clr7gvcn.cloudfront.net/track.js";
					const s = document.getElementsByTagName("script")[0];
					s && s.parentNode && s.parentNode.insertBefore(t, s);
				})();
			} else {
				gauges.push(["track"]);
			}
		}
	};

	private log =
		console.info.bind(console) ||
		console.log.bind(console) ||
		function() {
			return;
		};
}

export default new Tracker();
