const Type = require('./base');

class NumberType extends Type {
    constructor(misako, msg, options) {
        super(misako, msg, options);
        this.default = 0;
        this.value = options.value || this.default;
    };

    get value() {
        return this._value;
    };

    set value(newValue) {
        if (isNaN(newValue)) {
            throw new Error(`newValue: ${String(newValue)} is not a number.`);
        };
        this._value = newValue;
    };
}

module.exports = NumberType;