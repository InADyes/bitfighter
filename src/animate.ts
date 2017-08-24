/// <reference path="GameTemplate.ts" />

 function tickCanvas(game: Game, canvas: HTMLCanvasElement) {
//     let ctx = game.canvas.getContext("2d");
//     if (ctx == null) {
//         console.error("why is ctx null, wtf");
//         return;
//     }
//     ctx.clearRect(0, 0, game.canvas.height, game.canvas.width);
//     ctx.font = "30px Arial";
//     ctx.fillText(String(game.counter), 10, 50);
//     game.counter++;
// }
let ctx = canvas.getContext("2d");
if (ctx == null) {
    console.error("why is ctx null, wtf");
    return;
} 
ctx.clearRect(0, 0, canvas.height, canvas.width);
//ctx.font = "30px Arial";
//ctx.fillText(String(game.counter), 10, 50);
//game.counter++;
//  var time = 1;
//  var delayMillis = 100;
var champCharac = new Image();
var challenCharac = new Image();
var champicon = new Image();
var challenicon = new Image();
//  var img3 = new Image();
// var img
champCharac.src = "images/champion_alpha.png";
challenCharac.src = "images/champion_alpha.png";

//img2.src = "images/soilder1-1.jpg";
// img3.src = "images/soilder1-2.jpg";
//ctx.save();
//var time = new Date();
//ctx.rotate()
if (game.champion != null)
    {
        
        champCharac.onload = function(){
            if (ctx == null)
                return;
            ctx.drawImage(champCharac, 0, 300, 100, 200);
        }
        champicon.src = game.champion.icon;
        
        champicon.onload = function(){
            if (ctx == null)
                return;
            ctx.drawImage(champicon, 0, 250, 50,50);
        }
        

        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.moveTo(10,520);
        ctx.lineTo(10+game.champion.status.health, 520);
        ctx.stroke();

        ctx.font ="15px Arial";
        ctx.fillText("power: "+String(game.champion.status.power), 10, 535);
        
        ctx.font ="15px Arial";
        ctx.fillText("heal: "+String(game.champion.status.heal), 10, 550);
        
    }

//ctx.save();
if (game.challenger != null)
    {
        challenCharac.onload = function(){
            if (ctx == null)
                return;
            ctx.drawImage(challenCharac, 600, 300, 100, 200);
        }
        
        challenicon.src = game.challenger.icon;
        challenicon.onload = function(){
            if (ctx == null)
                return;
            ctx.drawImage(challenicon, 600, 250, 50, 50);
        }
        
        //ctx.restore();
        //ctx.restore();
        
        
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.moveTo(630,520);
        ctx.lineTo(630+game.challenger.status.health, 520);
        ctx.stroke();
        
        ctx.font ="15px Arial";
        ctx.fillText("power: "+String(game.challenger.status.power), 630, 535);
        
        ctx.font ="15px Arial";
        ctx.fillText("heal: "+String(game.challenger.status.heal), 630, 550);
       
    }


//  img1.width = 40;
//  img1.height = 100;
//  img1.
//ctx.drawImage(img1, -100, -100);
// setTimeout(function(){}, delayMillis);
// ctx.drawImage(img2, -100, -100);
// setTimeout(function(){}, delayMillis);
// ctx.drawImage(img3, -100, -100);
// time ++;


}