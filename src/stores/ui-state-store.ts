import { observable, computed, action } from 'mobx';

export class UIStateStore {
    @observable public width: number;
    @observable public height: number;

    public constructor() {
        let running = false;
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