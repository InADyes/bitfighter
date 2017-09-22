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
    private canvas:         fabric.Canvas;
    private center:         number;
    private trueWidth:      number;
    private artIndex:       number;
    private art = [
        "images/characters/old/sBarbarian.png",
        "images/characters/old/sFarmer.png",
        "images/characters/old/sDragon.png",
        "images/characters/old/sDruid.png",
        "images/characters/old/sFighter.png",
        "images/characters/old/sFighter-2.png",
        "images/characters/old/sMage.png",
        "images/characters/old/sRogue.png",
        "images/characters/old/sRogue-2.png",
        "images/characters/old/sTroll.png",
        "images/characters/old/sWarlock.png"
    ]
    private hpHeight =      70;
    private hpWidth =       5;

    // Adjust these to move elements around
    private artAdjust =     30;
    private hpAdjust =      50;
    private textAdjust =    40;

    constructor(data: any, side: number, canvas: fabric.Canvas) {
        this.name = data.name;
        this.health = data.currentHitPoints;
        this.artIndex = data.art;
        this.baseHealth = data.maxHitPoints;
        this.right = side;
        this.canvas = canvas;
        this.center = this.canvas.getWidth() / 2;
    }

    public draw() {

        if (this.img)
            this.canvas.remove(this.img);
        new fabric.Image.fromURL(this.art[this.artIndex], (oImg: fabric.Image) => {
            if(oImg.width && oImg.height)
                this.trueWidth = oImg.width/oImg.height * 70;
            this.img = oImg.set({
                left: !this.right ? this.center - this.artAdjust - this.trueWidth / 2  : this.center + this.artAdjust + this.trueWidth / 2,
                top: 90,
                originX: 'center',
                originY: 'bottom',
                flipX: !this.right ? false : true
            });
            this.img.scaleToHeight(70);
            this.canvas.add(this.img);
            
            // health text
            if (this.healthtext)
                this.canvas.remove(this.healthtext);
            this.healthtext = new fabric.Text(`${ this.health.toString() }/${ this.baseHealth.toString() }`, {
                fontSize: 9,
                fill: 'black',
                top: 8,
                left: !this.right ? this.center  - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
                originX: 'center'
            });
            //health bar
            if (this.healthbarCurr)
                this.canvas.remove(this.healthbarCurr);
            if (this.healthbarMis)
                this.canvas.remove(this.healthbarMis);
            if (this.healthbarDec)
                this.canvas.remove(this.healthbarDec);
            this.healthbarCurr = new fabric.Rect({
                left: !this.right ? this.center - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
                top: 90,
                fill: '#1eedce',
                height: this.hpHeight,
                width: this.hpWidth,
                flipY: true,
                originX: 'center',
                originY: 'bottom'
            });
            this.healthbarMis = new fabric.Rect({
                left: !this.right ? this.center - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
                top: 90,
                fill: '#ed1e1e',
                height: this.hpHeight,
                width: this.hpWidth,
                flipY: true,
                originX: 'center',
                originY: 'bottom'
            });
            this.healthbarDec = new fabric.Rect({
                left: !this.right ? this.center - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
                top: 90,
                fill: '#edd11e',
                height: this.hpHeight,
                width: this.hpWidth,
                flipY: true,
                originX: 'center',
                originY: 'bottom'
            });
            this.canvas.add(this.healthtext);
            this.canvas.add(this.healthbarMis);
            this.canvas.add(this.healthbarDec);
            this.canvas.add(this.healthbarCurr);
        });
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

	public dies() {
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
                    }
                });
            }
        });
    }

	public text(str: string, color: string) {
        let dmg = new fabric.Text(`${ str }`, {
            fontSize: 15,
            fill: color,
            top: 20,
            left: !this.right ? this.center - this.textAdjust - this.trueWidth / 2 : this.center + this.textAdjust + this.trueWidth / 2,
            originX: 'center'
        });

        this.canvas.add(dmg);
        dmg.animate('top', '-=20', {
            duration: 500,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.canvas.remove(dmg);
            }
        });
    }

	public healthbar(adjustment: number) {
        if (!this.healthbarCurr.height)
            return;

        // adjust actual health values
        this.health += adjustment;
        if (this.health > this.baseHealth)
            this.health = this.baseHealth;
        this.redrawHealth();
            
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
                if (this.healthbarCurr.height && this.healthbarDec.height)
                    barChange = this.healthbarCurr.height - this.healthbarDec.height;
                else if (this.healthbarCurr.height == 0 && this.healthbarDec.height)
                    barChange = -this.healthbarDec.height
                this.healthbarDec.animate('height', barChange >= 0 ? `+=${ barChange }` : `-=${ -barChange }`, {
                    duration: 800,
                    onChange: this.canvas.renderAll.bind(this.canvas),
                });
            }
        });
    }

    private redrawHealth() {
        if (this.healthtext)
             this.canvas.remove(this.healthtext);
        this.healthtext = new fabric.Text(`${ this.health.toString() }/${ this.baseHealth.toString() }`, {
            fontSize: 9,
            fill: 'black',
            top: 8,
            left: !this.right ? this.center  - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
            originX: 'center',
        }); 
        this.canvas.add(this.healthtext);
    }
}
