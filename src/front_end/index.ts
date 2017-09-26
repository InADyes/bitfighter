import { GameState } from './gamestate/Gamestate';
import { Message, CharacterChoice } from '../shared/frontEndMessage';

document.addEventListener("DOMContentLoaded", function(){
    const gameState = new GameState(`arena`);
    
    window.addEventListener('storage', (e) => {
        console.log(e)
        const str = e.newValue;
        if (str == undefined) {
            console.error('bad storage event value');
            return;
        }
        switch(e.key) {
            case 'fight':
                const message = <Message>JSON.parse(str);
                console.log(message.reel);
                gameState.newMessage(message.reel, message.characters, message.patch);
                break;
            case 'characterChoice':
                console.log(JSON.parse(str));
                // characterSelect
                break;
            case 'choiceResult':
                break;
            default:
                console.error('unidentified storage event');
        }
    });

    const button0 = <HTMLButtonElement>document.getElementById('button-0');
    const button1 = <HTMLButtonElement>document.getElementById('button-1');
    const button2 = <HTMLButtonElement>document.getElementById('button-2');
    const test = <HTMLButtonElement>document.getElementById('test');
    test.addEventListener('click', () => {
        let x = <HTMLInputElement>document.getElementById('scale');
        if (x.value)
            gameState.setNewScale(Number(x.value));
    });


    button0.addEventListener('click', () => {
        characterChoice(0);
    });
    button1.addEventListener('click', () => {
        characterChoice(1);
    });
    button2.addEventListener('click', () => {
        characterChoice(2);
    });



    function characterChoice(choice: number) {
        const characterChoice: CharacterChoice = { choice };
        localStorage.setItem('choiceResult', JSON.stringify(characterChoice));
    }
  
    changeImage();
});


// TEMP
function changeImage(){
    let imageID = 0;
    
    setInterval(function(){
        //change the image
        let x = <HTMLImageElement>document.getElementById("myimage");
        if(!imageID){
            x.src="./temp/sample.png";
            imageID++;
        }else if(imageID==1){
            x.src="./temp/sample3.png";
            imageID++;
        }else if(imageID==2){
            x.src="./temp/sample4.png";
            imageID++;
        }else if(imageID==3){
            x.src="./temp/sample5.png";
            imageID++;
        }else{if(imageID==4){
            x.src="./temp/sample6.png";
            imageID=0;
        }}
    },
    10000);
}