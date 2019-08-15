import Analytics from "ostrio-analytics";

interface IAnalyticsTracker {
	track(): void;
	pushEvent(key: string, value: string): void;
}

const analyticsTracker: IAnalyticsTracker = new Analytics("68bCGRQxE8hcjya6P", false);
export default analyticsTracker;
