import * as Display from './front_end/Display';

document.addEventListener("DOMContentLoaded", function(){
    let display = new Display.Display;

    window.addEventListener('storage', (e) => {
        console.log(e)
        switch(e.key) {
            case 'reel':
                let str = e.newValue;
                if (str == undefined) {
                    console.error('bad storage event value');
                    break;
                }
                display.newReel(JSON.parse(str));
                break;
            default:
                console.error('unidentified storage event');
        }
    });
});
