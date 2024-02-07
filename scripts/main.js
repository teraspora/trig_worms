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
        this.progress_delta = 0.1;
        this.paused = false;
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
}

class ShapeScene extends Scene2d {
    constructor(canvas, controls) {
        super(canvas);
        this.controls = controls;
        this.colours = [
            '#ff9200', '#ff0049', '#0051ff', '#00c6ab',
            '#ea13bc', '#ff6e98', '#001dfb', '#ff9200', '#ff2592', '#ac29ff',
            '#f04', '#006fff', '#00f1e1', '#ffca00', '#c221b7',
            '#0091f4', '#6e91ff', '#0459e2', '#00f1e1'
        ];
        this.shapes = [
            new Star(6, 48, 6, this.colours[0], '#111', 2),  //`hsl(${Math.random() * 360} 100% 50%)`
            new Polygon(3, 6, this.colours[1], '#111', 4),
            new Star(3, 32, 3, this.colours[2], '#111', 2),
            new Polygon(5, 16, this.colours[3], '#111', 4)
        ];
        this.shape_index = 0;
        this.shape = this.shapes[0];
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 3;
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#101';

        // Curves
        this.circle = (t) => {
            return [
                Math.cos(t),
                Math.sin(t)
            ]
        };

        this.rhodonea = (k, t) => [
            Math.cos(k * t + t) * Math.cos(t),
            Math.cos(k * t + t) * Math.sin(t),
        ];

        this.hypocycloid = (a, b, t) => {
            const r = a - b;
            const p = r / b;
            return [
                (r * Math.cos(t) + b * Math.cos(p * t)) / a,
                (r * Math.sin(t) - b * Math.sin(p * t)) / a
            ]
        };

        this.hcrr = (R, r, t) => {
            const s = R - r;
            return [
                (s * Math.cos(t) + r * Math.cos(s / r * t)) / R,
                (s * Math.sin(t) - r * Math.sin(s / r * t)) / R
            ]
        };

        this.wobbly_hcrr = (R, r, t) => {
            const s = R - r;
            return [
                (s * Math.cos(t) + r * Math.cos(s / r * t)) / R + 0.05 * Math.sin(t * 10),
                (s * Math.sin(t) - r * Math.sin(s / r * t)) / R
            ]
        };

        this.unknown = (a, b, c, d, e, f, g, t) => {
            const t_ = t / 10;
            return [
                (Math.cos(a * t_) + Math.cos(b * t_) / d + Math.sin(c * t_) / e) / 2,
                (Math.sin(a * t_) + Math.sin(b * t_) / f + Math.cos(c * t_) / g) / 2
            ];
        };

        this.trig_grid = (p, q, t) => {
            return [            
                Math.sin(p * Math.PI * t / 10),
                Math.cos(q * Math.PI * t / 10)
            ]
        };
        this.curves = [this.hypocycloid, this.wobbly_hcrr, this.unknown, this.trig_grid];   //, this.hcrr, 
        // UI Controls
        


        window.addEventListener('keyup', event => {
            console.log(event.key);
            if (!event.ctrlKey && !event.altKey) {
                const char = event.key;
                const digit = char.match(/\d/)?.input;
                if (digit) {
                    // Set number of sides or points (0 - 9)
                    this.shape.order = digit;
                }
                else {
                    switch(char) {
                        case 'd':
                            // Toggle debug
                            debug = !debug;
                            break;
                        case 'Escape':
                            // Clear drawing
                            this.ctx.clearRect(0, 0, this.width, this.height);
                            this.progress = 0;
                            break;
                        case '*':
                            // Start again from scratch
                            init();
                            break;
                        case 's':
                            // Cycle focused shape
                            this.shape_index = (this.shape_index + 1) % this.shapes.length;
                            this.shape = this.shapes[this.shape_index];
                            break;
                        case 'c':
                            // Change colour
                            this.shape.colour = this.colours[rand_int(this.colours.length)];
                            break;
                        case '<':
                            // Decrease radius
                            if ((this.shape.radius -= 10) < 0) {
                                this.shape.radius = 0;
                            }
                            break;
                        case '>':
                            // Increase radius
                            this.shape.radius += 10;
                            break;
                        case ',':
                            // Decrease star hub radius
                            if (this.shape instanceof Star) {
                                if ((this.shape.hub -= 10) < 0) {
                                    this.shape.hub = 0;
                                }
                            }
                            break;
                        case '.':
                            // Increase star hub radius
                            if (this.shape instanceof Star) {
                                this.shape.hub += 10;
                            }
                            break;
                        case 'x':
                            // Toggle multicoloured
                            this.shape.colour = this.shape.colour ? null : this.shape.default_colour;
                            break;
                        case 'm':
                            // Toggle mute
                            if (osc.context.state == 'running') {
                                osc.context.suspend();
                            }
                            else {
                                osc.context.resume();
                            }
                            break;
                        case ' ':
                            // Toggle play/pause
                            this.paused = !this.paused;
                            if (!this.paused) {
                                requestAnimationFrame(this.update.bind(this));
                            }
                            break;
                        case 'Enter':
                            // Toggle hide/show the current shape
                            this.shape.hidden = !this.shape.hidden;
                            break;
                        case 'h':
                            // Show help
                            event.preventDefault();
                            help.style.display = help.style.display == 'none' ? 'block' : 'none';
                            break;
                        default:
                    }
                }
            }
        });
    }

    #transform_to_canvas([x, y]) {
        return [
            x = (x + 1) / 2 * this.width,
            y = (y + 1) / 2 * this.height
        ];
    }

    render() {
        super.render();
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.update();
    }

    update() {
        super.update();
        
        const params = [
            [39.5, 37, this.progress * 0.3],      // hypocycloid   
            // [rand_in_range(10, this.width / 2), rand_in_range(2, this.width / 4), this.progress * 0.01],      // hypocycloid                                      // hypocycloid
            // [7 / 3, this.progress * 0.03],                                          // rhodonea
            // [-37, -31, this.progress * 0.7],                                        // hcrr
            [-37, -31, this.progress * 0.1],                                        // wobbly_hcrr
            // [13, 113, 109, 299, 16, 7, 9, this.progress * 0.1],                     // unknown
            [27, 291, 77338, 5, 400, 512, 2239, this.progress * 0.02],                     // unknown
            [31, 41, this.progress * 0.002]                                       // trig_grid
        ];
        let x, y, position_aggregate = 0;
        for (let i = 0; i < this.curves.length; i++) {
            const current_shape = this.shapes[i % this.shapes.length];
            if (!current_shape.hidden) {
                [x, y] = this.#transform_to_canvas(this.curves[i](...params[i]));
                position_aggregate +=  (y + (x / this.width)) * 0.5;
                this.ctx.save();
                this.ctx.translate(x, y);
                this.ctx.rotate(this.progress * (6 - i) * (i % 2 * 2 - 1));
                current_shape.draw(this.ctx, 0, 0, this.progress);
                this.ctx.restore();
            }
            if (i == 1 ) {
                osc.frequency.value = (1 - position_aggregate / 2 / this.height) * 385 + 55;
            }
        }
        if (!this.paused) {
            requestAnimationFrame(this.update.bind(this));
        }    
    }
}

class Shape {
    constructor(colour, outline, thickness) {
        this.colour = colour;
        this.default_colour = colour;
        this.outline = outline;
        this.thickness = thickness;
        this.hidden = false;
    }
}

class Polygon extends Shape {
    static instance_count = 0;
    constructor(order, radius, colour, outline, thickness) {
        super(colour, outline, thickness);
        this.id = Polygon.instance_count++;
        this.order = order;
        this.radius = radius;
    }
    draw(ctx, x, y, progress) {
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
        else {
            ctx.fillStyle = `hsl(${Math.sin(progress / 16) * 90 + 270 + this.order * this.radius} 100% 50%)`;
            ctx.fill();
        }
        ctx.restore();
    }
}

class Star extends Shape {
    static instance_count = 0;
    constructor(order, radius_outer, radius_inner, colour, outline, thickness) {
        super(colour, outline, thickness);
        this.id = Star.instance_count++;
        this.order = order;
        this.radius = radius_outer;
        this.hub = radius_inner;
    }
    draw(ctx, x, y, progress) {
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.moveTo(0, this.radius);
        for (let i = 0; i < this.order; i++) {
            ctx.lineTo(0, this.radius);
            ctx.rotate(Math.PI / this.order);
            ctx.lineTo(0, this.hub);
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
        else {
            ctx.fillStyle = `hsl(${Math.sin(progress / 16) * 90 + 270 + this.order * this.radius} 100% 50%)`
            ctx.fill();
        }
        ctx.restore();
    }
}

function init() {
    // const canvases = document.getElementsByTagName('canvas');
    // if (canvases.length) {
    //     canvases[0].remove();
    //     delete canvases;
    // }
    const {width: main_width, height: main_height} = main.getBoundingClientRect();
    
    canvas.width = Math.floor(main_width - 200);
    canvas.height = Math.floor(main_height - 200);
    const scene = new ShapeScene(canvas, controls);
    scene.render();
}

// Utility functions
const rand_in_range = (m, n) => Math.floor((n - m) * Math.random() + m);
const rand_int = n => Math.floor(n * Math.random());

function oscillate() {
    const audio_ctx = new AudioContext();
    const osc = audio_ctx.createOscillator();
    osc.connect(audio_ctx.destination);
    osc.frequency.value = 0;
    osc.status = 'initial';
    return osc;
}

// end of classes and functions
// ============================

// Main code 
let debug = true;
const main = document.getElementById('main');
const controls = document.querySelector('section#controls');
const help = document.querySelector('aside#help');
const canvas = document.querySelector('canvas');

document.querySelector('aside#help button').addEventListener('click', event => {
    event.target.parentElement.style.display = 'none';
});

let osc = oscillate();
document.addEventListener('click', event => {
    if (osc.status == 'initial') {
        osc.start();
        osc.status = 'playing';
    }
});

['load', 'resize'].forEach(event => window.addEventListener(event, init));
