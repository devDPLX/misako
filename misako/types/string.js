const Type = require('./base');

class StringType extends Type {
    constructor(misako) {
        super(misako);
        this.name = 'string';
    };

    parse(msg, value) {
        return String(value);
    };
}

module.exports = StringType;