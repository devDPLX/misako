const Type = require('./base');

class StringType extends Type {
    constructor(misako) {
        super(misako);
        this.name = 'string';
    };

    parse(value) {
        return String(value);
    };
}

module.exports = StringType;