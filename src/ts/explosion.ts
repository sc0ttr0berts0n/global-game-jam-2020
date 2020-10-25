import * as PIXI from 'pixi.js';
import Victor = require('victor');
import Game from './game';

interface ExplosionOptions {
    lifespan?: number;
}

export default class Explosion {
    private game: Game;
    private pos: Victor;
    private el: PIXI.Sprite;
    private age: number = 0;
    public isDead = false;
    public lifespan: number;
    public momentum = Math.random() * 0.4 - 0.2;
    public options: ExplosionOptions;
    constructor(game: Game, startPos: Victor, options?: ExplosionOptions) {
        this.options = {
            lifespan: 20,
        };
        Object.assign(this.options, options);
        this.game = game;
        this.pos = startPos;
        this.el = new PIXI.Sprite(this.game.graphics.explosion);
        this.lifespan = this.options.lifespan;
        this.init();
    }
    init() {
        this.el.x = this.pos.x;
        this.el.y = this.pos.y;
        this.el.rotation = Math.random() * Math.PI * 4 - Math.PI * 2;
        this.el.anchor.set(0.5);
        this.el.scale.set(0.66);
        this.game.graphics.skyContainer.addChild(this.el);
    }
    update() {
        this.age++;
        this.el.rotation += this.momentum;
        this.el.scale.x += this.momentum * 0.2;
        this.el.scale.y += this.momentum * 0.2;
        if (this.age > this.lifespan - 10) {
            this.el.alpha -= 0.1;
        }
        if (this.age > this.lifespan) {
            this.isDead = true;
        }
        if (this.isDead) {
            this.el.destroy();
        } else {
        }
    }

    getWorldPos() {
        return new Victor(this.el.worldTransform.tx, this.el.worldTransform.ty);
    }
}
