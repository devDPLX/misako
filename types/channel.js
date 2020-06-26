const TypeBase = require('./base');

class ChannelType extends TypeBase {
  constructor(misako) {
    super(misako);
    this.name = 'channel';
    this.misako = misako;
  }

  parse(msg, value) {
    let misako = this.misako;
    let guild = msg.guild;
    let channels = guild.channels.cache;
    //--
    let regexMatch = value.match(/^(?:<#)?([0-9]+)>?$/);
    if (regexMatch) {
      return channels.get(regexMatch[1]) || undefined;
    }
    return undefined;
  }
}

module.exports = ChannelType;