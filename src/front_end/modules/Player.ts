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
    ]
    private hpHeight =      70;
    private hpWidth =       5;
    private textLock =      0;
    private nameheight =    130;

    // Adjust these to move elements around
    private artAdjust =     0;
    private hpAdjust =      12;
    private artTop =        120;
    private hpTextTop =     35;
    private textTop =       30;

    constructor(data: any, side: number, canvas: fabric.Canvas) {
        this.name = data.name;
        this.health = data.currentHitPoints;
        this.artIndex = data.art;
        this.baseHealth = data.maxHitPoints;
        this.right = side;
        this.canvas = canvas;
        this.center = this.canvas.getWidth() / 2;
        this.textQueue = [];
    }

    public draw() {
        if (this.img)
            this.canvas.remove(this.img);
        new fabric.Image.fromURL(this.art[this.artIndex], (oImg: fabric.Image) => {
            if(oImg.width && oImg.height)
                this.trueWidth = oImg.width/oImg.height * 70;
            this.img = oImg.set({
                left: !this.right ? this.center - this.artAdjust - this.trueWidth / 2  : this.center + this.artAdjust + this.trueWidth / 2,
                top: this.artTop,
                originX: 'center',
                originY: 'bottom',
                flipX: !this.right ? false : true
            });
            this.img.scaleToHeight(70);
            this.canvas.add(this.img);
            this.drawHealthText();
            this.drawHpBar();
            this.drawname();
        });
    }
    private drawname() {
         this.displayname = new fabric.Text(this.name, {
            fontSize: 15,
            fontFamily: 'Trebuchet MS',
            fill: 'white',
            fontWeight: 'bold',
            stroke: 'black',
            top: this.nameheight,
            left: !this.right ? this.center  - this.trueWidth/2 : this.center + this.trueWidth/2,
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
            left: !this.right ? this.center - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
            top: this.artTop,
            fill: '#1eedce',
            height: missingHeight,
            width: this.hpWidth,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.healthbarMis = new fabric.Rect({
            left: !this.right ? this.center - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
            top: this.artTop,
            fill: '#ed1e1e',
            height: this.hpHeight,
            width: this.hpWidth,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.healthbarDec = new fabric.Rect({
            left: !this.right ? this.center - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
            top: this.artTop,
            fill: '#edd11e',
            height: missingHeight,
            width: this.hpWidth,
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
            fontSize: 15,
            fontFamily: 'Trebuchet MS',
            fill: 'white',
            fontWeight: 'bold',
            stroke: 'black',
            top: this.hpTextTop,
            left: !this.right ? this.center  - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
            originX: 'center',
        }); 
        this.canvas.add(this.healthtext);
    }

    public attacks() {
        this.img.animate('left', this.right ? '-=10' : '+=10', {
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
            fontSize: 15,
            fontFamily: 'Trebuchet MS',
            fontWeight: 'bold',
            stroke: 'white',
            fill: txtObj.color,
            top: this.textTop,
            left: !this.right ? this.center - this.artAdjust - this.trueWidth / 2 : this.center + this.artAdjust + this.trueWidth / 2,
            originX: 'center'
        });
        this.canvas.add(txt);
        txt.animate('top', '-=20', {
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
                //let catchUpPercent = 1;
                if (this.healthbarCurr.height && this.healthbarDec.height){
                    barChange = this.healthbarDec.height - this.healthbarCurr.height;
                    //catchUpPercent = (this.healthbarDec.height - this.healthbarCurr.height) / this.hpHeight * 200;
                }
                else if (this.healthbarCurr.height == 0 && this.healthbarDec.height){
                    barChange = -this.healthbarDec.height;
                    //catchUpPercent = this.healthbarDec.height / this.hpHeight * 200;
                }
                //let yellowDuration = catchUpPercent * 10;
                //console.log("catchUpPercent:", catchUpPercent, "duration:",yellowDuration);
                this.healthbarDec.animate('height', barChange >= 0 ? `+=${ barChange }` : `-=${ -barChange }`, {
                    duration: 800, //yellowDuration,
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
            }
        });        
    }
}
