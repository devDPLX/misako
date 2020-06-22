const { Structures, MessageEmbed } = require('discord.js');

module.exports = Structures.extend('DMChannel', DMChannel => {
  class ExtendedDMChannel extends DMChannel {
    constructor (misako, options) {
      super(misako,options);
    };

    sendEmbed(content, options) {
      if (!content) { throw new Error('Content not given.'); };
      content = String(content);
      if (!content) { throw new Error('Content was not valid type.'); };
      this.send(content);
    };
  };

  return ExtendedDMChannel;
})