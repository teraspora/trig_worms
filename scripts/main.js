// Main Javascript file for Shapes
// John Lynch - January 2024

const Curves = {
    rhodonea: {
        func: (k, t) => [
            Math.cos(k * t + t) * Math.cos(t),
            Math.cos(k * t + t) * Math.sin(t),
        ],
        params: [27 / 11],
        speed: 0.02,
        hidden: false
    },

    hypocycloid: {
        func: (a, b, t) => {
            const r = a - b;
            const p = r / b;
            return [
                (r * Math.cos(t) + b * Math.cos(p * t)) / a,
                (r * Math.sin(t) - b * Math.sin(p * t)) / a
            ]
        },
        params: [39.5, 37],
        speed: 0.3,
        hidden: false
    },

    hcrr: {
        func: (R, r, t) => {
            const s = R - r;
            return [
                (s * Math.cos(t) + r * Math.cos(s / r * t)) / R,
                (s * Math.sin(t) - r * Math.sin(s / r * t)) / R
            ]
        },
        params: [-37, -31],
        speed: 0.1,
        hidden: false
    },


    wobbly_hcrr: {
        func: (R, r, t) => {
            const s = R - r;
            return [
                (s * Math.cos(t) + r * Math.cos(s / r * t)) / R + 0.05 * Math.sin(t * 10),
                (s * Math.sin(t) - r * Math.sin(s / r * t)) / R
            ]
        },
        params: [-47, -29],
        speed: 0.1,
        hidden: false
    },


    unknown: {
        func: (a, b, c, d, e, f, g, t) => {
            const t_ = t / 10;
            return [
                (Math.cos(a * t_) + Math.cos(b * t_) / d + Math.sin(c * t_) / e) / 2,
                (Math.sin(a * t_) + Math.sin(b * t_) / f + Math.cos(c * t_) / g) / 2
            ];
        },
        params: [27, 291, 77338, 5, 400, 512, 2239],
        speed: 0.02,
        hidden: false
    },


    trig_grid: {
        func: (p, q, t) => {
            return [            
                Math.sin(p * Math.PI * t / 10),
                Math.cos(q * Math.PI * t / 10)
            ]
        },
        params: [31, 41],
        speed: 0.002,
        hidden: false
    },

    ellipse: {
        func: (r, t) => {
            return [
                r * Math.cos(t),
                r * Math.sin(t)
            ]
        },
        params: [0.6],
        speed: 0.05,
        hidden: true
    }
};

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
    constructor(canvas, curves, controls) {
        super(canvas);
        
        // Shapes
        this.shapes = [
            new Star(6, 48, 6, 2),  //`hsl(${Math.random() * 360} 100% 50%)`
            new Polygon(3, 6, 4),
            new Star(3, 32, 3, 2),
            new Polygon(5, 16, 4)
        ];
        this.shape_index = 0;
        this.shape = this.shapes[0];

        // Colours
        this.colours = [
            '#ff9200', '#ff0049', '#0051ff', '#00c6ab',
            '#ea13bc', '#ff6e98', '#001dfb', '#ff9200', '#ff2592', '#ac29ff',
            '#f04', '#006fff', '#00f1e1', '#ffca00', '#c221b7',
            '#0091f4', '#6e91ff', '#0459e2', '#00f1e1'
        ];
        
        // Curves
        this.curves = curves;
        this.curve_names = Object.keys(this.curves);
        this.current_curve = this.curves[this.curve_names[0]];
        let i = 0;
        for (const curve in this.curves) {
            this.curves[curve].default_colour = this.#get_random_colour();
            this.curves[curve].colour = this.curves[curve].default_colour;
            this.curves[curve].shape = this.#get_random_shape();
            this.curves[curve].rotation = ++i;
        }
        
        // Global effects
        this.ctx.shadowOffsetX = 5;
        this.ctx.shadowOffsetY = 3;
        this.ctx.shadowBlur = 5;
        this.ctx.shadowColor = '#101';
        
        // UI Controls
        this.controls = controls;
        this.#create_curve_checkboxes();
        this.#create_params_section();
        
        window.addEventListener('keyup', event => {
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
                            this.current_curve.colour = this.#get_random_colour();
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
                            this.current_curve.colour = this.current_curve.colour ? null : this.current_curve.default_colour;
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

    #create_curve_checkboxes() {
        const checkbox_wrapper = document.querySelector('section#controls > #curves > fieldset');
        const checkbox = checkbox_wrapper.firstElementChild;
        const checkbox_clone = checkbox.cloneNode(true);
        checkbox.remove();
        const checkboxes = [];
        for (const curve_name of this.curve_names){
            const curve_switch = checkbox_clone.cloneNode(true);
            checkbox_wrapper.appendChild(curve_switch);
            const label = curve_switch.querySelector('label');
            label.textContent = curve_name;
            label.style.color = this.curves[curve_name].colour;
            const input = curve_switch.querySelector('input');
            input.type = 'checkbox';
            input.checked = !this.curves[curve_name].hidden;
            input.name = curve_name;
            input.addEventListener('change', event => {
                const curve = this.curves[event.target.name];
                curve.hidden = !curve.hidden;
                if (curve.hidden && curve == this.current_curve) {
                    const active_curves = this.curve_names.filter(curve_name => !this.curves[curve_name].hidden);
                    if (active_curves.length) {
                        this.current_curve = active_curves[0];
                        this.#update_parameter_display();
                    }
                    // else... hmmm, if we set it to null, we'll have to include that value in the select...
                }
            });
            // label.addEventListener('click', event => {
            //     this.current_curve = this.curves[event.target.nextElementSibling.name];
            //     event.target.style.color = 'f00';
            // });
            checkboxes.push(input);
        }
    }

    #update_parameter_display() {
        const param_elements = [...document.getElementsByClassName('param')];
        param_elements.forEach(param => {
            switch(param.id) {
                case 'shape':
                    param.value = this.current_curve.shape.constructor.name;
                    break;
                case 'order':
                    param.value = this.current_curve.shape.order;
                    break;
                case 'speed':
                    param.value = this.current_curve.speed;
                    break;
                case 'hue':
                    param.value = this.current_curve.colour.split(' ')[0].split('(')[1];
                    param.style.color = this.current_curve.colour;
                    break;
                case 'radius':
                    param.textContent = this.current_curve.shape.radius;
                    break;
                case 'hub':
                    param.textContent = this.current_curve.shape?.hub;
                    break;
                case 'rotation':
                    // param.textContent = this.current_curve.rotation;
                    break;
                case 'hidden':
                    param.textContent = this.current_curve.hidden;
                    break;
                case 'func':
                    param.textContent = this.current_curve.func;
                    break;
                case 'params':
                    param.textContent = this.current_curve.params;
                    break;
                default:
            }
        });
    }

    #create_params_section() {
        const select_curve = document.querySelector('section#controls > #params-wrapper >select#curve-select');
        this.curve_names.forEach(curve_name => {
            const option = new Option(curve_name, curve_name);
            select_curve.add(option);
            option.style.color = this.curves[curve_name].colour;            
        });
        select_curve.style.color = this.current_curve.colour;
        select_curve.addEventListener('change', event => {
            this.current_curve = this.curves[event.target.value];
            event.target.style.color = this.current_curve.colour;
            this.#update_parameter_display();
        });
        param_details.addEventListener('change', event => {
            console.log(event.target.id);
            console.log(event.target.selectedOptions[0].value);
            const param = event.target.id;
            const value = event.target.selectedOptions[0].value;
            switch(param) {
                case 'shape':
                    this.current_curve.shape = this.#get_random_shape(value);
                    break;
                case 'order':
                    this.current_curve.shape.order = Number(value);
                    break;
                case 'speed':
                    this.current_curve.speed = Number(value);
                    break;
                case 'hue':
                    this.current_curve.colour = `hsl(${value} 100% 50%)`;
                case 'rotation':
                    this.current_curve.rotation = Number(value);
                default:
                    break;
            }
        });
        this.#update_parameter_display();
    }

    #get_random_colour() {
        return `hsl(${rand_int(360)} 100% 50%)`;
    }

    #get_random_shape(type) {
        if (!['Star', 'Polygon'].includes(type)) {
            type = Math.random() < 0.5 ? 'Star' : 'Polygon';
        }
        return type == 'Star'
            ? new Star(rand_in_range(3, 13), rand_in_range(2, 128), rand_in_range(0, 64), '#111', 2)
            : new Polygon(rand_in_range(3, 13), rand_in_range(2, 64), '#111', 4);
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
        this.#update_parameter_display();
        this.update();
    }

    update() {
        super.update();
        let x, y, position_aggregate = 0;
        for (let i = 0; i < this.curve_names.length; i++) {
            const curve = this.curves[this.curve_names[i]];
            const shape = curve.shape;
            if (!curve.hidden) {
                [x, y] = this.#transform_to_canvas(curve.func(...curve.params, this.progress * curve.speed));
                position_aggregate +=  (y + (x / this.width)) * 0.5;
                this.ctx.save();
                this.ctx.translate(x, y);
                this.ctx.rotate(curve.rotation * this.progress);
                shape.draw(this.ctx, 0, 0, curve.colour, this.progress);
                this.ctx.restore();
            }
            osc.frequency.value = (1 - position_aggregate / 2 / this.height) * 385 + 55;
        }
        if (!this.paused) {
            requestAnimationFrame(this.update.bind(this));
        }    
    }
}

class Shape {
    constructor(outline, thickness) {
        this.outline = outline;
        this.thickness = thickness;
        this.hidden = false;
    }
}

class Polygon extends Shape {
    static instance_count = 0;
    constructor(order, radius, outline, thickness) {
        super(outline, thickness);
        this.id = Polygon.instance_count++;
        this.order = order;
        this.radius = radius;
    }
    draw(ctx, x, y, colour, progress) {
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
        if (colour) {
            ctx.fillStyle = colour;
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
    constructor(order, radius_outer, radius_inner, outline, thickness) {
        super(outline, thickness);
        this.id = Star.instance_count++;
        this.order = order;
        this.radius = radius_outer;
        this.hub = radius_inner;
    }
    draw(ctx, x, y, colour, progress) {
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
        if (colour) {
            ctx.fillStyle = colour;
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
    if (scenes.length) {
        console.log(scenes);
        for (const scene of scenes) {
            delete scene;
        }
        scenes = [];
    }
    const {width: main_width, height: main_height} = main.getBoundingClientRect();
    
    canvas.width = Math.floor(main_width - 200);
    canvas.height = main_height;
    const scene = new ShapeScene(canvas, Curves, controls);
    scenes.push(scene);
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
const param_details = document.querySelector('#params-wrapper > #details');
let scenes = [];
// Set up controls


document.querySelector('aside#help button').addEventListener('click', event => {
    event.target.parentElement.style.display = 'none';
});

let osc = oscillate();
document.addEventListener('click', event => {
    if (osc.status == 'initial') {
        osc.start();
        osc.context.suspend();
        osc.status = 'playing';
    }
});

['load', 'resize'].forEach(event => window.addEventListener(event, init));
