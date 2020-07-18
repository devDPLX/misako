const Command = require('../base');

class ReloadCommand extends Command {
  constructor(Client) {
    super(Client, {
      name: 'reload',
      aliases: [],
      description: 'Reloads a command after potential changes.',
      group: 'utility',
      nsfw: false,
      throttle: 10,
      examples: ['reload help'],
      ownerOnly: true,
      canDM: true,
      args: [{
        key: 'commandName',
        type: 'string',
        required: true,
        repeatable: false
      }]
    });

  }

  async run(misako, msg, { commandName }) {
    let command = misako.fetchCommand(commandName);
    if (!command) {
      msg.channel.sendEmbed(`That command doesn't exist. Try using **${misako.prefix}help** for a list of all commands.`);
    }
    let commandPath = command.path;
    try {
      misako.commands.delete(command.name);
      delete require.cache[require.resolve(commandPath)];
      let newCommand = require(commandPath);
      misako.registerCommand(newCommand,commandPath);
      msg.channel.sendEmbed('Command successfully reloaded.');
    } catch (e) {
      msg.channel.sendEmbed('There was an error trying to reload that command. My apologies.');
      console.log(e);
    }
  }
}

module.exports = ReloadCommand;