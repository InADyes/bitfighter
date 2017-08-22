
function newChallenger(game: Game) {
    let nameNode = <HTMLInputElement>document.getElementById("challenger-name")
    if (nameNode == null) {
        console.error("challengerName is empty");
        return;
    }
    let statNode = <HTMLInputElement>document.getElementById("challenger-stat")
    if (statNode == null) {
        console.error("challengerStat is empty");
        return;
    }
    let name = nameNode.value;
    let health = Number(statNode.value);

    game.newChallenger(new Champion(name, {health: health}));
}

class Game {
    challenger: Champion | null;
    champion: Champion | null;
    queue: Champion[] = [];
    handleNewChallenger: (challenger: Champion) => void;
    handleNewFight: (queue: Champion[]) => Champion | null;
    handleTickFight: (chamption: Champion, challenger: Champion) => void;
    constructor(
        handleNewChallenger: (challenger: Champion) => void,
        handleNewFight: (queue: Champion[]) => Champion,
        handleTickFight: (chamption: Champion, challenger: Champion) => void) {
            this.handleNewChallenger = handleNewChallenger;
            this.handleNewFight = handleNewFight;
            this.handleTickFight = handleTickFight;
        }
    newChallenger(challenger: Champion) {
        this.handleNewChallenger(challenger);
        this.queue.push(challenger);
    }
    newFight() {
        if (this.challenger != null) {
            console.error(`new fight error, challenger already exists: ${this.challenger}`)
            return;
        }
        let challenger = this.handleNewFight(this.queue)
        if (challenger == null) {
            console.error("no challenger picked");
            return ;
        }
        console.log(`new fight: ${challenger}`)
        if (this.champion != null)
            this.challenger = challenger;
        else {
            console.log("no champion, challener becomes champion");
            this.champion = challenger;
        }

    }
    tickFight() {
        if (this.challenger == null) {
            console.error("cannot tick fight, missing challenger");
            return ;
        }
        if (this.champion == null) {
            console.error("cannot tick fight, missing champion");
            return ;
        }

        this.handleTickFight(this.champion, this.challenger); //todo: how does this set stuff to null?
    }
}

class Champion {
    name: string;
    status: Status;
    constructor(name: string, status: Status) {
        this.name = name;
        this.status = status
    }
    toString() {
        var str = `${this.name}\n`;
        for (let key in this.status) {
            str += `   ${key}: ${this.status[key]}\n`;
        }
        return str;
    }
}

interface Status {
    health: number;
}

window.onload = function() {
    let game = new Game(
        function(challenger: Champion) {
            console.log(`new challenger: ${challenger}`);
        },
        function(queue: Champion[]) {
            return queue.pop();
        },
        function(champion: Champion, challenger: Champion) {
            console.log("fight tick");
        }
    );
    var newChallengerButton = document.getElementById("new-challenger")
    if (newChallengerButton == null) {
        console.error("no new-challenger button found");
        return;
    }
    newChallengerButton.addEventListener("click", function(){
        newChallenger(game)
    });
    var newChallengerButton = document.getElementById("new-fight")
    if (newChallengerButton == null) {
        console.error("no new-fight button found");
        return;
    }
    newChallengerButton.addEventListener("click", function(){
        game.newFight();
    });
    var newChallengerButton = document.getElementById("tick-fight")
    if (newChallengerButton == null) {
        console.error("no tick-fight button found");
        return;
    }
    newChallengerButton.addEventListener("click", function(){
        game.tickFight();
    });
};
