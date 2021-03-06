import * as PIXI from 'pixi.js';
import Game from './game';
import Wedge from './wedge';

export default class Turret {
    private game: Game;
    private wedgeCount: number;
    public container: PIXI.Container;
    public radius: number = 256;
    public wedges: Wedge[];

    constructor(game: Game, wedgeCount: number) {
        this.game = game;
        this.wedgeCount = wedgeCount;
        this.container = new PIXI.Container();
        this.wedges = [...new Array(wedgeCount)].map(
            (el, index) => new Wedge(game, this, index, wedgeCount)
        );
        this.init();
    }

    public init() {
        this.container.x = this.game.app.renderer.width / 2;
        this.container.y = this.game.app.renderer.height / 2;
        this.container.rotation = -0.25 * Math.PI;

        this.game.graphics.turretExterior.anchor.set(0.5);
        this.game.graphics.turretExterior.rotation = 0.25 * Math.PI;

        this.game.graphics.turretFloor.anchor.set(0.5);
        this.game.graphics.turretFloor.rotation = 0.25 * Math.PI;
        this.game.graphics.turretFloor.scale.set(0.875);

        this.game.graphics.turretCeiling.x = this.game.app.renderer.width / 2;
        this.game.graphics.turretCeiling.y = this.game.app.renderer.height / 2;
        this.game.graphics.turretCeiling.anchor.set(0.5);
        this.game.graphics.turretCeiling.alpha = 1;
    }

    public update(delta: number) {
        this.openingUpdate();
        this.game.cannon.update(delta);
    }

    public reinit() {
        this.wedges.forEach((wedge) => {
            wedge.health = wedge.maxHealth;
        });
    }

    private openingUpdate() {
        if (
            this.game.frameCount >= 60 &&
            this.game.graphics.turretCeiling.alpha > 0
        ) {
            if (
                this.game.frameCount % 60 === 0 &&
                this.game.graphics.turretCeiling.alpha > 0
            ) {
                this.game.graphics.turretCeiling.alpha -= 0.34;
            }
        }
    }

    public getFullWedges() {
        return this.wedges.filter(
            (wedge) => wedge.health >= wedge.maxHealth && !wedge.willBeShot
        );
    }

    public getDamagedWedges() {
        return this.wedges.filter((wedge) => {
            return (
                wedge.health < wedge.maxHealth &&
                this.game.player.pos.x !== wedge.pos.x &&
                this.game.player.pos.y !== wedge.pos.y
            );
        });
    }
}
