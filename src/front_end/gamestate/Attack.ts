import 'fabric';
declare let fabric: any;
/*
    sculleryMaid    = 0,
    barkeep         = 1,
    medium          = 2,
    minstrel        = 3,
    mage            = 4,
    rogue           = 5,
    warpriest       = 6,
    warlock         = 7,
    swashbuckler    = 8,
    dragon          = 9,
*/
export class Attack {
    private exists:     boolean;
    private trueWidth:  number;
    private imgs:       fabric.Object[];
    private left:       number;
    
    private height =    70;
    private artAdjust = 0;
    private artTop =    125;
    private offset =    0;
    constructor(
        private readonly canvas:    fabric.Canvas,
        private readonly char:      number,
        private readonly atkURLs:   string[],
        private scale:              number,
        private readonly onRight:   number,
        private center:             number,
        private align:              'left' | 'right' | 'center',
    ){
        this.imgs = [];
        this.exists = this.checkChar();
    }

    public canBeUsed() {
        if (this.exists)
            return true;
        return false;
    }

    public fires() {
        if (this.imgs.length > 1)
            this.nextAtk(0);
    }

    private nextAtk(i: number) {
        if (this.imgs[i - 1])
            this.canvas.remove(this.imgs[i - 1]);
        if (!this.imgs[i])
            return;
        this.canvas.add(this.imgs[i]);
        window.setTimeout(() => {this.nextAtk(i + 1)}, 200);
    }

    private checkChar() {
        if (this.char === 9) {
            this.setDragon();
            return (true);
        }
        return (false)
    }
    
    private setDragon() {
        if (this.align === 'left')
            this.left = this.onRight ? (this.offset + 44) * this.scale : 236 * this.scale;
        else if (this.align === 'right')
            this.left = this.onRight ? this.canvas.getWidth() - 236 * this.scale : this.canvas.getWidth() - (this.offset + 44) * this.scale;
        else if (this.align === 'center') 
            this.left = this.center; 
        if (!this.imgs[0]) {
            for (let i = 0; i < 3; i++) {
                new fabric.Image.fromURL(this.atkURLs[i], (oImg: fabric.Image) => {
                    if (oImg.width && oImg.height)
                        this.trueWidth = oImg.width / oImg.height * this.height * this.scale;
                    let atk = oImg.set({
                        left: this.left,
                        top: this.artTop * this.scale,
                        originX: 'center',
                        originY: 'bottom',
                        flipX: !this.onRight ? false : true
                    })
                    atk.scaleToHeight(this.height * this.scale);
                    this.imgs.push(atk);
                });
            }
        }
    }

    public updateScale(scale: number, center: number) {
        this.scale = scale;
        this.center = center;
        this.updateImgs();
    }
    
    public setAlignment(alignment: 'left' | 'right' | 'center') {
        this.align = alignment;
        this.updateImgs();
    }

    public setOffset(offset: number) {
        this.offset = offset;
        this.updateImgs();
    }

    private updateImgs() {
        this.checkChar();
        for (let i = 0; i < this.imgs.length; i++) {
            this.imgs[i].set({
                left: this.left,
                top: this.artTop * this.scale, 
            });
            this.imgs[i].scaleToHeight(this.height * this.scale);
        }
    }
}
