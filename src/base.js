class Base {
    constructor(spritesheet, game, x, y) {
        Object.assign(this, { game, x, y });
        this.state = 0;
        this.game = game;
        this.spritesheet = spritesheet;
        this.BB = new BoundingBox(this.x, this.y, 768, 768);
        this.animations = [];
        this.loadAnimations();
    };

    loadAnimations() {
        for (var i = 0; i < 1; i++) {
            this.animations.push([]);
        }
        // add still animation here
        this.animations[0] = new Animator(this.spritesheet, 0, 0, 768, 768, 1, 1, 0, false, true);
        // add moving animation here        
    };

    update() {

    };

    draw(ctx) {
        this.animations[this.state].drawFrame(this.game.clockTick, ctx, this.x, this.y, PARAMS.SCALE);
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Blue';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    };
};