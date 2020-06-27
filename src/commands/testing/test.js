const Command = require('../base');

class TestCommand extends Command {
  constructor(Client) {
    super(Client, {
      name: 'test',
      aliases: ['prompttest'],
      description: 'Just a test command.',
      group: 'testing',
      nsfw: false,
      throttle: 5,
      examples: ['test #general'],
      ownerOnly: true,
      canDM: false,
      args: [
        /*{
            key: 'username',
            type: 'user',
            required: true,
            repeatable: false
        }*/
      ]
    });

  }

  async run(misako, msg) {
    let promptMsg = await misako.prompt(msg.author, msg.channel, 'user');
    let msgEmbed = await msg.channel.sendEmbed(promptMsg.content);
    console.log(msgEmbed);
  }
}

module.exports = TestCommand;