// function DrawCharacter(Combatant: Combatant, ctx: CanvasRenderingContext2D, x: number, y:number)
// {
//     var champCharac = new Image();
//     var challenCharac = new Image();
//     var champicon = new Image();
//     champCharac.src = Combatant.art;
//     champCharac.onload = function(){
//         if (ctx == null)
//             return;
//         ctx.drawImage(champCharac, x+20, y, 100, 100);
//     }
//     champicon.src = Combatant.icon;
    
//     champicon.onload = function(){
//         if (ctx == null)
//             return;
//         ctx.drawImage(champicon, x, y+122, 30,30);
//     }

//     ctx.beginPath();
//     ctx.strokeStyle = "red";
//     ctx.lineWidth = 5;
//     ctx.moveTo(x,y+120);
//     ctx.lineTo(x+Combatant.status.health, y+120);
//     ctx.stroke();
    
//     ctx.font = "15px Arial";
//     ctx.fillText(Combatant.name, x+10,y+115);

//     ctx.font ="10px Arial";
//     ctx.fillText("power: "+String(Combatant.status.power), x+30, y+137);
    
//     ctx.font ="10px Arial";
//     ctx.fillText("heal: "+String(Combatant.status.heal), x+30, y+147);
    
// }




//  function tickCanvas(game: Game, canvas: HTMLCanvasElement) {
// //     let ctx = game.canvas.getContext("2d");
// //     if (ctx == null) {
// //         console.error("why is ctx null, wtf");
// //         return;
// //     } 
// //     ctx.clearRect(0, 0, game.canvas.height, game.canvas.width);
// //     ctx.font = "30px Arial";
// //     ctx.fillText(String(game.counter), 10, 50);
// //     game.counter++;
// // }
// let ctx = canvas.getContext("2d");
// if (ctx == null) {
//     console.error("why is ctx null, wtf");
//     return;
// } 
// ctx.clearRect(0, 0, canvas.width, canvas.height);
// //ctx.font = "30px Arial";
// //ctx.fillText(String(game.counter), 10, 50);
// //game.counter++;
// //  var time = 1;
// //  var delayMillis = 100;

// //var challenCharac = new Image();

// //var challenicon = new Image();
// //  var img3 = new Image();
// // var img

// //challenCharac.src = "images/Combatant_alpha.png";

// //img2.src = "images/soilder1-1.jpg";
// // img3.src = "images/soilder1-2.jpg";
// //ctx.save();
// //var time = new Date();
// //ctx.rotate()
// if (game.Combatant != null)
//     {
//         DrawCharacter(game.Combatant, ctx, 40,30);
//     }

// if (game.challenger != null)
//     {
//         DrawCharacter(game.challenger, ctx, 160,30);

//     }
//    // console.log("zzzzzzz");
//    for (let i = 0; i < game.graveyard.length; i++)
//     {
//         let graveyardicon = new Image();
//         graveyardicon.src = game.graveyard[i].icon;
//         graveyardicon.onload = function(){
//             if (ctx == null)
//                 return;
//             ctx.drawImage(graveyardicon, 10, 10+i*21, 20,20);            
//         }
//     }
// //ctx.save();
// /*if (game.challenger != null)
//     {
//         challenCharac.onload = function(){
//             if (ctx == null)
//                 return;
//             ctx.drawImage(challenCharac, 530, 100, 100, 200);
//         }
        
//         challenicon.src = game.challenger.icon;
//         challenicon.onload = function(){
//             if (ctx == null)
//                 return;
//             ctx.drawImage(challenicon, 530, 50, 50, 50);
//         }

//         //ctx.restore();
//         //ctx.restore();
        
        
//         ctx.strokeStyle = "red";
//         ctx.lineWidth = 5;
//         ctx.moveTo(530,320);
//         ctx.lineTo(530+game.challenger.status.health, 320);
//         ctx.stroke();
        
//         ctx.font = "25px Arial";
//         ctx.fillText(game.challenger.name, 565,305);
//         ctx.font ="10px Arial";
//         ctx.fillText("power: "+String(game.challenger.status.power), 530, 335);
        
//         ctx.font ="10px Arial";
//         ctx.fillText("heal: "+String(game.challenger.status.heal), 530, 350);
       
//     }*/


// //  img1.width = 40;
// //  img1.height = 100;
// //  img1.
// //ctx.drawImage(img1, -100, -100);
// // setTimeout(function(){}, delayMillis);
// // ctx.drawImage(img2, -100, -100);
// // setTimeout(function(){}, delayMillis);
// // ctx.drawImage(img3, -100, -100);
// // time ++;


// }