import 'fabric';
declare let fabric: any;
import {charStrings} from '../../shared/characterPicker';

export class Player {
    private health:         number;
    private onRight:        number;
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
    private hpHeight =      60;
    private hpWidth =       7;
    private textLock =      0;
    private animationLock = 0;
    private nameHeight =    120;
    private strokeWidth =   2;
    private fontSize =      15;
    private font =          'Concert One'
    private buffOffset =    14;
    private buffTop =       135;
    private buffSize =      30;

    // Adjust these to move elements around
    private artAdjust =     0;
    private hpAdjust =      6;
    private artTop =        120;
    private hpTextTop =     32;
    private textTop =       30;

    constructor(
        private readonly data: {
            readonly name:              string;
            readonly currentHitPoints:  number;
            readonly maxHitPoints:      number;
            readonly art:               number;
            readonly profileImageURL:   string;
            bossMessage:                string;
            bossEmoticonURL:            string;
        },
        side:                       number, 
        canvas:                     fabric.Canvas, 
        scale:                      number, 
        private readonly charArt:   string[], 
        private readonly buffArt:   string[],
        private readonly atkArt:    string[]
    ) {
        this.health = data.currentHitPoints;
        this.onRight = side;
        this.canvas = canvas;
        this.scale = scale;
        this.center = this.canvas.getWidth() / 2;
        this.textQueue = [];
        this.buffs = [];
    }

    private drawBuffs() {
        if (this.buffGroup)
            this.canvas.remove(this.buffGroup);
        this.buffGroup = new fabric.Group([],{
            left:0,
            top:0
        });
        this.canvas.add(this.buffGroup);
        let numBuffsPerRow = Math.floor(this.trueWidth / (this.buffOffset * this.scale));
        for (let i = 0; i < this.buffs.length; i++) {
            new fabric.Image.fromURL(this.buffArt[this.buffs[i]], (oImg: fabric.Image) => {
                let currentbuff = oImg.set({
                    left: !this.onRight ? this.center - this.trueWidth + this.buffOffset * (i % numBuffsPerRow) * this.scale : this.center + this.buffOffset * (i % numBuffsPerRow) * this.scale,
                    top: i < numBuffsPerRow? this.buffTop * this.scale: (this.buffTop + this.buffSize * Math.floor(i / numBuffsPerRow) - 5) * this.scale,
                    height: this.buffSize * this.scale,
                    width: this.buffSize * this.scale
                });
                this.buffGroup.addWithUpdate(currentbuff);
                this.canvas.renderAll();
            });
        }
    }

    private drawname() {
        if (this.displayname)
            this.canvas.remove(this.displayname);
        if (this.displaynametop)
            this.canvas.remove(this.displaynametop);
        this.displayname = this.getFabricName();
        this.displayname.set({
            fill: 'white',
            stroke: 'white',
            strokeWidth: this.strokeWidth * this.scale,
            top: this.nameHeight * this.scale,
        });
        this.displaynametop = this.getFabricName();
        this.displaynametop.set({
            fill: 'black',
            top: this.nameHeight * this.scale + 1,
        })
        this.canvas.add(this.displayname);
        this.canvas.add(this.displaynametop);
    }

    private getFabricName() {
        return (new fabric.Text(this.data.name, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            fontWeight: 'bold',
            left: !this.onRight ? this.center  - this.trueWidth / 2 : this.center + this.trueWidth / 2,
            originX: 'center'
        }));
    }

    private drawHpBar() {
        let missingHeight = this.height * (this.health / this.data.maxHitPoints);
        let leftOffset = this.center - this.trueWidth - this.hpAdjust;
        let onRightOffset = this.center + this.trueWidth + this.hpAdjust;

        if (this.greenBar)
            this.canvas.remove(this.greenBar);
        if (this.redBar)
            this.canvas.remove(this.redBar);
        if (this.yellowBar)
            this.canvas.remove(this.yellowBar);
        if (this.whiteBar)
            this.canvas.remove(this.whiteBar);
        this.greenBar = this.getFabricHp(leftOffset, onRightOffset);
        this.greenBar.set({
            fill: '#1eedce',
            blur: 0.5,
            height: missingHeight * this.scale,
        });
        this.redBar = this.getFabricHp(leftOffset, onRightOffset);
        this.redBar.set({
            fill: '#ed1e1e',
            blur: 0.5,
            height: this.height * this.scale,
        });
        this.yellowBar = this.getFabricHp(leftOffset, onRightOffset); 
        this.yellowBar.set({
            fill: '#edd11e',
            blur: 0.5,
            height: missingHeight * this.scale,
        });
        this.whiteBar = this.getFabricHp(leftOffset, onRightOffset);
        this.whiteBar.set({
            fill: 'white',
            height: this.height * this.scale,
            strokeWidth: this.strokeWidth * this.scale,
            stroke: 'white',
            top: this.artTop * this.scale + 1,
        });
        this.canvas.add(this.whiteBar);
        this.canvas.add(this.redBar);
        this.canvas.add(this.yellowBar);
        this.canvas.add(this.greenBar);
    }

    private getFabricHp(leftOffset: number, onRightOffset: number) {
        return(new fabric.Rect({
            left: !this.onRight ? leftOffset : onRightOffset,
            width: this.hpWidth * this.scale,
            flipY: true,
            top: this.artTop * this.scale,
            originX: 'center',
            originY: 'bottom'
        }));
    }

    private drawHealthText() {
        if (this.healthtext)
             this.canvas.remove(this.healthtext);
        let healthTextBot = new fabric.Text(`${ this.health.toString() }`, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            strokeWidth: this.strokeWidth * this.scale,
            fill: 'white',
            fontWeight: 'bold',
            stroke: 'white',
            originX: 'center'
        });
        let healthTextTop = new fabric.Text(`${ this.health.toString() }`, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            fill: 'black',
            top: 1,
            originX: 'center',
        }); 
        this.healthtext = new fabric.Group([healthTextBot,healthTextTop],{
            top: this.hpTextTop * this.scale,
            left: !this.onRight ? this.center  - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
            originX: 'center',
        });
        this.canvas.add(this.healthtext);
    }

    private removeNameAndHp() {
        this.canvas.remove(this.healthtext);
        this.canvas.remove(this.greenBar);
        this.canvas.remove(this.yellowBar);
        this.canvas.remove(this.redBar);
        this.canvas.remove(this.whiteBar);
        this.canvas.remove(this.displayname);
        this.canvas.remove(this.displaynametop);
    }

    private emptyTextQueue() {
        if (!this.textQueue[0]) {
            this.textLock = 0;
            return;
        }
        let txtObj = this.textQueue.shift();
        this.drawText(txtObj);
        window.setTimeout(() => {this.emptyTextQueue()}, 300);
    }

    private drawText(txtObj: {str: string, color: string}) {
        let txtBot = new fabric.Text(`${ txtObj.str }`, {
            fontSize: this.fontSize * this.scale,
            strokeWidth: this.strokeWidth *this.scale,
            fontFamily: this.font,
            fontWeight: 'bold',
            stroke: 'white',
            fill: 'white',
            originX: 'center'
        });
        let txtTop = new fabric.Text(`${ txtObj.str }`, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            fontWeight: 'bold',
            fill: txtObj.color,
            top: 1,
            originX: 'center'
        });
        let textgroup = new fabric.Group([txtBot,txtTop],{
            top: this.textTop * this.scale,
            left: !this.onRight ? this.center - this.artAdjust - this.trueWidth / 2 : this.center + this.artAdjust + this.trueWidth / 2,
            originX: 'center'
        });
        this.canvas.add(textgroup);
        textgroup.animate('top', `-=${ 20 * this.scale }`, {
            duration: txtObj.str === "dodge" ? 500 : 700,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.canvas.remove(textgroup);
            }
        });
    }

    private getAtk(i: number) {
        return (new fabric.Image.fromURL(this.atkArt[i])
    }

    public drawMe() {
        if (this.img)
            this.canvas.remove(this.img);
        new fabric.Image.fromURL(this.charArt[this.data.art], (oImg: fabric.Image) => {
            if(oImg.width && oImg.height)
                this.trueWidth = oImg.width/oImg.height * this.height * this.scale;
            this.img = oImg.set({
                left: !this.onRight ? (this.center - this.trueWidth / 2) - this.artAdjust : (this.center + this.trueWidth / 2) + this.artAdjust,
                top: this.artTop * this.scale,
                originX: 'center',
                originY: 'bottom',
                flipX: !this.onRight ? false : true
            });
            this.img.scaleToHeight(this.height * this.scale);
            this.canvas.add(this.img);
            this.drawHealthText();
            this.drawHpBar();
            this.drawname();
        });
    }

    public addBuff(buff: number, duration: number) {
        this.buffs.push(buff);
        this.drawBuffs();
        window.setTimeout(
            () => {
                // remove this particular buff from the array after timeout
                let i = this.buffs.indexOf(buff);
                if (i > -1)
                    this.buffs.splice(i, 1);
                this.drawBuffs();
            }, duration
        );
        this.drawBuffs();
    }

    public attacks() {
        // if (this.data.art === 9) {
        //     let fire1 = this.getFire();
        //     fire1.set();
        //     let fire2 = this.getFire();
        //     fire2.set();
        //     let fire3 = this.getFire();
        //     fire3.set();
        // }
        // else {
            this.img.animate('left', this.onRight ? `-=${ 10  * this.scale }` : `+=${ 10 * this.scale }`, {
                duration: 200,
                easing: fabric.util.ease['easeInQuint'],
                onChange: this.canvas.renderAll.bind(this.canvas),
                onComplete: () => {
                    this.img.animate('left', this.onRight ? this.center + this.artAdjust + this.trueWidth / 2 : this.center - this.artAdjust - this.trueWidth / 2, {
                        duration: 300,
                        onChange: this.canvas.renderAll.bind(this.canvas),
                        easing: fabric.util.ease['easeOutQuint'],
                    })
                }
            });
        // }
    }

	public displayText(str: string, color: string) {
        if (str === "Level Up!")
            return;
        let txt = {
            str: str,
            color: color
        };
        if (str !== "dodge")
            this.textQueue.push(txt);
        else
            this.drawText(txt);
        if (!this.textLock) {
            this.textLock = 1;
            this.emptyTextQueue();
        }
    }

	public adjustHp(newHp: number) {
        if (!this.greenBar.height)
            return;

        // adjust actual health values
        let adjustment = newHp - this.health;
        this.health = newHp;
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

        // Move the green bar
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
                else if (this.greenBar.height === 0 && this.yellowBar.height){
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
        this.animationLock = 1;
        if (this.data.art === 9) {
            this.img.animate('opacity', 0, {
                duration: 1000,
                onChange: this.canvas.renderAll.bind(this.canvas),
                onComplete: () => {
                    this.canvas.remove(this.img);
                    this.removeNameAndHp();
                    if (player2)
                        player2.moves();
                    this.animationLock = 0;
                }
            });
        }
        else {
            this.img.animate('angle', this.onRight ? '-90' : '90', {
                duration: 500,
                onChange: this.canvas.renderAll.bind(this.canvas),
                onComplete: () => {
                    this.img.animate('opacity', 0, {
                        duration: 200,
                        onChange: this.canvas.renderAll.bind(this.canvas),
                        onComplete: () => {
                            this.canvas.remove(this.img);
                            this.removeNameAndHp();
                            if (player2)
                                player2.moves();
                            this.animationLock = 0;
                        }
                    });
                }
            });
        }
    }

    public moves(){
        this.animationLock = 1;
        this.removeNameAndHp();
        this.img.animate(`left`, this.center - this.artAdjust - this.trueWidth / 2, {
            duration: 800,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.canvas.remove(this.img);
                this.img.setFlipX(false);
                this.canvas.add(this.img);
                this.onRight = 0;
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
            this.drawMe();
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
            character: charStrings[this.data.art],
            bossMessage: this.data.bossMessage,
            bossEmoticonURL: this.data.bossEmoticonURL
        });
    }

    public updateBossMessage(str: string) {
        this.data.bossMessage = str;
    }

    public updateEmote(str: string) {
        this.data.bossEmoticonURL = str;
    }
}