// Main Javascript file for Shapes
// John Lynch - January 2024

class Scene {
    static instance_count = 0;
    constructor(canvas) {
        this.id = Scene.instance_count++;
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.progress = 0;
        this.progress_delta = 0.02;
    }
    render() {
    }
    update(t) {
        this.progress += this.progress_delta;
    }
}

class Scene2d extends Scene {
    static instance_count = 0;
    constructor(canvas) {
        super(canvas);
        this.ctx = this.canvas.getContext("2d");
    }
    render() {
        super.render();
    }
    update() {
        super.update();
    }
    test() {
        // Draw something simple and small, just to verify canvas drawability!
        this.ctx.fillStyle = '#00ccff';
        this.ctx.fillRect(500, 500, 200, 200);
        this.ctx.font = 'italic 128px Impact';
        this.ctx.fillStyle = 'red';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Testing 123...', this.width / 2, this.height / 2);
        console.log('*** In test() method of Scene2d class');
    }
}

class ShapeScene extends Scene2d {
    constructor(canvas) {
        super(canvas);
        // this.shape = new Polygon(12, 256, '#fd0', '#fda');
        this.shapes = [new Star(7, 32, 8, '#0af', '#f07', 4), new Polygon(4, 128, 'pink', 'green', 4)];
        this.ctx.shadowOffsetX = 10;
        this.ctx.shadowOffsetY = 10;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#0ef';

        window.addEventListener('mousemove', event => {
            this.shapes[0].draw(this.ctx, event.x, event.y);
            // this.shapes[1].draw(this.ctx, event.x, event.y);
        })
    }
    render() {
        super.render();
        requestAnimationFrame(this.update.bind(this));
    }
    update() {
        super.update();
        // this.ctx.clearRect(0, 0, this.width, this.height);
        // this.shapes[0].draw(this.ctx, this.width / 2 - 400 + this.progress * 20, this.height / 2 - 250 + this.progress * 20);
        // this.shapes[1].draw(this.ctx, this.width / 2 + 400 - this.progress * 20, this.height / 2 + 250 - this.progress * 20);

        requestAnimationFrame(this.update.bind(this));
    }
}

class Polygon {
    static instance_count = 0;
    constructor(order, radius, colour, outline, thickness) {
        this.id = Polygon.instance_count++;
        this.order = order;
        this.radius = radius;
        this.colour = colour;
        this.outline = outline;
        this.thickness = thickness;
    }
    draw(ctx, x, y) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.moveTo(0, this.radius);
        for (let i = 0; i < this.order; i++) {
            ctx.rotate(2 * Math.PI / this.order);
            ctx.lineTo(0, this.radius);
        }
        ctx.closePath();

        if (this.outline) {
            ctx.strokeStyle = this.outline;
            ctx.lineWidth = this.thickness;
            ctx.stroke();
        }
        if (this.colour) {
            ctx.fillStyle = this.colour;
            ctx.fill();
        }
        ctx.restore();
    }
}

class Star {
    static instance_count = 0;
    constructor(order, radius_outer, radius_inner, colour, outline, thickness) {
        this.id = Star.instance_count++;
        this.order = order;
        this.R = radius_outer;
        this.r = radius_inner;
        this.colour = colour;
        this.outline = outline;
        this.thickness = thickness;
    }
    draw(ctx, x, y) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#fa5';
        ctx.translate(x, y);
        ctx.moveTo(0, this.R);
        for (let i = 0; i < this.order; i++) {
            ctx.lineTo(0, this.R);
            ctx.rotate(Math.PI / this.order);
            ctx.lineTo(0, this.r);
            ctx.rotate(Math.PI / this.order);
        }
        ctx.closePath();

        if (this.outline) {
            ctx.strokeStyle = this.outline;
            ctx.lineWidth = this.thickness;
            ctx.stroke();
        }
        if (this.colour) {
            ctx.fillStyle = this.colour;
            ctx.fill();
        }
        ctx.restore();
    }
}

function init() {
    const main = document.getElementById('main');
    main.innerHTML = '';
    main.style.gridTemplateColumns = `1fr`;
    const {width: main_width, height: main_height} = main.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor((main_width - 10) / tile_factor) * tile_factor;
    canvas.height = Math.floor((main_height - 10) / tile_factor) * tile_factor;
    main.appendChild(canvas);
    const scene = new ShapeScene(canvas, tile_factor, speed, chars);
    scene.render();
}

// Utility functions
const rand_in_range = (m, n) => Math.floor((n - m) * Math.random() + m);
const rand_int = n => Math.floor(n * Math.random());

// end of classes and functions
// ============================

// Main code 
let debug = true;
let tile_factor = 5;
const speed = 0.02;
let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
window.addEventListener('keyup', event => {
    if (!event.ctrlKey && !event.altKey) {
        const char = event.key;
        const digit = char.match(/\d/)?.input;
        if (digit) {
            tile_factor = digit;
            init();
        }
        else {
            switch(char) {
                case 'd':
                    // Toggle debug
                    debug = !debug;
                    break;
                case 'r':
                    // Restart with next image
                    init();
                    break;
                default:
            }
        }
    }
});

['load', 'resize'].forEach(event => window.addEventListener(event, init));
