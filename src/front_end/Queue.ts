// import { receiveQueue } from './globalDependencies';

declare function receiveQueue(data: any): void;

export class Queue {
    constructor (
        private readonly queueDiv: HTMLDivElement,
        private readonly startTimer: (time: number) => void
    ){}

    handleNewQueue (queue: {
        readonly queue: {
            readonly fanDisplayName: string;
            readonly championTypeName: string;
        }[];
        readonly timer?: number;
    }) {
    
        receiveQueue(queue.queue);
        this.queueDiv.innerText = "NEXT\n";
        for (let i = 0; i < queue.queue.length; i++) {
            this.queueDiv.innerText += queue.queue[i].fanDisplayName + ' - ' + queue.queue[i].championTypeName + '\n';
        }
        if (queue.timer)
            this.startTimer(queue.timer);
    }
}