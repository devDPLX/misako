const TypeBase = require('./base');

class RoleType extends TypeBase {
  constructor(misako) {
    super(misako);
    this.name = 'role';
    this.misako = misako;
  }

  parse(msg, value) {
    console.log(value);
    let regexMatch = value.match(/^(?:<@&)?([0-9]+)>?$/);
    if (regexMatch) {
      return msg.guild.roles.cache.get(regexMatch[1]);
    }
    value = value.toLowerCase();
    let search = msg.guild.roles.cache.filter(role => { 
      return role.name.toLowerCase() == value
    });
    if (!search.size) return undefined;
    if (search.size == 1) return search.first();
    return undefined;
  }
}

module.exports = RoleType;