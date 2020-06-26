const TypeBase = require('./base');

class EmojiType extends TypeBase {
  constructor(misako) {
    super(misako);
    this.name = 'emoji';
    this.misako = misako;
  }

  parse(msg, value) {
    let misako = msg.client;
    let regexMatch = value.match(/^(?:<a?:([a-zA-Z0-9_]+):)?([0-9]+)>?$/);
    if (regexMatch) {
      return misako.emojis.cache.get(regexMatch[2]);
    }
    value = value.toLowerCase();
    let search = misako.emojis.cache.filter(emoji => emoji.name.toLowerCase() == value);
    if (!search.size) return undefined;
    if (search.size == 1) return search.first();
    return undefined;
  }
}

module.exports = EmojiType;