import { receiveQueue } from './globalDependencies';

// declare function receiveQueue(data: any): void;

export class Queue {
    private timer: HTMLDivElement;

    constructor (
        private readonly bitfighterDiv: HTMLDivElement,
        //private readonly startTimer: (time: number) => void
    ){}

    handleNewQueue (queue: {
        readonly queue: {
            readonly fanDisplayName: string;
            readonly championTypeName: string;
        }[];
        readonly timer?: number;
    }) {
    
        receiveQueue(queue.queue);
        if (queue.timer) {
            this.startTimer(queue.timer / 1000 + 5);
        }
    }
    
    private startTimer(time: number) {
        let timerDiv = document.createElement('div');
        timerDiv.className = 'timerDiv';
        let challenger = document.createElement('span');
        challenger.className = 'challenger';
        timerDiv.appendChild(challenger);
        let timer = document.createElement('span');
        timer.className = 'timer';
        timerDiv.appendChild(timer);
        challenger.innerText = "NEW CHALLENGER";
        timer.innerText = time.toString();
        this.bitfighterDiv.appendChild(timerDiv);

        window.setTimeout(() => this.updateTimer(timerDiv, timer, time - 1), 1000);
    }
    private updateTimer(timerDiv: HTMLDivElement, timer: HTMLSpanElement, time: number) {
        if (time < 1){
            this.bitfighterDiv.removeChild(timerDiv);
            return;
        }
        timer.innerText = time.toString();
        window.setTimeout(() => this.updateTimer(timerDiv, timer, time - 1), 1000);
    }
}