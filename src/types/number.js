const TypeBase = require('./base');

class NumberType extends TypeBase {
  constructor(misako) {
    super(misako);
    this.name = 'number';
  }

  parse(msg, value) {
    return Number(value);
  }
}

module.exports = NumberType;