import { action, computed, observable } from "mobx";

export type Tabs = "stats" | "recentPlays" | "mostPlays" | "top10" | "pending" | "collection" | "playedNotOwned";

export class ViewStateStore {
	@observable public width: number = 0;
	@observable public height: number = 0;
	@observable public activeTab: Tabs;
	@observable public showPlayedNotOwned: boolean = false;

	public constructor() {
		let running = false;
		this.activeTab = "recentPlays";
		window.addEventListener("resize", () => {
			if (!running) {
				running = true;
				window.requestAnimationFrame(() => {
					this.resize(window.innerWidth, window.innerHeight);
					running = false;
				});
			}
		});

		this.resize(window.innerWidth, window.innerHeight);

		let clickCount = 0;
		const root = document.getElementById("root");
		if (root) {
			root.addEventListener("click", (event) => {
				const wrapper = document.getElementById("wrapper");
				if (event.target === wrapper) {
					clickCount++;
					if (clickCount === 1) {
						setTimeout(() => { clickCount = 0; }, 2000);
					}
					else if (clickCount === 5) {
						this.showPlayedNotOwned = true;
					}
				}
			});
		}


	}

	@action
	public changeTab(newTab: Tabs) {
		this.activeTab = newTab;
	}

	@action
	private resize(width: number, height: number) {
		this.width = width;
		this.height = height;
		return;
	}

	@computed
	public get isMobile() {
		if (this.width < 768) {
			return true;
		}
		return false;
	}
}
