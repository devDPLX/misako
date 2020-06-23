const { Structures, MessageEmbed } = require('discord.js');

module.exports = Structures.extend('TextChannel', TextChannel => {
  class ExtendedTextChannel extends TextChannel {
    constructor (misako, options) {
      super(misako,options);
    };

    sendEmbed(content, options) {
      if (!content) { throw new Error('Content not given.'); };
      content = String(content);
      if (!content) { throw new Error('Content was not valid type.'); };
      let msgEmbed = new MessageEmbed({
        title: options.title || '**Misako**',
        description = content || 'No content was given for this field.',
        footer: {
          text: 'A bot by dep1etion.',
          iconURL: this.client.user.defaultAvatarURL
        },
        color: options.color || '#0099ff'
      });
      msgEmbed.setTimestamp();
      this.send(msgEmbed);
    };
  };

  return ExtendedTextChannel;
})