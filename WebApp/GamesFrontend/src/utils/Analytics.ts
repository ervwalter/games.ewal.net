import * as Sentry from "@sentry/browser";

class Tracker {
	private matomoIdentifier?: { hostname: string; siteId: string };
	private gaguesIdentifier?: string;
	private sentryDSN?: string;
	private isInitialized: boolean = false;
	private isTrackingStarted: boolean = false;
	private DNT: boolean = navigator.doNotTrack === "1";
	private userId?: string;
	private isMatomoUserIdSet: boolean = false;

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
			this.sentryDSN = options.sentryDSN;
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
			const siteId = this.matomoIdentifier.siteId;
			const hostname = this.matomoIdentifier.hostname;
			const w = window as any;
			let paq = w._paq;
			if (!paq) {
				w._paq = w._paq || [];
				paq = w._paq;
				paq.push(["trackPageView"]);
				paq.push(["enableLinkTracking"]);
				paq.push(["enableHeartBeatTimer"]);
				(function() {
					var u = `https://${hostname}/`;
					paq.push(["setTrackerUrl", u + "matomo.php"]);
					paq.push(["setSiteId", siteId]);
					var d = document,
						g = d.createElement("script"),
						s = d.getElementsByTagName("script")[0];
					g.type = "text/javascript";
					g.async = true;
					g.defer = true;
					g.src = u + "matomo.js";
					s.parentNode!.insertBefore(g, s);
				})();
			} else {
				paq.push(["setCustomUrl", window.location.pathname]);
				paq.push(["setDocumentTitle", document.title]);
				paq.push(["deleteCustomVariables", "page"]);
				paq.push(["setGenerationTimeMs", 0]);
				if (this.userId) {
					paq.push(["setUserId", this.userId]);
					this.isMatomoUserIdSet = true;
				} else if (this.isMatomoUserIdSet) {
					paq.push(["resetUserId"]);
				}
				paq.push(["trackPageView"]);
				// run this after the render completes and the DOM is updated
				setImmediate(() => {
					paq.push(["enableLinkTracking"]);
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

	public logEvent = (key: string, value: string) => {
		if (!this.isTrackingStarted) {
			return;
		}
	};

	public setUser = (userId: string) => {
		if (!this.isTrackingStarted) {
			return;
		}

		if (this.sentryDSN) {
			Sentry.setUser({ id: userId });
		}

		this.userId = userId;
	};

	public clearUser = () => {
		if (!this.isTrackingStarted) {
			return;
		}
		if (this.sentryDSN) {
			Sentry.configureScope(scope => scope.clear());
		}

		this.userId = undefined;
	};

	private log =
		console.info.bind(console) ||
		console.log.bind(console) ||
		function() {
			return;
		};
}

export default new Tracker();
