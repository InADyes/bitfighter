import * as React from 'react';

export default class CountDown extends React.Component {
    public props: {
        time: number;
    };
    public state: {time: number};
    private intervalID: number;

    constructor(props: {time: number}) {
        super(props);
        this.state = props;
    }

    componentDidMount() {
        // this.intervalID = window.setInterval(
        //     () => {
        //         this.setState({time: this.state.time});
        //     }
        // );
    }

    componentWillUnmount() {
        console.log('unmount');
    }

    render() {
        return <div id="countDown">{this.state.time}</div>
    }
}
