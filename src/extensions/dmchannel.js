const { Structures, MessageEmbed } = require('discord.js');

module.exports = Structures.extend('DMChannel', DMChannel => {
  class ExtendedDMChannel extends DMChannel {
    constructor(misako, options) {
      super(misako, options);
    }

    async sendEmbed(content, options = {}) {
      return new Promise((resolve, reject) => {
        if (!content) {
          reject('Content not given.');
        }
        content = String(content);
        if (!content) {
          reject('Content was not valid type.');
        }
        let msgEmbed = new MessageEmbed({
          title: options.title || '**Misako**',
          description: content || 'No content was given for this field.',
          footer: {
            text: 'A bot by dep1etion.',
            iconURL: this.client.user.avatarURL()
          },
          hexColor: options.color || '#0099ff'
        });
        msgEmbed.setTimestamp();
        resolve(this.send(msgEmbed));
      });
    }
  }

  return ExtendedDMChannel;
})