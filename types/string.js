const TypeBase = require('./base');

class StringType extends TypeBase {
    constructor(misako) {
        super(misako);
        this.name = 'string';
    }

    parse(msg, value) {
        return String(value);
    }
}

module.exports = StringType;