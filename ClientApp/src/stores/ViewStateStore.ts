import { action, computed, observable } from "mobx";

export type Tabs =
  | "stats"
  | "recentPlays"
  | "mostPlays"
  | "top10"
  | "pending"
  | "collection";

export class ViewStateStore {
  @observable public width: number = 0;
  @observable public height: number = 0;
  @observable public activeTab: Tabs;

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
