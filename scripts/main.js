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
        this.colours = [
            '#ff0049', '#001dfb', '#e4ff00', '#ff2592', '#ac29ff', '#f04', '#006fff', '#00f1e1', '#ffca00',
            '#c221b7', '#0091f4', '#6e91ff', '#0459e2', '#00f1e1'
        ];
        this.shapes = [
            new Star(6, 12, 6, this.colours[0], '#888', 2),  //`hsl(${Math.random() * 360} 100% 50%)`
            new Polygon(5, 28, this.colours[1], '#888', 4),
            new Star(3, 6, 3, this.colours[2], '#04ff4b', 2)
        ];
        this.shape_index = 0;
        this.shape = this.shapes[0];
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 3;
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#101';
        // this.ctx.globalCompositeOperation = /*'difference'; */'lighter'; // 'destination-over';

        // Curves
        this.rhodonea = (k, t) => [
            Math.cos(k * t + t) * Math.cos(t),
            Math.cos(k * t + t) * Math.sin(t),
        ];
        this.ellipse = (a, b, t) => [
            a * Math.cos(t),
            b * Math.sin(t)
        ];
        this.wobbly_spiral = (r, density, x_wobble_amp, y_wobble_amp, x_wobble_freq, y_wobble_freq, t) => {
            const r_ = r * (density * Math.PI - t) / (density * Math.PI);
            return [
                r_ * Math.cos(-t) + x_wobble_amp * Math.sin(t * x_wobble_freq),
                r_ * Math.sin(-t) + y_wobble_amp * Math.cos(t * y_wobble_freq)
            ];
        };
        this.hcrr = (R, r, t) => {
            const s = R - r;
            return [
                (s * Math.cos(t) + r * Math.cos(s / r * t)) / R,
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
        this.curves = [this.rhodonea, this.ellipse, this.wobbly_spiral, this.hcrr, this.unknown, this.trig_grid];

        // window.addEventListener('mousemove', event => {
        //     if (event.buttons == 1) {
        //         this.ctx.save();
        //         {
        //             this.ctx.translate(event.x, event.y)
        //             this.ctx.rotate(this.progress * 10);
        //             this.shape.draw(this.ctx, 0, 0);
        //         }
        //         this.ctx.restore();
        //     }
        // });

        window.addEventListener('keyup', event => {
            // console.log(event);
            if (!event.ctrlKey && !event.altKey) {
                const char = event.key;
                const digit = char.match(/\d/)?.input;
                if (digit) {
                    // Do something dependent on digit entered
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
                            init();
                            break;
                        case 's':
                            // Cycle shape
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
                        case ' ':
                            // Toggle play/pause
                            this.paused = !this.paused;
                            if (!this.paused) {
                                requestAnimationFrame(this.update.bind(this));
                            }
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
        requestAnimationFrame(this.update.bind(this));
    }

    update() {
        super.update();
    
        const params = [
            [rand_in_range(1, 13) / rand_in_range(1, 23), this.progress * 0.1],     // rhodonea
            [Math.random() * 20, Math.random() * 20, this.progress * 0.001],                   // ellipse
            [
                Math.random(),    // radius
                rand_in_range(12, 64),      // density
                Math.random(),         // x_wobble_amp
                Math.random(),         // y_wobble_amp
                Math.random() * 20,         // x_wobble_freq
                Math.random() * 20,          // y_wobble_freq
                this.progress * 0.0001
            ],                                                                      // wobbly_spiral
            [-37, -31, this.progress * 0.7],                                        // hcrr
            [23, 13, 7, 29, 16, 7, 9, this.progress * 0.1],                         // unknown
            [13, 41, this.progress * 0.01]                                          // trig_grid
        ];
        let x, y;
        for (let i = 3; i < 6; i++) {
            [x, y] = this.#transform_to_canvas(this.curves[i](...params[i]));
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(this.progress * (6 - i) * (i % 2 * 2 - 1));
            this.shapes[i % this.shapes.length].draw(this.ctx, 0, 0);
            this.ctx.restore();
        }
        if (!this.paused) {
            requestAnimationFrame(this.update.bind(this));
        }    
    }
}

class Shape {
    constructor(colour, outline, thickness) {
        this.colour = colour;
        this.outline = outline;
        this.thickness = thickness;
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

class Star extends Shape {
    static instance_count = 0;
    constructor(order, radius_outer, radius_inner, colour, outline, thickness) {
        super(colour, outline, thickness);
        this.id = Star.instance_count++;
        this.order = order;
        this.radius = radius_outer;
        this.hub = radius_inner;
    }
    draw(ctx, x, y) {
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
        ctx.restore();
    }
}

function init() {
    const main = document.getElementById('main');
    main.innerHTML = '';
    main.style.gridTemplateColumns = `1fr`;
    const {width: main_width, height: main_height} = main.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(main_width - 10);
    canvas.height = Math.floor(main_height - 10);
    main.appendChild(canvas);
    const scene = new ShapeScene(canvas);
    scene.render();
}

// Utility functions
const rand_in_range = (m, n) => Math.floor((n - m) * Math.random() + m);
const rand_int = n => Math.floor(n * Math.random());

// end of classes and functions
// ============================

// Main code 
let debug = true;
['load', 'resize'].forEach(event => window.addEventListener(event, init));
