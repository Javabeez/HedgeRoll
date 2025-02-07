class Hog {
    constructor(spritesheet, game, x, y) {
        Object.assign(this, { game, x, y });
        this.height = 256;
        this.width = 256;
        this.size = 1; // size 0 = rolled up, size 1 = regular/unrolled
        this.state = 0; // 0 = no input, 1 = jump no release, 2 = jump released, 3 = diving, 4 = dead

        this.velocity = 0;
        this.game = game;
        this.spritesheet = spritesheet;

        this.dead = false;
        this.velocity = { x: 0, y: 0 };
        this.fallAcc = 800;
        this.jumpPower = 375;
        this.divePower = 1200;
        this.hasReleased = false;
        this.holdPower = 1.1;

        this.updateBB();
        this.updateLastBB();
        this.updateLastState();

        this.animations = [];
        this.loadAnimations();
    };

    loadAnimations() {
        for (var i; i < 1; i++) {
            this.animations.push([]);
        }
        this.animations[0] = new Animator(this.spritesheet, 0, 0, this.width, this.height, 1, 1, 0, false, true);
    };

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, this.width, this.height);
    }

    updateLastBB() {
        this.lastBB = this.BB;
    };

    updateLastState() {
        this.lastState = this.state;
    };


    update() {
        const TICK = this.game.clockTick;

        if (this.dead) {

        } else {
            // update velocity
            this.velocity.y += this.fallAcc * TICK;

            // update position
            this.x += this.velocity.x * TICK * PARAMS.SCALE;
            this.y += this.velocity.y * TICK * PARAMS.SCALE;
            this.updateBB();

            // collisions
            var that = this;
            this.game.entities.forEach(function (entity) {
                if (entity.BB && that.BB.collide(entity.BB)) {
                    if (that.velocity.y > 0) { // falling
                        if (entity instanceof Base && (that.lastBB.bottom) <= entity.BB.top) {
                            that.y = entity.BB.top - that.height;
                            that.velocity.y = 0;
                            if (that.lastState != 3) {
                                that.updateLastState();
                            }
                            that.state = 0;
                        }
                    }
                }
            });

            // controls
            if (this.game.pressed) { // held jump
                if (this.state == 2 && this.hasReleased) {
                    this.velocity.y += this.divePower;
                    this.updateLastState();
                    this.state = 3;
                }
                if (this.state == 0 && this.lastState != 3) { // grounded then jump
                    this.velocity.y -= this.jumpPower;
                    this.updateLastState();
                    this.state = 1;
                } else if (this.state == 1 && this.lastState == 0 && this.velocity.y < 0) {
                    this.velocity.y -= this.jumpPower * TICK * this.holdPower;
                }
                this.hasReleased = false;
            } else if (this.state == 1) {
                this.hasReleased = true;
                this.updateLastState();
                this.state = 2;
            } else if (this.state == 0 && this.lastState == 3) {
                this.updateLastState();
                this.state = 0;
            }
        }
    };

    draw(ctx) {
        this.animations[0].drawFrame(this.game.clockTick, ctx, this.x, this.y, PARAMS.SCALE);
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x, this.BB.y, this.BB.width, this.BB.height);
        }
    };
};