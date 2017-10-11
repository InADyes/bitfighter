import { receiveQueue } from './globalDependencies';

// declare function receiveQueue(data: any): void;

export class Queue {
    private timer: HTMLDivElement;

    constructor (
        private readonly timerDiv: HTMLDivElement,
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
            this.startTimer(queue.timer);
            //this.startTimer(queue.timer);

        }
    }
    
    private startTimer(time: number) {
        let timer = document.createElement('div');
        timer.className = 'timer';
        this.timerDiv.appendChild(timer);
        timer.innerText = time.toString();

        window.setTimeout(() => this.updateTimer(timer, time - 1), 1000);
    }
    private updateTimer(timer: HTMLDivElement, time: number) {
        if (time < 1){
            this.timerDiv.removeChild(timer);
            return;
        }
        timer.innerText = time.toString();
        window.setTimeout(() => this.updateTimer(timer, time - 1), 1000);
    }
}