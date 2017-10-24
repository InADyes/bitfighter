import 'fabric';
declare let fabric: any;
import {Attack} from './Attack';
import { FrontendCharacter } from '../../shared/interfaces/backToFrontMessage';
import { BossData } from './interfaces';

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
    private offset:         number;
    private cWidth:         number;
    private atkAnimReturn:  number;
    private movesAmount:    number;
    private specialAtk:     Attack;
    private height =        70;
    private hpWidth =       6.5;
    private textLock =      0;
    private animationLock = 0;
    private nameHeight =    110;
    private strokeWidth =   2;
    private fontSize =      15;
    private font =          'Concert One'
    private buffOffset =    15;
    private buffTop =       125;
    private buffSize =      25;
    private drawing =       0;

    // Adjust these to move elements around
    private artAdjust =     50;
    private hpAdjust =      35;
    private artTop =        110;
    private hpTextTop =     22;
    private textTop =       20;
    private centerHpAdjust = 6;

    constructor(
        private readonly data: FrontendCharacter,
        side:                       number, 
        canvas:                     fabric.Canvas, 
        scale:                      number, 
        private readonly charArt:   string[], 
        private readonly buffArt:   string[],
        private readonly atkArt:    string[],
        private align:              'left' | 'right' | 'center',
    ) {
        this.health = data.currentHitPoints;
        this.onRight = side;
        this.canvas = canvas;
        this.scale = scale;
        this.center = this.canvas.getWidth() / 2;
        this.textQueue = [];
        this.buffs = [];
        this.cWidth = this.canvas.getWidth();
        this.specialAtk = new Attack(canvas, this.data.art, atkArt, scale, side, this.center, this.align);
    }

    public drawMe(player: Player | null, offset: number) {
        this.offset = offset;
        this.specialAtk.setOffset(offset);
        if (this.img)
            this.canvas.remove(this.img);
        if (this.health < 0)
            return;
        this.drawing = 1;
        new fabric.Image.fromURL(this.charArt[this.data.art], (oImg: fabric.Image) => {
            if(oImg.width && oImg.height)
                this.trueWidth = oImg.width/oImg.height * this.height;
            this.setAnimationAmount();
            if (this.align === "left")
                oImg.set({left: this.scale * (this.artAdjust + this.offset + this.trueWidth / 2)});
            else if (this.align === "right")
                oImg.set({left: this.cWidth - this.scale * (this.artAdjust + this.offset + this.trueWidth / 2)});
            else if (this.align === "center") {
                let fromCenter = (this.trueWidth / 2) * this.scale;
                oImg.set({left: !this.onRight ? this.center - fromCenter : this.center + fromCenter})
            }
            this.img = oImg.set({
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
            this.drawBuffs();
            if (player)
                player.drawMe(null, this.trueWidth);
            this.drawing = 0;
        });
    }

    private drawHealthText() {
        if (this.healthtext)
             this.canvas.remove(this.healthtext);
        let healthTextBot = new fabric.Text(`${ this.health.toString() }`, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            strokeWidth: this.strokeWidth * this.scale,
            top: this.hpTextTop * this.scale,
            fill: 'white',
            fontWeight: 'bold',
            stroke: 'white',
            originX: 'center'
        });
        let healthTextTop = new fabric.Text(`${ this.health.toString() }`, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            fill: 'black',
            top: (this.hpTextTop + 1) * this.scale,
            originX: 'center',
        }); 
        this.healthtext = new fabric.Group([healthTextBot,healthTextTop],{
            left: !this.onRight ? this.center  - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
            originX: 'center',
        });
        if (this.align === "left")
            this.healthtext.set({left: this.onRight ? (this.trueWidth + this.artAdjust * 2 + this.offset - this.hpAdjust) * this.scale : this.hpAdjust * this.scale});
        else if (this.align === "right")
            this.healthtext.set({left: this.onRight ? this.cWidth - this.hpAdjust * this.scale : this.cWidth - (this.trueWidth + this.artAdjust * 2 + this.offset - this.hpAdjust) * this.scale});
        else if (this.align === "center") {
            let offset = (this.trueWidth + this.centerHpAdjust) * this.scale;
            this.healthtext.set({left: !this.onRight ? this.center - offset : this.center + offset})
        }
        this.canvas.add(this.healthtext);
        this.canvas.sendToBack(this.healthtext);
    }

    private drawHpBar() {
        let missingHeight = this.height * (this.health / this.data.maxHitPoints);

        if (this.greenBar)
            this.canvas.remove(this.greenBar);
        if (this.redBar)
            this.canvas.remove(this.redBar);
        if (this.yellowBar)
            this.canvas.remove(this.yellowBar);
        if (this.whiteBar)
            this.canvas.remove(this.whiteBar);
        this.greenBar = this.getFabricHp();
        this.greenBar.set({
            fill: '#1eedce',
            blur: 0.5,
            height: missingHeight * this.scale,
        });
        this.redBar = this.getFabricHp();
        this.redBar.set({
            fill: '#ed1e1e',
            blur: 0.5,
            height: this.height * this.scale,
        });
        this.yellowBar = this.getFabricHp(); 
        this.yellowBar.set({
            fill: '#edd11e',
            blur: 0.5,
            height: missingHeight * this.scale,
        });
        this.whiteBar = this.getFabricHp();
        this.whiteBar.set({
            fill: 'white',
            height: this.height * this.scale,
            strokeWidth: this.strokeWidth * this.scale,
            stroke: 'white',
            top: (this.artTop + 1) * this.scale,
        });
        this.canvas.add(this.whiteBar);
        this.canvas.add(this.redBar);
        this.canvas.add(this.yellowBar);
        this.canvas.add(this.greenBar);
    }
    private getFabricHp() {
        let temp = new fabric.Rect({
            width: this.hpWidth * this.scale,
            flipY: true,
            top: this.artTop * this.scale,
            originX: 'center',
            originY: 'bottom'
        });
        if (this.align === "left")
            temp.set({left: this.onRight ? this.scale * (this.trueWidth + this.artAdjust * 2 + this.offset - this.hpAdjust) : this.hpAdjust * this.scale});
        else if (this.align === "right")
            temp.set({left: this.onRight ? this.cWidth - this.hpAdjust * this.scale : this.cWidth - this.scale * (this.trueWidth + this.artAdjust * 2 + this.offset - this.hpAdjust)});    
        else if (this.align === "center") {
            let offset = (this.trueWidth + this.centerHpAdjust) * this.scale; 
            temp.set({left: !this.onRight ? this.center - offset : this.center + offset});
        }
        return (temp);
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
            top: (this.nameHeight + 1) * this.scale,
        })
        this.canvas.add(this.displayname);
        this.canvas.add(this.displaynametop);
    }
    private getFabricName() {
        let temp = new fabric.Text(this.data.name, {
            fontSize: this.fontSize * this.scale,
            fontFamily: this.font,
            fontWeight: 'bold',
            left: !this.onRight ? this.center  - this.trueWidth - this.hpAdjust : this.center + this.trueWidth + this.hpAdjust,
            originX: 'center'
        });
        if (this.align === "left")
            temp.set({left: this.onRight ? (this.trueWidth + this.artAdjust * 2 + this.offset - this.hpAdjust) * this.scale : this.hpAdjust * this.scale});
        else if (this.align === "right")
            temp.set({left: this.onRight ? this.cWidth - this.hpAdjust * this.scale : this.cWidth - (this.trueWidth + this.artAdjust * 2 + this.offset - this.hpAdjust) * this.scale});
        else if (this.align === "center")
            temp.set({left: !this.onRight ? this.center - (this.trueWidth + this.centerHpAdjust) * this.scale : this.center + (this.trueWidth + this.centerHpAdjust) * this.scale});
        return(temp);
    }

    private drawText(txtObj: {str: string, color: string, duration: number}) {
        let txtBot = new fabric.Text(`${ txtObj.str }`, {
            fontSize: this.fontSize * this.scale,
            strokeWidth: this.strokeWidth *this.scale,
            top: this.textTop * this.scale,
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
            top: (this.textTop + 1) * this.scale,
            originX: 'center'
        });
        let textgroup = new fabric.Group([txtBot,txtTop],{
            left: !this.onRight ? this.center - this.artAdjust - this.trueWidth / 2 : this.center + this.artAdjust + this.trueWidth / 2,
            originX: 'center'
        });
        if (this.align === "left")
            textgroup.set({left: this.scale * (this.trueWidth / 2 + this.artAdjust + this.offset)});
        else if (this.align === "right")
            textgroup.set({left: this.cWidth - this.scale * (this.trueWidth / 2 + this.artAdjust + this.offset)});
        else if (this.align === "center")
            textgroup.set({left: !this.onRight ? this.center - (this.trueWidth / 2) * this.scale : this.center + (this.trueWidth / 2) * this.scale})
        this.canvas.add(textgroup);
        textgroup.animate('top', `-=${ 20 * this.scale }`, {
            duration: 700 * txtObj.duration,
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.canvas.remove(textgroup);
            }
        });
    }
    public displayText(str: string, color: string, duration: number) {
        if (str === "Level Up!")
            return;
        let txt = {
            str: str,
            color: color,
            duration: duration
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
    private emptyTextQueue() {
        if (!this.textQueue[0]) {
            this.textLock = 0;
            return;
        }
        let txtObj = this.textQueue.shift();
        this.drawText(txtObj);
        window.setTimeout(() => {this.emptyTextQueue()}, 300);
    }

    private drawBuffs() {
        if (this.buffGroup)
            this.canvas.remove(this.buffGroup);
        this.buffGroup = new fabric.Group([],{
            left:0,
            top:0
        });
        this.canvas.add(this.buffGroup);
        let numBuffsPerRow = Math.floor(this.trueWidth / this.buffOffset);
        for (let i = 0; i < this.buffs.length; i++) {
            new fabric.Image.fromURL(this.buffArt[this.buffs[i]], (oImg: fabric.Image) => {
                if (this.align === "left")
                    oImg.set({left: ((this.offset + this.artAdjust) + this.buffOffset * (i % numBuffsPerRow)) * this.scale});
                else if (this.align === "right")
                    oImg.set({left: this.cWidth - (this.offset + this.artAdjust + this.buffOffset * (numBuffsPerRow - i % numBuffsPerRow)) * this.scale});
                else if (this.align === "center")
                    oImg.set({left: !this.onRight ? this.center - (this.trueWidth + this.buffOffset * (i % numBuffsPerRow)) * this.scale : this.center + (this.buffOffset * (i % numBuffsPerRow)) * this.scale});
                let currentbuff = oImg.set({
                    top: i < numBuffsPerRow ? this.buffTop * this.scale: (this.buffTop + this.buffSize * Math.floor(i / numBuffsPerRow) - 5) * this.scale,
                    height: this.buffSize * this.scale,
                    width: this.buffSize * this.scale
                });
                this.buffGroup.addWithUpdate(currentbuff);
                this.canvas.renderAll();
            });
        }
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

    private removeNameAndHp() {
        this.canvas.remove(this.healthtext);
        this.canvas.remove(this.greenBar);
        this.canvas.remove(this.yellowBar);
        this.canvas.remove(this.redBar);
        this.canvas.remove(this.whiteBar);
        this.canvas.remove(this.displayname);
        this.canvas.remove(this.displaynametop);
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

    public attacks() {
        if (this.specialAtk.canBeUsed()) {
            this.specialAtk.fires();
        }
        else {
            this.img.animate('left', this.onRight ? `-=${ 10  * this.scale }` : `+=${ 10 * this.scale }`, {
                duration: 200,
                easing: fabric.util.ease['easeInQuint'],
                onChange: this.canvas.renderAll.bind(this.canvas),
                onComplete: () => {
                    this.img.animate('left', this.atkAnimReturn, {
                        duration: 300,
                        onChange: this.canvas.renderAll.bind(this.canvas),
                        easing: fabric.util.ease['easeOutQuint'],
                    })
                }
            });
        }
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
                            if (player2) {
                                if (this.align == 'right'){
                                    console.log(`P1 OFFSET:`, this.offset);
                                    player2.setOffset(this.offset);
                                }
                                player2.moves();
                            }
                            this.animationLock = 0;
                        }
                    });
                }
            });
        }
    }

    public moves(){
        this.animationLock = 1;
        if (this.align == 'left')
            this.offset = 0;
        this.removeNameAndHp();
        
        this.img.animate('left', this.movesAmount, {
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
        this.cWidth = this.canvas.getWidth();
        this.atkAnimReturn = 0;
        this.setAnimationAmount();
        this.specialAtk.updateScale(scale, this.center);
        // if (this.health > 0 && !this.drawing)
        //     this.drawMe(null, this.offset);
    }

    private setAnimationAmount() {
        if (this.align === "left"){
            this.atkAnimReturn = (this.artAdjust + this.offset + this.trueWidth / 2) * this.scale;
            this.movesAmount = this.scale * (this.artAdjust + this.trueWidth / 2);
        }
        else if (this.align === "right"){
            this.atkAnimReturn = this.cWidth - (this.artAdjust + this.offset + this.trueWidth / 2) * this.scale;
            this.movesAmount = this.cWidth - this.scale * (this.artAdjust + this.offset + this.trueWidth / 2);
        }
        else if (this.align === "center"){
            this.atkAnimReturn = this.onRight ? this.center + (this.trueWidth / 2) * this.scale : this.center - (this.trueWidth / 2) * this.scale;
            this.movesAmount = this.center - (this.trueWidth / 2) * this.scale;
        }
    }

    public isAnimated() {
        return (this.animationLock ? true : false);
    }

    public clearBuffs(){
        this.canvas.remove(this.buffGroup);
        this.buffs = [];
    }

    public getBitBossInfo(): BossData {
        return ({
            name: this.data.name,
            hp: this.health,
            maxHp: this.data.maxHitPoints,
            img: this.data.profileImageURL,
            character: this.data.className,
            bossMessage: this.data.bossMessage,
            bossEmoticonURL: this.data.bossEmoticonURL,
            id: this.data.id
        });
    }

    public updateBossMessage(str: string) {
        this.data.bossMessage = str;
    }

    public updateEmote(str: string) {
        this.data.bossEmoticonURL = str;
    }

    public setAlignment(alignment: 'left' | 'right' | 'center') {
        this.align = alignment;
        this.specialAtk.setAlignment(alignment);
    }

    public setOffset(offset: number) {
        this.offset = offset;
        this.specialAtk.setOffset(offset);
        this.setAnimationAmount();
    }

    public eraseMe() {
        if (this.img) {
            console.log("asdsad");
            this.canvas.remove(this.img);
        }
        this.removeNameAndHp();
        this.canvas.remove(this.buffGroup);
    }
}