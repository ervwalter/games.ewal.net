import { observable, computed, action } from 'mobx';

export type Tabs = "stats" | "recent" | "top10" | "pending" | "collection";

export class UIStateStore {
    @observable public width: number;
    @observable public height: number;
    @observable public activeTab: Tabs;

    public constructor() {
        let running = false;
        this.activeTab = "recent";
        window.addEventListener('resize', () => {
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

    @action public changeTab(newTab: Tabs) {
        this.activeTab = newTab;
    }

    @action private resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        return;
    }

    @computed public get isMobile() {
        if (this.width < 768) {
            return true;
        }
        return false;
    }
}

const singleton = new UIStateStore();
export default singleton;