import * as Sentry from "@sentry/browser";
import OstrioAnalytics from "ostrio-analytics";

const log =
	console.info.bind(console) ||
	console.log.bind(console) ||
	function() {
		return;
	};

const DNT = navigator.doNotTrack === "1";
if (DNT) {
	log("We respect your decision to be not tracked. Analytics tracking has been disabled for you.");
	log("Learn more about DNT: https://en.wikipedia.org/wiki/Do_Not_Track");
	log("Sincerely, https://trendweight.com");
}

if (!DNT) {
	Sentry.init({ dsn: "https://fa2b74a3356e44ae949f9bf9938fdbc0@sentry.io/1531751" });
}

let ostrioTracker: { track(): void };

class Tracker {
	public track = () => {
		// skip tracking if DNT is enabled
		if (DNT) {
			return;
		}

		// trigger ostr.io tracker
		if (!ostrioTracker) {
			ostrioTracker = new OstrioAnalytics("68bCGRQxE8hcjya6P", false);
		}
		ostrioTracker.track();

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
				t.setAttribute("data-site-id", "5c94e5859482cb34c9ee7690");
				t.setAttribute("data-track-path", "https://track.gaug.es/track.gif");
				t.src = "https://d2fuc4clr7gvcn.cloudfront.net/track.js";
				const s = document.getElementsByTagName("script")[0];
				s && s.parentNode && s.parentNode.insertBefore(t, s);
			})();
		} else {
			gauges.push(["track"]);
		}
	};
}

export default new Tracker();
