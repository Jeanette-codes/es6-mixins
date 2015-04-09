/**
 * Remember mixins? Until facebook and various react utilities figure out a new solution this will
 * make mixins work how they used to, by adding mixin methods directly to your react component.
 *
 * @param {function/array} mixins A reference to your mixin class
 * @param {object} context A reference to the react component class. Usually just "this".
 * @param {object} options An object of optional settings".
 * @returns undefined
 *
 * use it like this in your constructor:
 * mixins([mixin1, mixin2], this, {options});
 */
class Mixins {

    init(mixins, context, options) {
        this.mixins = mixins;
        this.context = context;

        this.opt = {
            warn            : true,
            mergeDuplicates : true
        };

        this.contextMethods = Object.getOwnPropertyNames(this.context.constructor.prototype);
        this.reactMethods = [
            'componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'componentDidUpdate',
            'componentWillUnmount'
        ];

        if (options) {
            this.opt.warn = options.warn !== undefined ? options.warn : this.opt.warn;
            this.opt.mergeDuplicates = options.mergeDuplicates !== undefined ? options.mergeDuplicates : this.opt.mergeDuplicates;
        }

        if (this.mixins.constructor === Array) {
            mixins.map(function (mixin) {
                this.grabMethods(mixin);
            }, this);
        } else if (typeof mixins === 'function' || typeof mixins === 'object') {
            this.grabMethods(mixins);
        } else {
            throw ('mixins expects a function, an array, or an object. Please and thank you');
        }
    }

    /**
     * If the method doesn't already exist on the react component, simply add this to it.
     *
     * @param {string} mm The name of a single mixin method
     * @param {function} currentMixin A reference to the mixin you are adding to the react component
     */
    addNewMethod(mm, currentMixin) {
        if (this.mixins.prototype) {
            this.context.constructor.prototype[mm] = this.mixins.prototype[mm];
        } else {
            this.context.constructor.prototype[mm] = typeof currentMixin === 'object' ? currentMixin[mm] : currentMixin.prototype[mm];
        }
        this.contextMethods = Object.getOwnPropertyNames(this.context.constructor.prototype);
    }

    /**
     * If there is already a method on your react component that matches the mixin method create a new function that
     * calls both methods so they can live in harmony.
     *
     * @param {string} mm The name of a single mixin method
     * @param {string} cm The name of the matched react method to extend
     * @param {function} currentMixin A reference to the mixin being added to the react method.
     */
    extendMethod(mm, cm, currentMixin) {
        let orig = this.context[cm];
        let newMethod = typeof currentMixin === 'object' ? currentMixin[mm] : currentMixin.prototype[mm];
        this.context[mm] = function () {
            newMethod.call(this, arguments);
            orig.call(this, arguments);
        };
    }

    /**
     * Takes a mixin method and sends it along the pipe
     * @param {function} mixin A single method from your mixin
     *
     */
    grabMethods(mixin) {
        let currentMixin = mixin;
        let mixinMethods = typeof mixin === 'object' ? Object.getOwnPropertyNames(mixin) : Object.getOwnPropertyNames(mixin.prototype);

        mixinMethods.map((method) => {
            if (method !== 'constructor' && method !== 'render') {
                this.checkForMatch(method, currentMixin);
            }
        }, this);
    }

    /**
     * Checks the react component to see if the method we want to add is already there.
     * If it is a duplicate and a React lifecycle method it silently extends the React method.
     * If it is a duplicate and not a React lifecycle method it warns you before extending the React method.
     *
     * @param {string} mm the mixin method to check against the react methods
     * @param {function} currentMixin A reference to the mixin being added to the React Component.
     */
    checkForMatch(mm, currentMixin) {
        this.contextMethods.map((ctxMethod) => {
            if (mm === ctxMethod) {
                if (this.reactMethods.indexOf(mm) > -1) {
                    this.extendMethod(mm, ctxMethod, currentMixin);
                } else {
                    if (this.opt.warn) {
                        console.warn(mm + ' method already exists within the ' + this.context.constructor.name + ' component.');
                    }
                    if (this.opt.mergeDuplicates) {
                        this.extendMethod(mm, ctxMethod, currentMixin);
                    }
                }
            }
        });
        this.addNewMethod(mm, currentMixin);
    }
}

let mix = new Mixins();

module.exports = mix.init.bind(mix);
