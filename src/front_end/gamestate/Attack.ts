import 'fabric';
declare let fabric: any;
/*
    scullaryMaid    = 0,
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
    private imgs:       fabric.Object[];
    private trueWidth:  number;
    private height =    70;
    private artAdjust = 0;
    private artTop =    100;
    constructor(
        private readonly canvas:    fabric.Canvas,
        private readonly char:      number,
        private readonly atkURLs:   string[],
        private scale:              number,
        private readonly onRight:   number,
        private center:             number,
    ){
        this.exists = this.checkChar();
    }

    public canBeUsed() {
        if (this.exists)
            return true;
        return false;
    }

    public fires() {
        for (let i = 0; i < this.imgs.length; i++) {
            this.canvas.add(this.imgs[i]);
            //this.canvas.renderAll;
        }
    }

    private checkChar() {
        if (this.char === 9) {
            this.initDragon();
            return (true);
        }
        return (false)
    }
    //new fabric.Image.fromURL(this.atkArt[i], (oImg: fabric.Image) => {
        //         if (oImg.width && oImg.height)
        //             let fireWidth = oImg.width/oImg.height * this.height * this.scale;
        //         this.atk = oImg.set({
        //             left: !this.onRight ? (this.center - this.trueWidth / 2) - this.artAdjust : (this.center + this.trueWidth / 2) + this.artAdjust,
        //             top: this.artTop * this.scale,
    private initDragon() {
        for (let i = 0; i < 1; i++) {
            new fabric.image.fromURL(this.atkURLs[0], (oImg: fabric.Image) => {
                if (oImg.width && oImg.height)
                    this.trueWidth = oImg.width / oImg.height * this.height * this.scale;
                let atk = oImg.set({
                    left: !this.onRight ? (this.center - this.trueWidth / 2) - this.artAdjust : (this.center + this.trueWidth / 2) + this.artAdjust,
                    top: this.artTop * this.scale,
                })
                this.imgs.push(atk);
            });
        }
    }

    public updateScale(scale: number) {
        this.scale = scale
    }
}