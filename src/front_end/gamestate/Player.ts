import 'fabric'
declare let fabric: any;

export class Player {
    private name:           string;
    private baseHealth:     number;
    private health:         number;
    private right:          number;
    private img:            fabric.Object;
    private healthtext:     fabric.Text;
    private healthbarCurr:  fabric.Rect;
    private healthbarMis:   fabric.Rect;
    private healthbarDec:   fabric.Rect;
    private displayname:    fabric.Text;
    private canvas:         fabric.Canvas;
    private center:         number;
    private trueWidth:      number;
    private artIndex:       number;
    private textQueue:      any[];
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
    private hpHeight =      70;
    private hpWidth =       5;
    private textLock =      0;
    private animationLock = 0;
    private nameheight =    130;

    // Adjust these to move elements around
    private artAdjust =     0;
    private hpAdjust =      12;
    private artTop =        120;
    private hpTextTop =     35;
    private textTop =       30;

    constructor(data: any, side: number, canvas: fabric.Canvas, scale: number) {
        this.name = data.name;
        this.health = data.currentHitPoints;
        this.artIndex = data.art;
        this.baseHealth = data.maxHitPoints;
        this.right = side;
        this.canvas = canvas;
        this.scale = scale;
        this.center = this.canvas.getWidth() / 2 / this.scale;
        this.textQueue = [];
        this.animationLock = 0;
    }

    public draw() {
        console.log(`THIS.center = ${ this.center }`);

        if (this.img)
            this.canvas.remove(this.img);
        new fabric.Image.fromURL(this.art[this.artIndex], (oImg: fabric.Image) => {
            if(oImg.width && oImg.height)
                this.trueWidth = oImg.width/oImg.height * 70 * this.scale;
            this.img = oImg.set({
                left: !this.right ? (this.center - this.artAdjust - this.trueWidth / 2) * this.scale  : (this.center + this.artAdjust + this.trueWidth / 2) * this.scale,
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
        this.displayname = new fabric.Text(this.name, {
            fontSize: 15 * this.scale,
            fontFamily: 'fantasy',
            fill: 'white',
            fontWeight: 'bold',
            stroke: 'black',
            top: this.nameheight * this.scale,
            left: !this.right ? (this.center  - this.trueWidth/2) * this.scale : (this.center + this.trueWidth/2) * this.scale,
            originX: 'center'
        });
        this.canvas.add(this.displayname);
    }
    private drawHpBar() {
        let missingHeight = this.hpHeight * (this.health / this.baseHealth);
        console.log(missingHeight);

        if (this.healthbarCurr)
            this.canvas.remove(this.healthbarCurr);
        if (this.healthbarMis)
            this.canvas.remove(this.healthbarMis);
        if (this.healthbarDec)
            this.canvas.remove(this.healthbarDec);
        this.healthbarCurr = new fabric.Rect({
            left: !this.right ? (this.center - this.trueWidth - this.hpAdjust) * this.scale : (this.center + this.trueWidth + this.hpAdjust) * this.scale,
            top: this.artTop * this.scale,
            fill: '#1eedce',
            height: missingHeight * this.scale,
            width: this.hpWidth * this.scale,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.healthbarMis = new fabric.Rect({
            left: !this.right ? (this.center - this.trueWidth - this.hpAdjust) * this.scale : (this.center + this.trueWidth + this.hpAdjust) * this.scale,
            top: this.artTop * this.scale,
            fill: '#ed1e1e',
            height: this.hpHeight * this.scale,
            width: this.hpWidth * this.scale,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.healthbarDec = new fabric.Rect({
            left: !this.right ? (this.center - this.trueWidth - this.hpAdjust) * this.scale : (this.center + this.trueWidth + this.hpAdjust) * this.scale,
            top: this.artTop * this.scale,
            fill: '#edd11e',
            height: missingHeight * this.scale,
            width: this.hpWidth * this.scale,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.canvas.add(this.healthbarMis);
        this.canvas.add(this.healthbarDec);
        this.canvas.add(this.healthbarCurr);
    }

    private drawHealthText() {
        if (this.healthtext)
             this.canvas.remove(this.healthtext);
        this.healthtext = new fabric.Text(`${ this.health.toString() }`, {
            fontSize: 15 * this.scale,
            fontFamily: 'fantasy',
            fill: 'white',
            fontWeight: 'bold',
            stroke: 'black',
            top: this.hpTextTop * this.scale,
            left: !this.right ? (this.center  - this.trueWidth - this.hpAdjust) * this.scale : (this.center + this.trueWidth + this.hpAdjust) * this.scale,
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
                this.img.animate('left', this.right ? (this.center + this.artAdjust + this.trueWidth / 2) * this.scale : (this.center - this.artAdjust - this.trueWidth / 2) * this.scale, {
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
                        this.canvas.remove(this.healthbarCurr);
                        this.canvas.remove(this.healthbarDec);
                        this.canvas.remove(this.healthbarMis);
                        this.canvas.remove(this.displayname);
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
        let txt = new fabric.Text(`${ txtObj.str }`, {
            fontSize: 15 * this.scale,
            fontFamily: 'fantasy',
            fontWeight: 'bold',
            stroke: 'black',
            fill: txtObj.color,
            top: this.textTop * this.scale,
            left: !this.right ? (this.center - this.artAdjust - this.trueWidth / 2) * this.scale : (this.center + this.artAdjust + this.trueWidth / 2) * this.scale,
            originX: 'center'
        });
        this.canvas.add(txt);
        txt.animate('top', `-=${ 20 * this.scale }`, {
            duration: 700,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.canvas.remove(txt);
            }
        });
        setTimeout(() => {this.displayText()}, 300);
    }

	public healthbar(adjustment: number) {
        if (!this.healthbarCurr.height)
            return;

        // adjust actual health values
        this.health += adjustment;
        if (this.health > this.baseHealth)
            this.health = this.baseHealth;
        this.drawHealthText();
            
        // calculate amount to decrease height of bar by
        console.log(`adjust: ${ adjustment }`);
        let percent = adjustment / this.baseHealth;
        console.log(`baseHealth: ${ this.health }`);
        let barChange = this.hpHeight * percent;

        // stop bars from going over 100 or under 0
        if (barChange + this.healthbarCurr.height > this.hpHeight)
            barChange = this.hpHeight - this.healthbarCurr.height;
        else if (barChange + this.healthbarCurr.height < 0)
            barChange = -this.healthbarCurr.height;
        console.log(`CHANGE HEALTH BY = ${ barChange }`);

        if (this.healthbarCurr.height <= 0)
            this.healthbarCurr.height = 0;
        // Drop the green bar
        this.healthbarCurr.animate('height', barChange >= 0 ? `+=${ barChange }` : `-=${ -barChange }` , {
            duration: 1,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                // Have the yellow bar catch up to the green bar
                let catchUpPercent = 80;
                if (this.healthbarCurr.height && this.healthbarDec.height){
                    barChange = this.healthbarDec.height - this.healthbarCurr.height;
                    catchUpPercent = (this.healthbarDec.height - this.healthbarCurr.height) / this.hpHeight * 100;
                }
                else if (this.healthbarCurr.height == 0 && this.healthbarDec.height){
                    barChange = -this.healthbarDec.height;
                    catchUpPercent = this.healthbarDec.height / this.hpHeight * 100;
                }
                let yellowDuration = this.health > 0 ? 700 + catchUpPercent * 10 : 500 - (500 - catchUpPercent * 5);
                console.log("catchUpPercent:", catchUpPercent, "duration:",yellowDuration);
                this.healthbarDec.animate('height', `-=${ barChange >= 0 ? barChange : -barChange }`, {
                    duration: yellowDuration,
                    onChange: this.canvas.renderAll.bind(this.canvas),
                });
            }
        });
    }

    public moves(){
        this.canvas.remove(this.healthtext);
        this.canvas.remove(this.healthbarCurr);
        this.canvas.remove(this.healthbarDec);
        this.canvas.remove(this.healthbarMis);
        this.canvas.remove(this.displayname);
        this.img.animate(`left`, (this.center - this.artAdjust - this.trueWidth / 2) * this.scale, {
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
    }

    public animates() {
        this.animationLock = 1;
    }

    public isAlive() {
        return (this.health > 0 ? true : false);
    }

    public isAnimated() {
        return (this.animationLock ? true : false);
    }

}
