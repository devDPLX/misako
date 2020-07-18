const TypeBase = require('./base');

class MemberType extends TypeBase {
  constructor(misako) {
    super(misako);
    this.name = 'member';
    this.misako = misako;
  }

  parse(msg, value) {
    let guild = msg.guild;
    let members = guild.members.cache;
    //--
    let regexMatch = value.match(/^(?:<@!?)?([0-9]+)>?$/);
    if (regexMatch) {
      return members.get(regexMatch[1]) || undefined;
    }
    return undefined;
  }
}

module.exports = MemberType;