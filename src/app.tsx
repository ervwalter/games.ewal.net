import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

class AppState {
    @observable timer = 0;

    constructor() {
        setInterval(() => {
            this.timer += 1;
        }, 1000);
    }

    resetTimer() {
        this.timer = 0;
    }
}

@observer
class TimerView extends React.Component<{ appState: AppState }, {}> {
    render() {
        return (
            <div>
                <nav className="nav" id="masthead">
                    <div className="container">
                        <div className="nav-left">
                            <div className="nav-item">
                                <span className="slashes">//&nbsp;</span>
                                <a href="https://blog.ewal.net" className="is-large">Ewal.net</a>
                            </div>

                        </div>
                    </div>
                </nav>
                <section className="section">
                    <div className="container">
                        Hello, Games!
                    </div>
                </section>
            </div>
        );
    }

    onReset = () => {
        this.props.appState.resetTimer();
    }
};

const appState = new AppState();
ReactDOM.render(<TimerView appState={appState} />, document.getElementById('app'));
