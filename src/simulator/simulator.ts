// node
import { argv } from 'process';
// internal
import { resultGrid } from './resultGrid';
import { resultStats } from './resultStats';
import { resultEvents } from './resultEvents';
import { resultCount } from './resultCount';
import { resultCountGrid } from './resultCountGrid';

if (argv.length === 7 && argv[6] === 'reel')
    resultEvents();
else if (argv.length === 8 && argv[6] === 'count')
    resultCount();
else if (argv.length === 7)
    resultStats();
else if (argv.length === 4 && argv[3] === 'count')
    resultCountGrid();
else if (argv.length === 3)
    resultGrid();
else
    console.log('bad input');
