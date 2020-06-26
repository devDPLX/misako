const TypeBase = require('./base');

class UserType extends TypeBase {
  constructor(misako) {
    super(misako);
    this.name = 'user';
    this.misako = misako;
  }

  parse(msg, value) {
    let misako = this.misako;
    let users = misako.users.cache;
    //--
    let regexMatch = value.match(/^(?:<@!?)?([0-9]+)>?$/);
    if (regexMatch) {
      return users.get(regexMatch[1]) || undefined;
    }
    return undefined;
  }
}

module.exports = UserType;