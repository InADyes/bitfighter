import { receiveQueue } from './globalDependencies';

// declare function receiveQueue(data: any): void;

export class Queue {
    constructor (
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
            this.buildTimer(queue.timer);
            //this.startTimer(queue.timer);
        }
    }
    
    private buildTimer(time: number) {
        let timer = document.createElement('div');
        
    }
}