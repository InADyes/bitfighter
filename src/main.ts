function greeter(person: string) {
    return "Hello " + person;
}

var user = [0, 1, 2];

window.onload = function() {
    // var canvas = document.getElementById("game");
    // var ctx = canvas.getContext("2d")
    // ctx.fillStyle = "FF0000";
    // ctx.fillRect(0, 0, 150, 75);
    document.body.innerHTML = greeter("yo")
};
