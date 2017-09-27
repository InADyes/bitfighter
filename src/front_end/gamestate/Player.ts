import 'fabric'
declare let fabric: any;

export class Player {
    private name:           string;
    private baseHealth:     number;
    private health:         number;
    private right:          number;
    private img:            fabric.Object;
    private healthtext:     fabric.Group;
    private greenBar:  fabric.Rect;
    private redBar:   fabric.Rect;
    private yellowBar:   fabric.Rect;
    private whiteBar:    fabric.Rect;
    private displayname:    fabric.Text;
    private displaynametop: fabric.Text;
    private canvas:         fabric.Canvas;
    private center:         number;
    private trueWidth:      number;
    private artIndex:       number;
    private textQueue:      any[];
    private buffs:          number[];
    private buffGroup:      fabric.Group;
    private scale:          number; 
    private art = [
        "images/characters/stickFigures/0StreetUrchin.png",
        "images/characters/stickFigures/1SculleryMaid.png",
        "images/characters/stickFigures/2Farmer.png",
        "images/characters/stickFigures/3Barkeep.png",				
        "images/characters/stickFigures/4Aristocrat.png",	
        "images/characters/stickFigures/5Minstrel.png",
        "images/characters/stickFigures/6Mage.png",
        "images/characters/stickFigures/7Rogue.png",	
        "images/characters/stickFigures/8Gladiator.png",		
        "images/characters/stickFigures/9Barbarian.png",	
        "images/characters/stickFigures/10Warpriest.png",		
        "images/characters/stickFigures/11Werewolf.png",
        "images/characters/stickFigures/12Warlock.png",	
        "images/characters/stickFigures/13Paladin.png",
        "images/characters/stickFigures/14Swashbuckler.png",
        "images/characters/stickFigures/15Dragon.png",
        "images/characters/stickFigures/16Phoenix.png",
        "images/characters/stickFigures/17Lich.png",
        "images/characters/stickFigures/18Angel.png"
    ];
    private buffArt = [
        "images/icons/buff1.png",
        "images/icons/buff2.png",
        "images/icons/buff3.png"
    ]
    private height =        70;
    private hpWidth =       5;
    private textLock =      0;
    private animationLock = 0;
    private nameheight =    120;
    private strokeWidith =  2;
    private fontSize =      15;
    private font =          'Concert One'
    private iconwidth =     10;
    private icontop =       133;

    // Adjust these to move elements around
    private artAdjust =     0;
    private hpAdjust =      5;
    private artTop =        120;
    private hpTextTop =     33;
    private textTop =       30;

    constructor(data: any, side: number, canvas: fabric.Canvas, scale: number) {
        this.name = data.name;
        this.health = data.currentHitPoints;
        this.artIndex = data.art;
        this.baseHealth = data.maxHitPoints;
        this.right = side;
        this.canvas = canvas;
        this.scale = scale;
        this.center = this.canvas.getWidth() / 2;
        this.textQueue = [];
        this.buffs = [];
        this.animationLock = 0;
    }

    public addBuff(buff: number, duration: number) {
        this.buffs.push(buff);
        console.log(`added! ${this.buffs}`);
        this.drawBuffs();
        setTimeout(() => {
            // remove this particular buff from the array
            let i = this.buffs.indexOf(buff);
            if (i > -1)
                this.buffs.splice(i, 1);
            console.log(`removed! ${ this.buffs }`);
            this.drawBuffs();
        }, duration);
        this.drawBuffs();
    }

    private drawBuffs() {
        if (this.buffGroup)
            this.canvas.remove(this.buffGroup);
        this.buffGroup = new fabric.Group([],{
            left:0,
            top:0
        });
        this.canvas.add(this.buffGroup);
        for (let i = 0; i < this.buffs.length; i++) {
            new fabric.Image.fromURL(this.buffArt[this.buffs[i]], (oImg: fabric.Image) => {
                let currentbuff = oImg.set({
                    left: !this.right ? this.center - this.trueWidth + this.iconwidth * i  : this.center  + this.iconwidth *(i+1) ,
                    top: this.icontop * this.scale,
                    height: 10,
                    width: 10
                });
                this.buffGroup.addWithUpdate(currentbuff);
                this.canvas.renderAll();
            });
        }
    }

    public draw() {
        if (this.img)
            this.canvas.remove(this.img);
        new fabric.Image.fromURL(this.art[this.artIndex], (oImg: fabric.Image) => {
            if(oImg.width && oImg.height)
                this.trueWidth = oImg.width/oImg.height * 70 * this.scale;
            this.img = oImg.set({
                left: !this.right ? (this.center - this.trueWidth / 2) - this.artAdjust : (this.center + this.trueWidth / 2) + this.artAdjust,
                top: this.artTop * this.scale,
                originX: 'center',
                originY: 'bottom',
                flipX: !this.right ? false : true
            });
            this.img.scaleToHeight(70 * this.scale);
            this.canvas.add(this.img);
            this.drawHealthText();
            this.drawHpBar();
            this.drawname();
        });
    }
    private drawname() {
        if (this.displayname)
            this.canvas.remove(this.displayname);
        if (this.displaynametop)
            this.canvas.remove(this.displaynametop);
        this.displayname = new fabric.Text(this.name, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            strokeWidth: this.strokeWidith * this.scale,
            fill: 'white',
            fontWeight: 'bold',
            stroke: 'white',
            top: this.nameheight * this.scale,
            left: !this.right ? this.center  - this.trueWidth / 2:this.center + this.trueWidth / 2,
            originX: 'center'
        });
        this.displaynametop = new fabric.Text(this.name, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            fill: 'black',
            fontWeight: 'bold',
            top: this.nameheight * this.scale,
            left: !this.right ? this.center  - this.trueWidth / 2:this.center + this.trueWidth / 2,
            originX: 'center'
        });
        this.canvas.add(this.displayname);
        this.canvas.add(this.displaynametop);
    }
    private drawHpBar() {
        let missingHeight = this.height * (this.health / this.baseHealth);
        let leftOffset = this.center - this.trueWidth - this.hpAdjust;
        let rightOffset = this.center + this.trueWidth + this.hpAdjust;

        if (this.greenBar)
            this.canvas.remove(this.greenBar);
        if (this.redBar)
            this.canvas.remove(this.redBar);
        if (this.yellowBar)
            this.canvas.remove(this.yellowBar);
        if (this.whiteBar)
            this.canvas.remove(this.whiteBar);
        this.greenBar = new fabric.Rect({
            left: !this.right ? leftOffset : rightOffset,
            top: this.artTop * this.scale,
            fill: '#1eedce',
            blur: 0.5,
            height: missingHeight * this.scale,
            width: this.hpWidth * this.scale,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.redBar = new fabric.Rect({
            left: !this.right ? leftOffset : rightOffset,
            top: this.artTop * this.scale,
            fill: '#ed1e1e',
            blur: 0.5,
            height: this.height * this.scale,
            width: this.hpWidth * this.scale,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.yellowBar = new fabric.Rect({
            left: !this.right ? leftOffset : rightOffset,
            top: this.artTop * this.scale,
            fill: '#edd11e',
            blur: 0.5,
            height: missingHeight * this.scale,
            width: this.hpWidth * this.scale,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.whiteBar = new fabric.Rect({
            left: !this.right ? leftOffset : rightOffset,
            top: this.artTop * this.scale,
            fill: 'white',
            height: this.height * this.scale,
            width: this.hpWidth * this.scale,
            strokeWidth: this.strokeWidith * this.scale,
            stroke: 'white',
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.canvas.add(this.whiteBar);
        this.canvas.add(this.redBar);
        this.canvas.add(this.yellowBar);
        this.canvas.add(this.greenBar);
        
    }

    private drawHealthText() {
        if (this.healthtext)
             this.canvas.remove(this.healthtext);
        let healthtextbot = new fabric.Text(`${ this.health.toString() }`, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            strokeWidth: this.strokeWidith * this.scale,
            fill: 'white',
            fontWeight: 'bold',
            stroke: 'white',
            originX: 'center'
        }); 
        let healthtexttop = new fabric.Text(`${ this.health.toString() }`, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            fill: 'black',
            originX: 'center',
        }); 
        this.healthtext = new fabric.Group([healthtextbot,healthtexttop],{
            top: this.hpTextTop * this.scale,
            left: !this.right ? this.center  - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
            originX: 'center',
        });
        this.canvas.add(this.healthtext);
    }

    public attacks() {
        this.img.animate('left', this.right ? `-=${ 10  * this.scale }` : `+=${ 10 * this.scale }`, {
            duration: 200,
            easing: fabric.util.ease['easeInQuint'],
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.img.animate('left', this.right ? this.center + this.artAdjust + this.trueWidth / 2 : this.center - this.artAdjust - this.trueWidth / 2, {
                    duration: 300,
                    onChange: this.canvas.renderAll.bind(this.canvas),
                    easing: fabric.util.ease['easeOutQuint'],
                })
            }
        });
    }

	public dies(player2: Player | null) {
        if (player2)
            player2.animates();
        this.img.animate('angle', this.right ? '-90' : '90', {
            duration: 500,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.img.animate('opacity', 0, {
                    duration: 200,
                    onChange: this.canvas.renderAll.bind(this.canvas),
                    onComplete: () => {
                        this.canvas.remove(this.img);
                        this.canvas.remove(this.healthtext);
                        this.canvas.remove(this.greenBar);
                        this.canvas.remove(this.yellowBar);
                        this.canvas.remove(this.redBar);
                        this.canvas.remove(this.whiteBar);
                        this.canvas.remove(this.displayname);
                        this.canvas.remove(this.displaynametop);
                        if (player2)
                            player2.moves();
                    }
                });
            }
        });
    }

	public text(str: string, color: string) {
        let txt = {
            str: str,
            color: color
        };
        this.textQueue.push(txt);
        if (!this.textLock) {
            this.textLock = 1;
            this.displayText();
        }
    }

    private displayText() {
        if (!this.textQueue[0]) {
            this.textLock = 0;
            return;
        }
        let txtObj = this.textQueue.shift();
        let txtbot = new fabric.Text(`${ txtObj.str }`, {
            fontSize: this.fontSize * this.scale,
            strokeWidth: this.strokeWidith *this.scale,
            fontFamily: this.font,
            fontWeight: 'bold',
            stroke: 'white',
            fill: 'white',
            originX: 'center'
        });
        let txttop = new fabric.Text(`${ txtObj.str }`, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            fontWeight: 'bold',
            fill: txtObj.color,
            originX: 'center'
        });
        let textgroup = new fabric.Group([txtbot,txttop],{
            top: this.textTop * this.scale,
            left: !this.right ? this.center - this.artAdjust - this.trueWidth / 2 : this.center + this.artAdjust + this.trueWidth / 2,
            originX: 'center'
        });
        this.canvas.add(textgroup);
        textgroup.animate('top', `-=${ 20 * this.scale }`, {
            duration: 700,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.canvas.remove(textgroup);
            }
        });
        setTimeout(() => {this.displayText()}, 300);
    }

	public healthbar(adjustment: number) {
        if (!this.greenBar.height)
            return;

        // adjust actual health values
        this.health += adjustment;
        if (this.health > this.baseHealth)
            this.health = this.baseHealth;
        this.drawHealthText();
            
        // calculate amount to decrease height of bar by
        let percent = adjustment / this.baseHealth;
        let barChange = this.height * percent;

        // stop bars from going over 100 or under 0
        if (barChange + this.greenBar.height > this.height)
            barChange = this.height - this.greenBar.height;
        else if (barChange + this.greenBar.height < 0)
            barChange = -this.greenBar.height;
        console.log(`CHANGE HEALTH BY = ${ barChange }`);

        if (this.greenBar.height <= 0)
            this.greenBar.height = 0;
        // Drop the green bar
        this.greenBar.animate('height', barChange >= 0 ? `+=${ barChange }` : `-=${ -barChange }` , {
            duration: 1,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                // Have the yellow bar catch up to the green bar
                let catchUpPercent = 80;
                if (this.greenBar.height && this.yellowBar.height){
                    barChange = this.yellowBar.height - this.greenBar.height;
                    catchUpPercent = (this.yellowBar.height - this.greenBar.height) / this.height * 100;
                }
                else if (this.greenBar.height == 0 && this.yellowBar.height){
                    barChange = -this.yellowBar.height;
                    catchUpPercent = this.yellowBar.height / this.height * 100;
                }
                let yellowDuration = this.health > 0 ? 700 + catchUpPercent * 10 : 500 - (500 - catchUpPercent * 5);
                this.yellowBar.animate('height', `-=${ barChange >= 0 ? barChange : -barChange }`, {
                    duration: yellowDuration,
                    onChange: this.canvas.renderAll.bind(this.canvas),
                });
            }
        });
    }

    public moves(){
        this.canvas.remove(this.healthtext);
        this.canvas.remove(this.greenBar);
        this.canvas.remove(this.yellowBar);
        this.canvas.remove(this.redBar);
        this.canvas.remove(this.whiteBar);
        this.canvas.remove(this.displayname);
        this.canvas.remove(this.displaynametop);
        this.img.animate(`left`, this.center - this.artAdjust - this.trueWidth / 2, {
            duration:800,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.canvas.remove(this.img);
                this.img.setFlipX(false);
                this.canvas.add(this.img);
                this.right = 0;
                this.drawHealthText();
                this.drawHpBar();
                this.drawname();
                this.animationLock = 0;
            }
        });        
    }

    public setScale(scale: number) {
        this.scale = scale;
        this.center = this.canvas.getWidth() / 2;
        if (this.health > 0)
            this.draw();
    }

    public animates() {
        this.animationLock = 1;
    }

    public isAnimated() {
        return (this.animationLock ? true : false);
    }

   
}
