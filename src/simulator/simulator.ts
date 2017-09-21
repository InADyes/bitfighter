// node
import * as process from 'process';
// internal
import { resultGrid } from './resultGrid';
import { resultStats } from './resultStats';
import { resultEvents } from './resultEvents';

if (process.argv.length == 7 && process.argv[6] === 'reel') {
    resultEvents();
} else if (process.argv.length == 7) {
    resultStats()
} else if (process.argv.length === 3) {
    resultGrid();
} else {
    console.log('bad input');
}
