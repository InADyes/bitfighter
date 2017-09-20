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
    private canvas: fabric.Canvas;
    private art = [
        "images/characters/axe.png",
        "images/characters/sword.png",
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
        new fabric.Image.fromURL(this.art[1], (oImg: fabric.Image) => {
            this.img = oImg.set({
                left: !this.right ? 50 : 250,
                top: 110,
                originX: 'center',
                originY: 'bottom',
                flipX: !this.right ? false : true
            });
            //this.img.scaleToWidth(200);
            this.canvas.add(this.img);
        });
        //health text
        if (this.healthtext)
            this.canvas.remove(this.healthtext);
       this.healthtext = new fabric.Text('70',{
            fontSize: 5,
            fill: 'black',
            top: 20,
            left: !this.right ? 4 : 283
        });
        //health bar
        if (this.healthbarCurr)
            this.canvas.remove(this.healthbarCurr);
        if (this.healthbarMis)
            this.canvas.remove(this.healthbarMis);
        if (this.healthbarDec)
            this.canvas.remove(this.healthbarDec);
        this.healthbarCurr = new fabric.Rect({
            left: !this.right ? 10 : 290,
            top: 100,
            fill: '#1eedce',
            height: 70,
            width: 10,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.healthbarMis = new fabric.Rect({
            left: !this.right ? 10 : 290,
            top: 100,
            fill: '#ed1e1e',
            height: 70,
            width: 10,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.healthbarDec = new fabric.Rect({
            left: !this.right ? 10 : 290,
            top: 100,
            fill: '#edd11e',
            height: 70,
            width: 10,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.canvas.add(this.healthtext);
        this.canvas.add(this.healthbarMis);
        this.canvas.add(this.healthbarDec);
        this.canvas.add(this.healthbarCurr);
    }

    public attacks() {
        this.img.animate('left', this.right ? '-=70' : '+=70', {
            duration: 100,
            easing: fabric.util.ease['easeInQuint'],
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.img.animate('left', this.right ? 250 : 50, {
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
        fontSize: 15,
        fill: 'red',
        top: 20,
        left: !this.right ? 40 : 260
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
