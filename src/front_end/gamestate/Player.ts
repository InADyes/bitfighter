import 'fabric'
declare let fabric: any;

export class Player {
    private health:         number;
    private right:          number;
    private img:            fabric.Object;
    private healthtext:     fabric.Group;
    private greenBar:       fabric.Rect;
    private redBar:         fabric.Rect;
    private yellowBar:      fabric.Rect;
    private whiteBar:       fabric.Rect;
    private displayname:    fabric.Text;
    private displaynametop: fabric.Text;
    private canvas:         fabric.Canvas;
    private center:         number;
    private trueWidth:      number;
    private textQueue:      any[];
    private buffs:          number[];
    private buffGroup:      fabric.Group;
    private scale:          number; 
    private height =        70;
    private hpWidth =       5;
    private textLock =      0;
    private animationLock = 0;
    private nameHeight =    120;
    private strokeWidith =  2;
    private fontSize =      15;
    private font =          'Concert One'
    private buffWidth =     25;
    private buffTop =       135;
    private buffSize =      25;

    // Adjust these to move elements around
    private artAdjust =     0;
    private hpAdjust =      5;
    private artTop =        120;
    private hpTextTop =     33;
    private textTop =       30;

    private charStrings = [
        "Scullary Maid",
        "Barkeep",
        "Medium",
        "Minstrel",
        "Mage",
        "Rogue",
        "Warpriest",
        "Warlock",
        "Swashbuckler",
        "Dragon",
    ];

    constructor(
        private readonly data: {
            readonly name: string;
            readonly currentHitPoints: number;
            readonly maxHitPoints: number;
            readonly art: number;
            readonly profileImageURL: string;
            readonly chatMessage: string;
        },
        side: number, 
        canvas: fabric.Canvas, 
        scale: number, 
        private readonly charArt: string[], 
        private readonly buffArt: string[]
    ) {
        this.health = data.currentHitPoints;
        this.right = side;
        this.canvas = canvas;
        this.scale = scale;
        this.center = this.canvas.getWidth() / 2;
        this.textQueue = [];
        this.buffs = [];
    }

    public addBuff(buff: number, duration: number) {
        this.buffs.push(buff);
        this.drawBuffs();
        window.setTimeout(() => {
            // remove this particular buff from the array
            let i = this.buffs.indexOf(buff);
            if (i > -1)
                this.buffs.splice(i, 1);
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

        let numBuffsPerRow = Math.floor(this.trueWidth / this.buffWidth);
        for (let i = 0; i < this.buffs.length; i++) {
            new fabric.Image.fromURL(this.buffArt[this.buffs[i]], (oImg: fabric.Image) => {
                let currentbuff = oImg.set({
                    left: !this.right ? (this.center - this.trueWidth + this.buffWidth * (i % numBuffsPerRow)) * this.scale : this.center  + this.buffWidth * (i % numBuffsPerRow) * this.scale,
                    top: i < numBuffsPerRow? this.buffTop * this.scale: (this.buffTop + this.buffSize * Math.floor(i / numBuffsPerRow)) * this.scale,
                    height: this.buffSize * this.scale,
                    width: this.buffSize * this.scale
                });
                this.buffGroup.addWithUpdate(currentbuff);
                this.canvas.renderAll();
            });
        }
    }

    public draw() {
        if (this.img)
            this.canvas.remove(this.img);
        new fabric.Image.fromURL(this.charArt[this.data.art], (oImg: fabric.Image) => {
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
        this.displayname = new fabric.Text(this.data.name, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            strokeWidth: this.strokeWidith * this.scale,
            fill: 'white',
            fontWeight: 'bold',
            stroke: 'white',
            top: this.nameHeight * this.scale,
            left: !this.right ? this.center  - this.trueWidth / 2:this.center + this.trueWidth / 2,
            originX: 'center'
        });
        this.displaynametop = new fabric.Text(this.data.name, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            fill: 'black',
            fontWeight: 'bold',
            top: this.nameHeight * this.scale + 1,
            left: !this.right ? this.center  - this.trueWidth / 2:this.center + this.trueWidth / 2,
            originX: 'center'
        });
        this.canvas.add(this.displayname);
        this.canvas.add(this.displaynametop);
    }
    private drawHpBar() {
        let missingHeight = this.height * (this.health / this.data.maxHitPoints);
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
            top: 1,
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
            top: 1,
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
        window.setTimeout(() => {this.displayText()}, 300);
    }

	public healthbar(adjustment: number) {
        if (!this.greenBar.height)
            return;

        // adjust actual health values
        this.health += adjustment;
        if (this.health > this.data.maxHitPoints)
            this.health = this.data.maxHitPoints;
        this.drawHealthText();
            
        // calculate amount to decrease height of bar by
        let percent = adjustment / this.data.maxHitPoints;
        let barChange = this.height * this.scale * percent;

        // stop bars from going over 100 or under 0
        if (barChange + this.greenBar.height > this.height * this.scale)
            barChange = this.height * this.scale - this.greenBar.height;
        else if (barChange + this.greenBar.height <= 0)
            barChange = -this.greenBar.height;

        if (this.greenBar.height <= 0)
            this.greenBar.height = 0;
        // Drop the green bar
        this.greenBar.animate('height', barChange > 0 ? `+=${ barChange }` : `-=${ -barChange }` , {
            duration: barChange > 0 ? 500 : 1,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                // Calculate how much to move the yellow bar by
                let catchUpPercent = 80;
                if (this.greenBar.height && this.yellowBar.height){
                    barChange = this.yellowBar.height - this.greenBar.height;
                    catchUpPercent = (this.yellowBar.height - this.greenBar.height) / this.height * 100;
                }
                else if (this.greenBar.height == 0 && this.yellowBar.height){
                    barChange = this.yellowBar.height;
                    catchUpPercent = this.yellowBar.height / this.height * 100;
                }
                let yellowDuration = this.health > 0 ? 700 + catchUpPercent * 10 : 500 - (500 - catchUpPercent * 5);
                // Have the yellow bar catch up to the green bar
                this.yellowBar.animate('height', barChange < 0 ? `+=${ -barChange }` : `-=${ barChange }`, {
                    duration: barChange < 0 ? 1 : yellowDuration,
                    onChange: this.canvas.renderAll.bind(this.canvas),
                });
            }
        });
    }

	public dies(player2: Player | null) {
        this.animates();
        console.log(`ANiMATING`);
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
                        this.animationLock = 0;
                    }
                });
            }
        });
    }

    public moves(){
        this.animates();
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

   public clearBuffs(){
       this.canvas.remove(this.buffGroup);
       this.buffs = [];
   }

   public getBitBossInfo() {
       return ({
           name: this.data.name,
           hp: this.health,
           maxHp: this.data.maxHitPoints,
           img: this.data.profileImageURL,
           character: this.charStrings[this.data.art]
       });
   }
}