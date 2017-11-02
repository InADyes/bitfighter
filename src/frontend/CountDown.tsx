import * as React from 'react';

export default class CountDown extends React.Component {
    public props: {
        time?: number;
    };
    public state: {time: number};
    private intervalID: number | null;

    constructor(props: {time?: number}) {
        super(props);
        this.state = {
            time: props.time || -1
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
            () => this.setState((s: {time: number}) => {
                if (s.time < 0 && this.intervalID)
                    this.clearInterval();

                return {time: s.time - 1};
            }),
            1000
        );
    }

    componentWillReceiveProps(newProps: {time: number}) {
        this.setState(() => newProps);
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
        if (this.state.time >= 0)
            return <div id="countDown">{this.state.time}</div>
        return null;
    }
}
