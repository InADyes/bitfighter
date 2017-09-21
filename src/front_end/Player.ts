import 'fabric'
declare let fabric: any;

export class Player {
    private name: string;
    private health: number;
    private right: number;
    private img: fabric.Object;
    private healthtext: fabric.Text;
    private healthbarCurr: fabric.Rect;
    private healthbarMis: fabric.Rect;
    private healthbarDec: fabric.Rect;
    private ImageTruewidth: number;
    private canvas: fabric.Canvas;
    private art = [
        "images/characters/Farmer.png",
        "images/characters/Farmer.png",
        "images/characters/daggers.png",
        "images/characters/champion_alpha.png",
    ]

    constructor(data: any, side: number, canvas: fabric.Canvas) {
        this.name = data.name;
        this.health = data.health;
        this.right = side;
        this.canvas = canvas;
    }

    public draw() {

        if (this.img)
            this.canvas.remove(this.img);
        
        new fabric.Image.fromURL(this.art[3], (oImg: fabric.Image) => {
            this.img = oImg.set({
                left: !this.right ? 35 : 80,
                top: 70,
                originX: 'center',
                originY: 'bottom',
                flipX: !this.right ? false : true
            });
            this.img.scaleToHeight(66);
            if(!this.img.width)
                return;
            if(!this.img.height)
                return;
            this.ImageTruewidth = this.img.width/this.img.height * 66;
           // console.log(this.ImageTruewidth);
           // console.log(this.img.height);
           // console.log(this.img.width);
            this.canvas.add(this.img);

            if (this.healthbarCurr)
                this.canvas.remove(this.healthbarCurr);
            if (this.healthbarMis)
                this.canvas.remove(this.healthbarMis);
            if (this.healthbarDec)
                this.canvas.remove(this.healthbarDec);
            this.healthbarCurr = new fabric.Rect({
                left: !this.right ? 10 : 45+this.ImageTruewidth,
                top: 70,
                fill: '#1eedce',
                height: 50,
                width: 10,
                flipY: true,
                originX: 'center',
                originY: 'bottom'
            });
            this.healthbarMis = new fabric.Rect({
                left: !this.right ? 10 : 45+this.ImageTruewidth,
                top: 70,
                fill: '#ed1e1e',
                height: 50,
                width: 10,
                flipY: true,
                originX: 'center',
                originY: 'bottom'
            });
            this.healthbarDec = new fabric.Rect({
                left: !this.right ? 10 : 45+this.ImageTruewidth,
                top: 70,
                fill: '#edd11e',
                height: 50,
                width: 10,
                flipY: true,
                originX: 'center',
                originY: 'bottom'
            });
            this.canvas.add(this.healthbarMis);
            this.canvas.add(this.healthbarDec);
            this.canvas.add(this.healthbarCurr);
        });
        console.log(this.ImageTruewidth);
       // console.log(this.ImageTruewidth);
        //health text
        if (this.healthtext)
            this.canvas.remove(this.healthtext);
        this.healthtext = new fabric.Text('70', {
            fontSize: 5,
            fill: 'black',
            top: 20,
            left: !this.right ? 4 : 40+this.ImageTruewidth
        });
        //health bar
       
        this.canvas.add(this.healthtext);
       
    }

    public attacks() {
        this.img.animate('left', this.right ? '-=20' : '+=20', {
            duration: 100,
            easing: fabric.util.ease['easeInQuint'],
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.img.animate('left', this.right ? 80 : 35, {
                    duration: 200,
                    onChange: this.canvas.renderAll.bind(this.canvas),
                    easing: fabric.util.ease['easeOutQuint'],
                })
            }
        });
    }



    public dies() {
        this.img.animate('angle', this.right ? '-90' : '90', {
            duration: 700,
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

    public damage() {
        let dmg = new fabric.Text('20', {
            fontSize: 10,
            fill: 'red',
            top: 20,
            left: !this.right ? 35 : 70
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

    public healthbar() {
        if (!this.healthbarCurr.height)
            return;
        if (this.healthbarCurr.height <= 0)
            this.healthbarCurr.height = 0;
        this.healthbarCurr.animate('height', '-=10', {
            duration: 0,
            // onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.healthbarDec.animate('height', '-=10', {
                    duration: 400,
                    onChange: this.canvas.renderAll.bind(this.canvas),
                });
            }
        });
    }
}
