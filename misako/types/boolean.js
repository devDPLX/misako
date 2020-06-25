const Type = require('./base');

class BooleanType extends Type {
    constructor(misako) {
        super(misako);
        this.name = 'boolean';
        this.trueValues = [true,'yes','y','true','t'];
        this.falseValues = [false,'no','n','false','f'];
    };

    parse(msg, value) {
        return trueValues.includes(value) || falseValues.includes(value) || undefined;
    };
}

module.exports = BooleanType;