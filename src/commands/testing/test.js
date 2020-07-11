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
      ownerOnly: false,
      canDM: false,
      args: [
        {
            key: 'username',
            type: 'user',
            required: true,
            repeatable: false
        }
      ]
    });

  }

  async run(misako, msg, { username }) {
    console.log(username);
  }
}

module.exports = TestCommand;