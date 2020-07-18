const Command = require('../../../src/commands/base');

class TestCommand extends Command {
  constructor(Client) {
    super(Client, {
      name: 'testlol',
      aliases: [],
      description: 'Test command',
      group: 'utility',
      nsfw: false,
      throttle: 0,
      examples: ['test'],
      ownerOnly: false,
      canDM: false,
      permissions: [],
      args: []
    });

  }

  async run(misako, msg) {
    console.log('works');
  }
}

module.exports = TestCommand;