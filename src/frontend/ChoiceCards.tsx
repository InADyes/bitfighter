import * as React from 'react';

import { CharacterCard } from '../shared/interfaces/backToFrontMessage';
import InfoCard from './InfoCard';

interface Props {
    cards:      CharacterCard[];
    endTime:    number;
    callBack:   (character: number) => void; 
}

interface State {
    timeLeft: number;    
}

export default class ChoiceCards extends React.Component{
    public props:       Props;
    public state:       { timeLeft: number };
    private intervalID: number | null = null;

    constructor(props: Props) {
        super(props)
        this.state = {timeLeft: props.endTime - window.performance.now()};
    }

    setInterval() {
        this.intervalID = window.setInterval(
            () => this.setState((s: State): State => {
                if (s.timeLeft < 0 && this.intervalID)
                    this.clearInterval();

                return {timeLeft: s.timeLeft - 1000};
            }),
            1000
        );
    }

    clearInterval() {
        if (this.intervalID !== null) {
            window.clearInterval(this.intervalID);
            this.intervalID = null;
        } 
    }

    componentWillReceiveProps(newProps: Props) {
        this.setState((): State => ({ timeLeft: newProps.endTime - window.performance.now() }));
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
        const currentTime = window.performance.now();
        if (this.props.endTime < currentTime){
            this.clearInterval();
            return null;
        }

        return (
        <div>
            <div id="choiceCards">
                {this.props.cards.map((c, i) =>
                    <InfoCard
                        card={c}
                        onClick={() => this.props.callBack(i)}
                        key={i}
                        />
                )}
            </div>
            <div className="charSelectTimerWrapper">
                <div className="charSelectTimerFlipper">
                    <div className="charSelectTimer">
                        { Math.floor((this.state.timeLeft) / 1000) }
                    </div>
                    <div className="charSelectTimerBack">
                        <img src="../src/images/icons/bitboss.png" id='bitbossEmoji'></img>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}
