const Type = require('./base');

class NumberType extends Type {
    constructor(misako) {
        super(misako);
        this.name = 'number';
    };

    parse(msg, value) {
        return Number(value);
    };
}

module.exports = NumberType;