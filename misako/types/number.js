const Type = require('./base');

class NumberType extends Type {
    constructor(misako) {
        super(misako);
        this.name = 'number';
    };

    parse(value) {
        return Number(value);
    };
}

module.exports = NumberType;