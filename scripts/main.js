// Main Javascript file for Trig Worms
// John Lynch - January 2024

const Curves = {

    merlin: {
        func: (a, b, c, d, t) => {
            return [
                Math.cos(a * Math.cos(b + Math.cos(t))),
                Math.sin(c * Math.sin(d + Math.sin(t))),
            ];
        },
        params: [56, 12, 76, 102],  // good use of whole space
        speed: 0.002,
        hidden: false
    },

    curious: {
        func: (a, b, c, d, e, f, g, t) => {
            const t_ = t / 10;
            const [ad, ae, af, ag] = [d, e, f, g].map(w => Math.abs(w));
            return [
                (Math.cos(a * t_) + Math.cos(b * t_) / d + Math.sin(c * t_) / e) * ad * ae / (ad * ae + ad + ae),
                (Math.sin(a * t_) + Math.sin(b * t_) / f + Math.cos(c * t_) / g) * af * ag / (af * ag + af + ag)
            ];
        },
        params: [3, -5, 17, 5, -3.5, 3.4, .9],   // more beautiful loops!!
        speed: 0.2,
        // params: [27, 291, 77, 5, 400, 512, 2239],
        // speed: 0.02,
        // params: [11, 3, 17, 5, 28, 64, 9], // ball of string
        // speed: 0.1,
        // params: [3, -3, 17, 5, 28, 64, 9],  // twisted oval frame
        // speed: 0.4,
        // params: [-5, 7, 2, -1, 2, -5, 1],    // wide bowtie
        // speed: 0.4,
        // params: [-2.5, 2.5, 8, -2, -28, -64, -9],   // hoop of wire
        // speed: 0.4,
        // params: [-2.5, 2.5, 19, -4, -28, -64, -9],   // mirror frame, woven
        // speed: 0.4,
        // params: [3, -3, 17, 5, 5, 64, 9],   // oval frame
        // speed: 0.4,
        // params: [3, -3, 17, 5, -3.5, 3.4, .9],   // beautiful loops!!
        // speed: 0.2,
        // params: [3, -5, 19, 5, -4.5, 2.4, .707],   // yet more beautiful loops!!
        // speed: 0.2,
        // params: [-2, 1.5, 5, 1.367, 2.5, -2.4, 1.707],   // beautiful loopy assymetry
        // speed: 0.4,
        // params: [-2.11, 1.4142, 3, 2.367, 2.5, -2.4, 1.707],   // complex ball of string
        // speed: 0.4,
        hidden: false
    },

    dormouse: {
        func: (a, b, t) => {
            return [
                (Math.sin(a * Math.cos(t)) + Math.cos(b * Math.sin(t))) / 2,
                (Math.cos(a * Math.sin(t)) - Math.sin(b * Math.cos(t))) / 2,
            ];
        },
        params: [33, 11],   // electron rings
        speed: 0.005,
        hidden: true
    },

    epitrochoid: {
        func: (a, b, c, t) => {
            return [
                ((a + b) * Math.cos(t) - c * Math.cos((a / b + 1) * t)) / (Math.abs(a) + Math.abs(b) + Math.abs(c)),
                ((a + b) * Math.sin(t) - c * Math.sin((a / b + 1) * t)) / (Math.abs(a) + Math.abs(b) + Math.abs(c)),
            ];
        },
        params: [15, 23, -8],
        speed: 0.1,
        hidden: true
    },

    ovaloopy: {
        func: (a, b, t) => {
            return [
                (Math.sin(a * t) * Math.cos(b * t)),
                (Math.cos(a * t) / (y = Math.sin(b * t)) ? y : 0.00000000000000000001),
            ];
        },
        params: [51, 71],
        speed: 0.002,
        hidden: true
    },

    n_folium: {
        func: (a, b, t) => {
            return [
                (Math.sin(a * t) + Math.sin(b * t)) / 2,
                (Math.cos(a * t) - Math.cos(b * t)) / 2,
            ];
        },
        params: [11, 8],
        speed: 0.02,
        hidden: true
    },

    lissajous: {
        func: (kx, ky, t) => {
            return [
                Math.cos(kx * t),
                Math.sin(ky * t)
            ];
        },
        params: [-3.1, 4.61],
        speed: 0.02,
        hidden: true
    },

    rhodonea: {
        func: (k, t) => [
            Math.cos(k * t + t) * Math.cos(t),
            Math.cos(k * t + t) * Math.sin(t),
        ],
        params: [27 / 11],
        speed: 0.02,
        hidden: true
    },

    hypotrochoid: {
        func: (R, r, d, t) => {
            return [
                ((R - r) * Math.cos(t) + d * Math.cos((R - r) / r * t)) / (R - r + d),
                ((R - r) * Math.sin(t) - d * Math.sin((R - r) / r * t)) / (R - r + d)
            ];
        },
        params: [13, 11, 1],
        speed: 0.1,
        hidden: true
    },

    hypocycloid: {
        func: (a, b, t) => {
            const r = a - b;
            const p = r / b;
            return [
                (r * Math.cos(t) + b * Math.cos(p * t)) / a,
                (r * Math.sin(t) - b * Math.sin(p * t)) / a
            ];
        },
        params: [39.5, 37],
        speed: 0.3,
        hidden: true
    },

    concave: {
        func: (a, b, t) => {
            return [
                (a * Math.cos(-t) + Math.cos(b * t)) / (a + 1),
                (a * Math.sin(-t) + Math.sin(b * t)) / (a + 1)
            ];
        },
        params: [13, 41],
        speed: 0.05,
        hidden: false
    },

    concave_ex: {
        func: (a, b, c, d, t) => {
            return [
                (a * Math.cos(-t) + Math.cos(b * t)) / (a + 1),
                (c * Math.sin(-t) + Math.sin(d * t)) / (c + 1)
            ];
        },
        // params: [13, 15, 17, 19],
        params: [1, 4, 6, 9],
        speed: 0.05,
        hidden: false
    },

    convoluted: {
        func: (a, b, t) => {
            return [
                (Math.sin(a * Math.cos(t)) + Math.cos(b * Math.sin(t))) / 2,
                (Math.cos(a * Math.sin(t)) - Math.sin(b * Math.cos(t))) / 2,
            ];
        },
        // params: [137, 19],   // Great string jumble!
        // speed: 0.001,
        // params: [51, 31],    // Twisty bananas
        // speed: 0.005,
        params: [-23, 13],  // unpredictable, all over
        speed: 0.01,
        hidden: true
    },

    trig_grid: {
        func: (p, q, t) => {
            return [            
                Math.sin(p * Math.PI * t / 10),
                Math.cos(q * Math.PI * t / 10)
            ];
        },
        params: [13, 19],
        speed: 0.01,
        hidden: true
    },
    
    wacky_sin: {
        func: (a, b, t) => {
            return [
                (Math.sin(a * t) + Math.sin(b * t)) / 2,
                (Math.sin(a * t) - Math.sin(b * t)) / 2,
            ];
        },
        params: [13, 3],
        speed: 0.02,
        hidden: true
    },

    wacky_cos: {
        func: (a, b, t) => {
            return [
                (Math.cos(a * t) + Math.cos(b * t)) / 2,
                (Math.cos(a * t) - Math.cos(b * t)) / 2,
            ];
        },
        params: [19, 7],
        speed: 0.02,
        hidden: true
    },

    what: {
        func: (a, b, t) => {
            return [
                (Math.sin(a * Math.cos(b * t))),
                (Math.cos(b * Math.sin(a * t))),
            ];
        },
        params: [27, 23],   // 
        speed: 0.0002,
        hidden: true
    },

    wobbly_hcrr: {
        func: (R, r, t) => {
            const s = R - r;
            return [
                (s * Math.cos(t) + r * Math.cos(s / r * t)) / R + 0.05 * Math.sin(t * 10),
                (s * Math.sin(t) - r * Math.sin(s / r * t)) / R - 0.04 * Math.cos(t * 11)
            ];
        },
        params: [-67, -37],
        speed: 0.1,
        hidden: true
    },

    hcrr: {
        func: (R, r, t) => {
            const s = R - r;
            return [
                (s * Math.cos(t) + r * Math.cos(s / r * t)) / R / 4,
                (s * Math.sin(t) - r * Math.sin(s / r * t)) / R / 4
            ];
        },
        params: [7, -6],
        speed: 0.1,
        hidden: true
    },

    astroid: {
        func: (t) => {
            const [c, s] = [Math.cos(t) , Math.sin(t)];
            return [
                c ** 5,
                s ** 5
            ];
        },
        params: [],
        speed: 0.1,
        hidden: true
    },

    loopy: {
        func: (a, b, t) => {
            return [
                (Math.sin(a * t) + Math.cos(b * t)) / 2,
                (Math.cos(a * t) - Math.sin(b * t)) / 2,
            ];
        },
        params: [13, 17],
        speed: 0.04,
        hidden: true
    },

    init: function() {
        Object.keys(this).forEach(key => this[key].name = key);
        delete this.init;
        return this;
    }

}.init();

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
    constructor(canvas, curves) {
        super(canvas);
        
        // Global effects
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = '#000';

        // CanvasRenderingContext2D: globalCompositeOperation property
        // see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
        const gco_values = {
            0: 'source-over',
            1: 'source-in',
            2: 'source-out',
            3: 'source-atop',
            4: 'destination-over',
            5: 'destination-in',
            6: 'destination-out',
            7: 'destination-atop',
            8: 'lighter',
            9: 'copy',
            10:'xor',
            11:'multiply',
            12:'screen',
            13:'overlay',
            14:'darken',
            15:'lighten',
            16:'color-dodge',
            17:'color-burn',
            18:'hard-light',
            19:'soft-light',
            20:'difference',
            21:'exclusion',
            22:'hue',
            23:'saturation',
            24:'color',
            25:'luminosity'
        };
        const gco_type = 0;
        this.ctx.globalCompositeOperation = gco_values[gco_type];
                
        // Curves
        this.curves = curves;
        this.curve_names = Object.keys(this.curves);
        // this.current_curve = this.curves[this.curve_names[0]];
        // let i = 0;
        for (const curve in this.curves) {
            this.curves[curve].default_colour = this.#get_random_colour();
            this.curves[curve].colour = this.curves[curve].default_colour;
            this.curves[curve].shape = this.#get_random_shape();
            this.rotations = [...document.querySelector('select.param#rotation').options].map(option => Number(option.value));
            this.curves[curve].rotation = this.rotations[rand_int(this.rotations.length)];
            this.curves[curve].seed = Math.random() * 4095;
            if (debug) {
                if (this.curves[curve].name !=  debug) {
                    this.curves[curve].hidden = true;
                }
                else {
                    this.current_curve = this.curves[curve];
                    this.curves[curve].hidden = false;
                    this.curves[curve].shape.radius = 8;
                    if (this.curves[curve].shape instanceof HubbedShape) {
                        this.curves[curve].shape.hub = 4;
                    }
                    this.curves[curve].colour = 'hsl(20 100% 50%)';
                    this.curves[curve].rotation = 1;
                }
            }
        }
        
        // UI Controls
        this.#create_curve_checkboxes();
        this.#create_params_section();

        // Buttons
        [...document.querySelectorAll('#buttons>button')].forEach(button => {
            button.addEventListener('click', event => {
                switch(event.target.id) {
                    case 'pause':
                        // Toggle play/pause
                        this.paused = !this.paused;
                        if (!this.paused) {
                            event.target.textContent = 'Pause';
                            requestAnimationFrame(this.update.bind(this));
                        }
                        else {
                            event.target.textContent = 'Play';
                        }
                        break;
                    case 'clear':
                        // Clear drawing
                        this.ctx.clearRect(0, 0, this.width, this.height);
                        this.progress = 0;
                        break;
                    case 'init':
                        location.reload();
                        break;
                    case 'speed':
                        break;
                    case 'github':
                        break;
                    case 'ZU':
                        break;
                    case 'IO':
                        break;
                    case 'chromute':
                        this.current_curve.colour = this.current_curve.colour ? null : this.current_curve.default_colour;
                        this.#update_current_curve_styling();
                        break;
                    case 'debug':
                        this.debug = !this.debug;
                        event.target.textContent = this.debug ? 'User Mode' : 'Debug';
                        break;
                    default:
                }
            });
        });
        
        window.addEventListener('keyup', event => {
            if (!event.ctrlKey && !event.altKey) {
                const char = event.key;
                const digit = char.match(/\d/)?.input;
                if (digit) {
                    // Set number of sides or points (0 - 9)
                    if (this.current_curve.shape?.order) {
                        this.current_curve.shape.order = digit;
                    }
                }
                else {
                    switch(char) {
                        case 'Escape':
                            // Clear drawing
                            this.ctx.clearRect(0, 0, this.width, this.height);
                            this.progress = 0;
                            break;
                        case '*':
                            // Start again from scratch
                            // Doesn't work - doubles the curves!
                            init();
                            break;
                        case 'x':
                            this.current_curve.colour = this.current_curve.colour ? null : this.current_curve.default_colour;
                            this.#update_current_curve_styling();
                            break;
                        case ' ':
                            // Toggle play/pause
                            this.paused = !this.paused;
                            if (!this.paused) {
                                requestAnimationFrame(this.update.bind(this));
                            }
                            break;
                        case 'h':
                            // Show help
                            event.preventDefault();
                            help.style.display = help.style.display == 'none' ? 'block' : 'none';
                            break;
                        default:
                    }
                }
                this.#update_parameter_display();
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
            const colour = this.curves[curve_name].colour;
            label.style.color = colour;
            label.id = `${curve_name}-label`;
            const input = curve_switch.querySelector('input');
            input.type = 'checkbox';
            input.checked = !this.curves[curve_name].hidden;
            input.name = curve_name;
            // Create event listener for when user clicks a curve's checkbox to show/hide it
            input.addEventListener('change', event => {
                const curve = this.curves[event.target.name];
                curve.hidden = !curve.hidden;
                const active_curves = this.curve_names
                .filter(curve_name => !this.curves[curve_name].hidden)
                .map(curve_name => this.curves[curve_name]);
                // If user hides current curve, set current curve to the next active one
                if (curve.hidden && curve == this.current_curve) {
                    if (active_curves.length) {
                        this.current_curve = active_curves[0];
                    }
                    else {
                        this.current_curve = this.curves[this.curve_names[0]];
                    }
                }
                // Set the newly-unhidden curve to be the current curve
                else if (!curve.hidden) {
                    this.current_curve = curve;
                }
                // else... hmmm, if we set it to null, we'll have to include that value in the select...
                this.#update_parameter_display();
            });
            checkboxes.push(input);
        }
    }

    #update_parameter_display() {
        this.#update_current_curve_styling();
        const curve_select = document.querySelector('section#controls > #params-wrapper >select#curve-select');
        const curve_options = curve_select.querySelectorAll('option');
        curve_options.forEach(option => {
            option.style.color = this.curves[option.value].colour;            
        });
        const param_elements = [...document.getElementsByClassName('param')];
        // Hide hub setting for non-hubbed shapes (like polygons)
        [...document.getElementsByClassName('hub-ui')].forEach(el => {
            this.current_curve.shape instanceof HubbedShape ? el.classList.remove('hidden') : el.classList.add('hidden');
        });
        // Hide order setting for rings and moons
        [...document.getElementsByClassName('order-ui')].forEach(el => {
            this.current_curve.shape instanceof Ring || this.current_curve.shape instanceof Moon
                ? el.classList.add('hidden')
                : el.classList.remove('hidden');
        });
        // Hide eccentricity setting for non-rings
        [...document.getElementsByClassName('eccentricity-ui')].forEach(el => {
            this.current_curve.shape instanceof Ring ? el.classList.remove('hidden') : el.classList.add('hidden');
        });
        param_elements.forEach(param => {
            switch(param.id) {
                case 'shape':
                    param.value = this.current_curve.shape.constructor.name;
                    break;
                case 'order':
                    param.value = this.current_curve.shape.order;
                    break;
                case 'eccentricity':
                    param.value = this.current_curve.shape.eccentricity;
                    break;
                case 'speed':
                    param.value = this.current_curve.speed;
                    break;
                case 'hue':
                    const hue_output = param.previousElementSibling.firstElementChild;
                    param.value = hue_output.value = this.#get_hue_from_hsl(this.current_curve.colour)
                    hue_output.style.color = this.current_curve.colour;
                    break;
                case 'radius':
                    param.value = this.current_curve.shape.radius;
                    const radius_output = param.previousElementSibling.firstElementChild;
                    radius_output.value = this.current_curve.shape.radius;
                    break;
                case 'hub':
                    param.value = this.current_curve.shape.hub;
                    const hub_output = param.previousElementSibling.firstElementChild;
                    hub_output.value = this.current_curve.shape.hub;
                    break;
                case 'pulse':
                    param.value = this.current_curve.shape.pulse;
                    const pulse_output = param.previousElementSibling.firstElementChild;
                    pulse_output.value = this.current_curve.shape.pulse;
                    break;
                case 'wave-amp':
                    param.value = this.current_curve.shape.wave_amplitude;
                    const wave_amp_output = param.previousElementSibling.firstElementChild;
                    wave_amp_output.value = this.current_curve.shape.wave_amplitude;
                    break;
                case 'wave-freq':
                    param.value = this.current_curve.shape.wave_frequency;
                    const wave_freq_output = param.previousElementSibling.firstElementChild;
                    wave_freq_output.value = this.current_curve.shape.wave_frequency;
                    break;
                case 'rotation':
                    param.value = this.current_curve.rotation;
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
        const curve_select = document.querySelector('section#controls > #params-wrapper >select#curve-select');
        this.curve_names.forEach(curve_name => {
            const option = new Option(curve_name, curve_name);
            curve_select.add(option);
            option.style.color = this.curves[curve_name].colour;            
        });
        curve_select.style.color = this.current_curve.colour;
        curve_select.addEventListener('change', event => {
            this.current_curve = this.curves[event.target.value];
            if (this.current_curve.hidden) {
                this.current_curve.hidden = false;
                this.#update_parameter_display();
            }
            event.target.style.color = this.current_curve.colour;
            this.#update_parameter_display();
            event.target.blur();
        });

        param_details.addEventListener('change', event => {
            const param = event.target.id;
            let value;
            switch(param) {
                case 'shape':
                    value = event.target.selectedOptions[0].value;
                    switch (value) {
                        case 'Star':
                            this.current_curve.shape = new Star(
                                this.current_curve.shape.order ?? 5, 
                                this.current_curve.shape.radius, 
                                this.current_curve.shape.hub ?? Math.floor(this.current_curve.shape.radius / 4),
                                '#111',
                                1,
                                this.current_curve.shape.pulse,
                                this.current_curve.shape.wave_amplitude,
                                this.current_curve.shape.wave_frequency
                            );
                            break;
                        case 'Polygon':
                            this.current_curve.shape = new Polygon(
                                this.current_curve.shape.order ?? 5, 
                                this.current_curve.shape.radius,
                                '#111',
                                1,
                                this.current_curve.shape.pulse,
                                this.current_curve.shape.wave_amplitude,
                                this.current_curve.shape.wave_frequency
                            );
                            break;
                        case 'Ring':
                            this.current_curve.shape = new Ring(
                                rand_int(6) / 5,    // eccentricity
                                this.current_curve.shape.radius,
                                this.current_curve.shape.hub ?? Math.floor(this.current_curve.shape.radius / 4),
                                '#111',
                                1,
                                this.current_curve.shape.pulse,
                                this.current_curve.shape.wave_amplitude,
                                this.current_curve.shape.wave_frequency
                            );
                            break;
                        case 'Moon':
                            this.current_curve.shape = new Moon(
                                this.current_curve.shape.radius,
                                '#111',
                                1,
                                this.current_curve.shape.pulse,
                                this.current_curve.shape.wave_amplitude,
                                this.current_curve.shape.wave_frequency
                            );
                            break;
                        default:
                            console.log('Invalid shape!');
                    }
                    break;
                case 'order':
                    value = event.target.selectedOptions[0].value;
                    this.current_curve.shape.order = Number(value);
                    break;
                case 'eccentricity':
                    value = event.target.selectedOptions[0].value;
                    this.current_curve.shape.eccentricity = Number(value);
                    break;
                case 'speed':
                    value = event.target.selectedOptions[0].value;
                    this.current_curve.speed = Number(value);
                    break;
                case 'hue':
                    value = event.target.value;
                    const colour = this.current_curve.colour = `hsl(${value} 100% 50%)`;
                    document.getElementById(`${this.current_curve.name}-label`).style.color = colour;
                    const hue_output = document.getElementById('hue-output');
                    hue_output.style.color = colour;
                    hue_output.value = value;
                    const curve_select = document.querySelector('section#controls > #params-wrapper >select#curve-select');
                    curve_select.style.color = colour;
                    break;
                case 'radius':
                    value = event.target.value;
                    this.current_curve.shape.radius = Number(value);
                    const radius_output = document.getElementById('radius-output');
                    radius_output.value = value;
                    break;
                case 'hub':
                    value = event.target.value;
                    this.current_curve.shape.hub = Number(value);
                    const hub_output = document.getElementById('hub-output');
                    hub_output.value = value;
                    break;
                case 'pulse':
                    value = event.target.value;
                    this.current_curve.shape.pulse = Number(value);
                    const pulse_output = document.getElementById('pulse-output');
                    pulse_output.value = value;
                    break;
                case 'wave-amp':
                    value = event.target.value;
                    this.current_curve.shape.wave_amplitude = Number(value);
                    const wave_amp_output = document.getElementById('wave-amp-output');
                    wave_amp_output.value = value;
                    break;
                case 'wave-freq':
                    value = event.target.value;
                    this.current_curve.shape.wave_frequency = Number(value);
                    const wave_freq_output = document.getElementById('wave-freq-output');
                    wave_freq_output.value = value;
                    break;
                case 'rotation':
                    value = event.target.selectedOptions[0].value;
                    this.current_curve.rotation = Number(value);
                default:
                    break;
            }
            this.#update_parameter_display();
        });
        this.#update_parameter_display();
    }

    #get_random_colour() {
        const r = rand_int(290);
        return `hsl(${(r) + (r > 70 ? 70 : 0)} 100% 50%)`;
    }

    #get_hue_from_hsl(hsl_colour) {
        return hsl_colour ? hsl_colour.split(' ')[0].split('(')[1] : -1;
    }

    #get_random_shape() {
        const shapes = ['Star', 'Polygon', 'Ring', 'Moon'];
        switch(rand_int(shapes.length)) {
            case 0:
                return new Star(rand_in_range(3, 9), rand_in_range(6, 36), rand_in_range(1, 16), '#111', 1, 0, 0, 4);
            case 1:
                return new Polygon(rand_in_range(3, 9), rand_in_range(6, 64), '#111', 1, 0, 0, 4);
            case 2:
                const r = rand_in_range(8, 40);
                return new Ring(rand_int(6) / 5, r, Math.floor(r / 4), '#111', 1, 0, 0, 4);
            case 3:
                return new Moon(rand_in_range(6, 64), '#111', 1, 0, 0, 4);            
            default:
        }
    }

    #update_current_curve_styling() {
        const chromute_button = document.querySelector('button#chromute');
        const curve_checkbox = document.querySelector(`input[name="${this.current_curve.name}"]`);
        const curve_label = document.querySelector(`label#${this.current_curve.name}-label`);
        const curve_option = [...document.querySelector('select#curve-select').options].filter(option => option.value == this.current_curve.name)[0];
        
        chromute_button.textContent = this.current_curve.colour ? 'Chromute' : 'Plain';
        curve_checkbox.style.background = 
            this.current_curve.colour 
            ? '#000' 
            : rg_0;
        curve_label.style.background =
            this.current_curve.colour 
            ? '#000' 
            : rg_0;
        curve_label.style.color =
            this.current_curve.colour 
            ? this.current_curve.colour 
            : 'hsl(36 100% 90%)';
        curve_option.style.backgroundColor =
            this.current_curve.colour 
            ? '#000' 
            : this.current_curve.default_colour;
        curve_option.style.Color =
            this.current_curve.colour 
            ? this.current_curve.colour
            : '#000';
    }
    
    #transform_to_canvas([x, y]) {
        return [
            Math.floor(x = (x + 1) / 2 * this.width),
            Math.floor(y = (y + 1) / 2 * this.height)
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
        for (let i = 0; i < this.curve_names.length; i++) {
            const curve = this.curves[this.curve_names[i]];
            const shape = curve.shape;
            if (!curve.hidden) {
                const [x, y] = this.#transform_to_canvas(curve.func(...curve.params, this.progress * curve.speed + curve.seed));
                this.ctx.save();


                const [nx, ny] = [shape.y_last - y, x - shape.x_last];
                const mag = Math.sqrt(nx * nx + ny * ny);
                shape.normal = mag ? {x: nx / mag, y: ny / mag} : {x: 0, y: 0};
                [shape.x_last, shape.y_last] = [x, y];
                const x_ = x + shape.wave_amplitude * Math.sin(this.progress * shape.wave_frequency) * shape.normal.x;
                const y_ = y + shape.wave_amplitude * Math.sin(this.progress * shape.wave_frequency) * shape.normal.y;

                this.ctx.translate(x_, y_);
                this.ctx.rotate(curve.rotation * this.progress);
                shape.draw(this.ctx, 0, 0, curve.colour, this.progress);
                this.ctx.restore();
            }
        }
        if (!this.paused) {
            requestAnimationFrame(this.update.bind(this));
        }    
    }
}

class Shape {
    constructor(outline, thickness, pulse, wave_amplitude, wave_frequency) {
        this.type = this.constructor.name;
        this.outline = outline;
        this.thickness = thickness;
        this.hidden = false;
        this.pulse = pulse;
        this.x_last = 0;
        this.y_last = 0;
        this.normal = null;
        this.wave_amplitude = wave_amplitude;
        this.wave_frequency = wave_frequency;
    }
    draw(x, y) {
    }
}

class Polygon extends Shape {
    static instance_count = 0;
    constructor(order, radius, outline, thickness, pulse, wave_amplitude, wave_frequency) {
        super(outline, thickness, pulse, wave_amplitude, wave_frequency);
        this.id = Polygon.instance_count++;
        this.order = order;
        this.radius = radius;
    }
    draw(ctx, x, y, colour, progress) {
        super.draw(x, y);
        let r = this.radius;
        if (this.pulse) {
            r +=  Math.max(-r + 1, this.pulse * Math.sin(progress) * r);
        }
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.moveTo(0, r);
        for (let i = 0; i < this.order; i++) {
            ctx.rotate(2 * Math.PI / this.order);
            ctx.lineTo(0, r);
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
            ctx.fillStyle = `hsl(${Math.sin(progress / 16) * 90 + 270 + this.order * r} 100% 50%)`;
            ctx.fill();
        }
        ctx.restore();
    }
}

class Moon extends Shape {
    static instance_count = 0;
    constructor(radius, outline, thickness, pulse, wave_amplitude, wave_frequency) {
        super(outline, thickness, pulse, wave_amplitude, wave_frequency);
        this.id = Moon.instance_count++;
        this.radius = radius;
    }
    draw(ctx, x, y, colour, progress) {
        super.draw(x, y);
        let r = this.radius;
        if (this.pulse) {
            r +=  Math.max(-r + 1, this.pulse * Math.sin(progress) * r);
        }
        ctx.save();
        ctx.beginPath();
        ctx.translate(x, y);
        ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, true);
        ctx.arcTo(- r / 2, 0, 0, -r, 2 * r);
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
            ctx.fillStyle = `hsl(${Math.sin(progress / 32) * 90 + 270 + this.id * r} 100% 50%)`;
            ctx.fill();
        }
        ctx.restore();
    }
}

class HubbedShape extends Shape {
    // Meant to be an abstract class, don't instantiate!
    static instance_count = 0;
    constructor(radius_outer, radius_inner, outline, thickness, pulse, wave_amplitude, wave_frequency) {
        super(outline, thickness, pulse, wave_amplitude, wave_frequency);
        this.radius = radius_outer;
        this.hub = radius_inner;
    }
    draw(x, y) {
        super.draw(x, y);
    }
}

class Ring extends HubbedShape {
    static instance_count = 0;
    constructor(eccentricity, radius_outer, radius_inner, outline, thickness, pulse, wave_amplitude, wave_frequency) {
        super(radius_outer, radius_inner, outline, thickness, pulse, wave_amplitude, wave_frequency);
        this.id = Ring.instance_count++;
        this.eccentricity = eccentricity;
    }
    draw(ctx, x, y, colour, progress) {
        super.draw(x, y);
        let r = this.radius;
        if (this.pulse) {
            r +=  Math.max(-r + 1, this.pulse * Math.sin(progress) * r);
        }
        ctx.fillStyle = colour ?? `hsl(${Math.sin(progress / this.radius * (this.id + 1)) * 90 + 270} 100% 50%)`;
        ctx.beginPath();
        ctx.ellipse(x, y, r, r * this.eccentricity, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'hsla(0, 0%, 0%, 1)';
        ctx.beginPath();
        ctx.ellipse(x, y, this.hub, this.hub * this.eccentricity, 0, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Star extends HubbedShape {
    static instance_count = 0;
    constructor(order, radius_outer, radius_inner, outline, thickness, pulse, wave_amplitude, wave_frequency) {
        super(radius_outer, radius_inner, outline, thickness, pulse, wave_amplitude, wave_frequency);
        this.id = Star.instance_count++;
        this.order = order;
    }
    draw(ctx, x, y, colour, progress) {
        super.draw(x, y);
        let r = this.radius;
        if (this.pulse) {
            r +=  Math.max(-r + 1, this.pulse * Math.sin(progress) * r);
        }
        ctx.save();
        {
            ctx.beginPath();
            ctx.translate(x, y);
            ctx.moveTo(0, r);
            for (let i = 0; i < this.order; i++) {
                ctx.lineTo(0, r);
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
                ctx.fillStyle = `hsl(${Math.sin(progress / (this.order * this.radius / 4)) * 90 + 270} 100% 50%)`
                ctx.fill();
            }
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
    const scene = new ShapeScene(canvas, Curves);
    scenes.push(scene);
    scene.render();
}

// Utility functions
const rand_in_range = (m, n) => Math.floor((n - m) * Math.random() + m);
const rand_int = n => Math.floor(n * Math.random());


// end of classes and functions
// ============================

// Main code
debug = 'concave_ex';
const rg_0 = 'radial-gradient(#0000ff, #990029)';
const main = document.getElementById('main');
const help = document.querySelector('aside#help');
const canvas = document.querySelector('canvas');
const param_details = document.querySelector('#params-wrapper > #details');
let scenes = [];

document.querySelector('aside#help button').addEventListener('click', event => {
    event.target.parentElement.style.display = 'none';
});

['load', 'resize'].forEach(event => window.addEventListener(event, init));
