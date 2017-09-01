namespace Combatant {
    
    export interface Stats {
        hitPoints: number;
        accuracy: number;
        dodge: number;
        attackSpeed: number;
        attackDamage: number;
        armor: number;
        regeneration: number;
    }
    
    export class Combatant extends Actor{
        private id: number;
        private name: string;
        private iconImage = new Image();
        private attCD = 0;
        private stats: {
                hitPoints: number; // hit points (max is 1000)
                accuracy: number;
                dodge: number;
                attackSpeed: number; // attacks per millisecond
                attackDamage: number;
                armor: number; // damage reduction
                regeneration: number; // after a fight char will be healed by this amount
        };
        private healthBar: HealthBar;
        private static healthBarOffset = {x: 0, y: 130};
        private sprite: Sprite;
        private textOut: TextOut;
        private static textOutOffset = {x: 30, y: 0};
        private opponent: Combatant | null;
        private deathTimeout = 1500;
        constructor(
            ctx: CanvasRenderingContext2D,
            pos: {x: number, y: number},
            id: number,
            name: string,
            icon: string,
            sprite: string,
            stats: {
                hitPoints: number;
                accuracy: number;
                dodge: number;
                attackSpeed: number;
                attackDamage: number;
                armor: number;
                regeneration: number;
            }
        ) {
            super(ctx, pos);
            this.id = id;
            this.name = name;
            this.iconImage.src = icon; 
            this.stats = stats;
            this.healthBar = new HealthBar(ctx, {
                x: pos.x + Combatant.healthBarOffset.x,
                y: pos.y + Combatant.healthBarOffset.y
            });
            this.sprite = new Sprite(ctx, {x: pos.x, y: pos.y}, sprite);
            this.textOut = new TextOut(ctx, {
                x: pos.x + Combatant.textOutOffset.x ,
                y: pos.y + Combatant.textOutOffset.y
            });
        }
        toString() {
            return this.name;
        }
        public setOpponent(opponent: Combatant | null) {
            this.opponent = opponent;
        }
        public tick(timeDelta: number) {
            if (this.opponent && this.opponent.stats.hitPoints > 0 && this.stats.hitPoints > 0) { // todo: fix me
                this.attCD = this.attCD + timeDelta;
                if (this.attCD >= this.stats.attackSpeed - 150 && this.attCD - timeDelta <= this.stats.attackSpeed - 150) {
                    this.sprite.attackAnimation();
                }
                if (this.attCD >= this.stats.attackSpeed) {
                    this.attack(this.opponent);
                    this.attCD = this.attCD - this.stats.attackSpeed;
                }
            }
            else
                this.attCD = 0;
            if (this.stats.hitPoints <= 0)
                this.deathTimeout -= timeDelta;
            this.healthBar.tick(timeDelta);
            this.sprite.tick(timeDelta);
            this.textOut.tick(timeDelta);
        }
        public draw() {
            this.ctx.fillStyle = 'black';
            this.ctx.strokeStyle = 'white';
            this.ctx.font = "14px Arial";
            this.ctx.lineWidth = 1;
            this.ctx.strokeText(this.name, this.pos.x + 25, this.pos.y + 122);
            this.ctx.fillText(this.name, this.pos.x + 25, this.pos.y + 122);
            this.ctx.drawImage(this.iconImage, this.pos.x, this.pos.y + 105);
            this.healthBar.draw();
            this.sprite.draw();
            this.textOut.draw();
        }
        public donate(amount: number) {
            this.stats.accuracy = this.stats.accuracy + amount;
            this.stats.dodge = this.stats.accuracy + amount;
            this.stats.hitPoints = this.stats.hitPoints + amount;
            this.healthBar.setHealth(this.stats.hitPoints)
        }
        public getID() {
            return this.id;
        }
        public getIcon() {
            return this.iconImage;
        }
        public setPosition(pos: {x: number, y: number}) {
            this.pos = pos;
            this.healthBar.setPosition({
                x: pos.x + Combatant.healthBarOffset.x,
                y: pos.y + Combatant.healthBarOffset.y
            });
            this.sprite.setPosition(this.pos);
            this.textOut.setPosition({
                x: pos.x + Combatant.textOutOffset.x ,
                y: pos.y + Combatant.textOutOffset.y
            });
        }
        private attack(opponent: Combatant) {
            let total:      number;
            let roll:       number;
        
            total = this.stats.accuracy + opponent.stats.dodge;
            roll = Math.ceil(Math.random() * total);
            if (roll <= this.stats.accuracy){
                console.log(this.name + " " + this.id + " Has hit! =D");
                opponent.takeHit(this.stats.attackDamage);
            } else {
                console.log(this.name + " " + this.id + " Missed the attack! Yikes!!! >_<");
                opponent.textOut.add('dodge', 'orange');
            }
        }
        private takeHit(damage: number) {
            damage -= this.stats.armor;
            if (damage < 0)
                damage = 0;
            this.stats.hitPoints -= damage;
            if (this.stats.hitPoints < 0)
                this.stats.hitPoints = 0;
            this.healthBar.setHealth(this.stats.hitPoints);
            //this.sprite.shake();
            console.log(this.name + " " + this.id + " Has taken " + damage + "! :(");
            this.textOut.add(String(damage), 'red');
            if (this.stats.hitPoints <= 0)
                console.log(this.name + " " + this.id + " Has been slain! Their body lies motionless on the floor... ;-;");
        }
        public isDead() {
            // if (this.stats.hitPoints <= 0)
            //     return true;
            if (this.deathTimeout <= 0)
                return true;
            return false;
        }
        public heal(){
            this.stats.hitPoints += this.stats.regeneration * 1000;
            if(this.stats.hitPoints > 1000)
                this.stats.hitPoints = 1000;
            this.healthBar.setHealth(this.stats.hitPoints);
        }
        public setFacingDirection(left: boolean) {
            this.sprite.setFacingDirection(left);
        }
    }
    
    class HealthBar extends Actor {
        private targetHealth: number = 1000;
        private redHealth: number = 1000;
        private displayedYellow: number = 1000;

    
        private static yellowBarFollowRate: number = 7; //per millesecond
        private static healthToPixels: number = 15; //health units per pixel
        private static height: number = 6; //health bar height
    
        public draw() {
            this.ctx.fillStyle = 'grey';
            this.ctx.fillRect(this.pos.x, this.pos.y, 1000 / HealthBar.healthToPixels, HealthBar.height);
            this.ctx.fillStyle = 'orange';
            this.ctx.fillRect(this.pos.x, this.pos.y, Math.round(this.displayedYellow / HealthBar.healthToPixels), HealthBar.height);
            this.ctx.fillStyle = 'red';
            this.ctx.fillRect(this.pos.x, this.pos.y, Math.round(this.redHealth / HealthBar.healthToPixels), HealthBar.height);
        }
        public tick(timeDelta: number) {
            if (this.redHealth < this.displayedYellow) {
                this.displayedYellow -= timeDelta / HealthBar.yellowBarFollowRate;
                if (this.redHealth > this.displayedYellow)
                    this.displayedYellow = this.redHealth;
            }
            if (this.redHealth < this.targetHealth)
                this.redHealth += timeDelta / HealthBar.yellowBarFollowRate;
        }
        public setHealth(health: number) {
            this.targetHealth = health;
            if (this.redHealth > this.targetHealth)
                this.redHealth = this.targetHealth;
        }
    }
    
    class Sprite extends Actor {
        private spriteImage = new Image();
        private countdown: number = 0;
        private facingLeft =  false;
    
        private static countdownStart = Math.PI;
        private static shakeAmplitude = 10;
        private static timeToAmplitueRatio = 75;
    
        constructor(ctx: CanvasRenderingContext2D,  pos: {x: number, y: number}, sprite: string) {
            super(ctx ,pos);
            this.spriteImage.src = sprite;
        }
        public draw() {
            let offset = Math.floor(Math.sin(this.countdown) * Sprite.shakeAmplitude);
            if (this.facingLeft){
                this.ctx.save()
                this.ctx.scale(-1,1);
                this.ctx.drawImage(
                    this.spriteImage,
                    this.facingLeft ? -(this.pos.x+90 - offset) : -(this.pos.x+90 + offset),
                    this.pos.y
                );
                this.ctx.restore();
            }
            else
                {
                    this.ctx.drawImage(
                        this.spriteImage,
                        this.facingLeft ? this.pos.x - offset : this.pos.x + offset,
                        this.pos.y
                    );
                }

            
        }
        public attackAnimation() {
            this.countdown = Sprite.countdownStart;
        }
        public tick(timeDelta: number) {
            this.countdown -= timeDelta / Sprite.timeToAmplitueRatio;
            if (this.countdown < 0)
                this.countdown = 0;
        }
        public setFacingDirection(left: boolean) {
            this.facingLeft = left;
        }
    }
    
    class TextOut extends Actor {
        private static timeout = 5000;
        private static offsetRatio = 50;
    
        private displayedText: {
            text: string,
            timeout: number,
            color: string
        }[] = [];
        public tick(timeDelta: number) {
            this.displayedText.forEach(e => e.timeout += timeDelta);
            this.displayedText = this.displayedText.filter(e => e.timeout < TextOut.timeout);
        }
        public draw() {
            this.ctx.strokeStyle = 'black';
            this.ctx.font = "14px Arial";
            this.displayedText.forEach(e => {
                this.ctx.fillStyle = e.color;
                this.ctx.strokeText(e.text, this.pos.x, this.pos.y - e.timeout / TextOut.offsetRatio);
                this.ctx.fillText(e.text, this.pos.x, this.pos.y - e.timeout / TextOut.offsetRatio);
            });
        }
        public add(text: string, color: string) {
            this.displayedText.push({text: text, timeout: 0, color: color});
        }
    }
    
    }