
function newChallenger() {
    var challengerName = document.getElementById("challenger-name")
    if (challengerName == null) {
        console.error("challengerName is empty");
        return;
    }
    var challengerStat = document.getElementById("challenger-stat")
    if (challengerStat == null) {
        console.error("challengerStat is empty");
        return;
    }
}

class Game {
    challenger: Champion | null;
    champion: Champion | null;
    queue: Array<Champion> = [];
    newChallenger(challenger: Champion) {
        this.queue.push(challenger);
    }
    newFight() {

    }
}

class Champion {
    name: string = "";
    status: Status;
    constructor(name: string, status: Status) {
        this.name = name;
        this.status = status
    }
    toString() {
        var value = `challenger: ${this.name}\n`;
        for (let key in this.status) {
            console.log(`key? ${key}`)
        }
    }
}

class Status {
    health: number;
}

window.onload = function() {
    // var canvas = document.getElementById("game");
    // var ctx = canvas.getContext("2d")
    // ctx.fillStyle = "FF0000";
    // ctx.fillRect(0, 0, 150, 75);
    //document.body.innerHTML = greeter("yo")
    var newChallengerButton = document.getElementById("new-challenger")
    if (newChallengerButton == null) {
        console.error("no new-challenger button found");
        return;
    }
    newChallengerButton.addEventListener("click", newChallenger)
};
