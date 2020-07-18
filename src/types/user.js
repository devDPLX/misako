const TypeBase = require('./base');

class UserType extends TypeBase {
  constructor(misako) {
    super(misako);
    this.name = 'user';
    this.misako = misako;
  }

  parse(msg, value) {
    let misako = msg.client;
    let users = misako.users.cache;
    //--
    let regexMatch = value.match(/^(?:<@!?)?([0-9]+)>?$/);
    if (regexMatch) {
      return users.get(regexMatch[1]) || undefined;
    }
    value = value.toLowerCase();
    let search = users.filter(user => { 
      return user.username.toLowerCase() == value
    });
    if (!search.size) return undefined;
    if (search.size == 1) return search.first();
    return undefined;
  }
}

module.exports = UserType;