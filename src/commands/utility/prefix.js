const Command = require('../base');

class PrefixCommand extends Command {
  constructor(Client) {
    super(Client, {
      name: 'prefix',
      aliases: [],
      description: 'Changes the bot\'s prefix.',
      group: 'utility',
      nsfw: false,
      throttle: 10,
      examples: ['prefix ?'],
      ownerOnly: false,
      canDM: false,
      permissions: ['ADMINISTRATOR'],
      args: [{
        key: 'new-prefix',
        type: 'string',
        required: true,
        repeatable: false
      }]
    });

  }

  async run(misako, msg, arg) {
    if (arg.length > 1) {
      msg.channel.sendEmbed('The prefix can only be one character. Please try the command again.');
      return;
    }
    try {
      misako.settings.ensure(msg.guild.id, misako.defaultSettings);
      misako.settings.set(msg.guild.id, arg, 'prefix');
      misako.prefix = arg;
      msg.channel.sendEmbed('The prefix for this server has been successfully updated.');
    } catch (e) {
      msg.channel.sendEmbed('There was an error setting the prefix. My apologies.');
      console.log(e);
    }
  }
}

module.exports = PrefixCommand;