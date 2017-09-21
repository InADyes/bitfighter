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
    private artIndex:       number;
    private art = [
        "images/characters/axe.png",
        "images/characters/sword.png",
        "images/characters/daggers.png",
        "images/characters/champion_alpha.png",
    ]
    private hpHeight =  70;
    private hpWidth =   10;

    constructor(data: any, side: number, canvas: fabric.Canvas) {
        this.name = data.name;
        this.health = data.currentHitPoints;
        this.artIndex = data.art;
        this.baseHealth = data.maxHitPoints;
        this.right = side;
        this.canvas = canvas;
    }

    public draw(center: number) {

        if (this.img)
            this.canvas.remove(this.img);
        new fabric.Image.fromURL(this.art[this.artIndex], (oImg: fabric.Image) => {
            if (oImg.width)
            this.img = oImg.set({
                left: !this.right ? center - 50 - oImg.width/2 : center + 50
                + oImg.width/2,
                top: 110,
                originX: 'center',
                originY: 'bottom',
                flipX: !this.right ? false : true
            });
            this.canvas.add(this.img);

        });
        //health text
        if (this.healthtext)
            this.canvas.remove(this.healthtext);
        this.healthtext = new fabric.Text(this.health.toString(), {
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
            height: this.hpHeight,
            width: this.hpWidth,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.healthbarMis = new fabric.Rect({
            left: !this.right ? 10 : 290,
            top: 100,
            fill: '#ed1e1e',
            height: this.hpHeight,
            width: this.hpWidth,
            flipY: true,
            originX: 'center',
            originY: 'bottom'
        });
        this.healthbarDec = new fabric.Rect({
            left: !this.right ? 10 : 290,
            top: 100,
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
    }

    public attacks() {
        this.img.animate('left', this.right ? '-=70' : '+=70', {
            duration: 200,
            easing: fabric.util.ease['easeInQuint'],
            onChange: this.canvas.renderAll.bind(this.canvas),
            onComplete: () => {
                this.img.animate('left', this.right ? 250 : 50, {
                    duration: 300,
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

	public text(str: string, color: string) {
        let dmg = new fabric.Text(`${ str }`, {
            fontSize: 15,
            fill: color,
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

	public healthbar(adjustment: number) {
    if (!this.healthbarCurr.height)
        return;
    /*this.health += adjustment;
    if (this.health > this.baseHealth) {
        this.health = this.baseHealth;
        // then draw or keep bar at max
    }*/
    // calculate amount to decrease height of bar by
    let percent = adjustment / this.baseHealth;
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
                duration: 400,
                onChange: this.canvas.renderAll.bind(this.canvas),
            });
        }
    });
}
}
