import * as Sentry from "@sentry/browser";
import OstrioAnalytics from "ostrio-analytics";

class Tracker {
	private ostrioIdentifier?: string;
	private gaguesIdentifier?: string;
	private isInitialized: boolean = false;
	private ostrioTracker?: { track(): void };
	private DNT: boolean = navigator.doNotTrack === "1";

	public init(options: { gaugesIdentifier?: string; ostrioIdendifier?: string; sentryDSN?: string; sentryRelease?: string }) {
		if (this.DNT) {
			this.log("I respect your decision to be not tracked. Analytics & error tracking have been");
			this.log("disabled. Learn more about DNT: https://en.wikipedia.org/wiki/Do_Not_Track");
			this.log(`Sincerely, ${window.location.origin}`);
			this.isInitialized = true;
			return;
		}

		this.ostrioIdentifier = options.ostrioIdendifier;
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

		if (this.ostrioIdentifier) {
			// trigger ostr.io tracker
			if (!this.ostrioTracker) {
				this.ostrioTracker = new OstrioAnalytics(this.ostrioIdentifier, false);
			}
			this.ostrioTracker!.track();
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

	private log = (message: string) =>
		console.info.bind(console) ||
		console.log.bind(console) ||
		function(message: string) {
			return;
		};
}

export default new Tracker();
