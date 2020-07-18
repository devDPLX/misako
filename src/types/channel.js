const TypeBase = require('./base');

class ChannelType extends TypeBase {
  constructor(misako) {
    super(misako);
    this.name = 'channel';
    this.misako = misako;
  }

  parse(msg, value) {
    let guild = msg.guild;
    let channels = guild.channels.cache;
    //--
    let regexMatch = value.match(/^(?:<#)?([0-9]+)>?$/);
    if (regexMatch) {
      return channels.get(regexMatch[1]) || undefined;
    }
    value = value.toLowerCase();
    let search = msg.guild.channels.cache.filter(channel => { 
      return channel.name.toLowerCase() == value
    });
    if (!search.size) return undefined;
    return search.first();
  }
}

module.exports = ChannelType;