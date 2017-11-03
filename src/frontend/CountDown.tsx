import * as React from 'react';

interface Props {
    endTime: number;
}

interface State {
    timeLeft: number;    
}

export default class CountDown extends React.Component {
    public props:       Props;
    public state:       State;
    private intervalID: number | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            timeLeft: Math.floor((props.endTime - window.performance.now()) / 1000)
        };
    }

    clearInterval() {
        if (this.intervalID !== null) {
            window.clearInterval(this.intervalID);
            this.intervalID = null;
        } 
    }

    setInterval() {
        this.intervalID = window.setInterval(
            () => this.setState((s: {endTime: number}) => {
                if (s.endTime < 0 && this.intervalID)
                    this.clearInterval();

                return {endTime: s.endTime - 1};
            }),
            1000
        );
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState((): State => ({
            timeLeft: newProps.endTime - window.performance.now()
        }));
        this.clearInterval();
        this.setInterval();
    }

    componentDidMount() {
        this.setInterval();
    }

    componentWillUnmount() {
        this.clearInterval();
    }

    render() {
        if (this.state.timeLeft >= 0)
            return (
                <div className="endTimerDiv">
                    <span className="challenger">NEW CHALLENGER</span>
                    <span className="endTimer">{this.state.timeLeft}</span>
                </div>
            )
        return null;
    }
}
