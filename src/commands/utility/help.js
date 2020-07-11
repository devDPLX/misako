const Command = require('../base');
const { MessageEmbed } = require('discord.js');

class HelpCommand extends Command {
  constructor(Client) {
    super(Client, {
      name: 'help',
      aliases: ['?'],
      description: 'Lists all commands or help with a specific command.',
      group: 'utility',
      nsfw: false,
      throttle: 0,
      examples: ['help', 'help prefix'],
      ownerOnly: false,
      canDM: true,
      args: [{
        key: 'commandName',
        type: 'string',
        required: false,
        repeatable: false
      }]
    });

  }

  async run(misako, msg, { commandName }) {
    let commands = misako.commands;
    let groups = misako.groups;
    let channel = msg.channel;
    let author = msg.author;
    let msgEmbed = new MessageEmbed({
      title: '**Misako**',
      footer: {
        text: 'A bot by dep1etion.',
        iconURL: misako.user.defaultAvatarURL
      },
      color: '#0099ff'
    });
    //--
    if (commandName !== undefined) {
      let command = misako.fetchCommand(commandName);
      let _string = '';
      if (!command) {
        channel.sendEmbed(`No command by that name exists. You can use **${misako.prefix}help** to get a list of all the commands I can perform for you.`);
        return;
      } else {
        _string += `**aliases:** ${String(command.aliases) || 'No aliases given.'}\n`;
        _string += `**description:** ${command.description}\n`;
        _string += `**group:** ${command.group}\n`;
        _string += `**nsfw:** ${command.nsfw || false}\n`;
        _string += `**examples:** ${String(command.examples) || 'No examples given.'}\n`;
        _string += `**ownerOnly:** ${command.ownerOnly || false}\n`;
        _string += `**guildOnly:** ${command.canDM || false}\n`;
        msgEmbed.addFields({
          name: `**__${command.name} __**`,
          value: _string
        });
      }
    } else {
      if (msg.channel.type == 'text') {
        msgEmbed.setDescription(`**__List of commands you can perform in ${msg.guild.name}__**`);
      } else {
        msgEmbed.setDescription(`**__List of commands you can perform in DMs__**`);
      }
      for (const group of groups) {
        let atleastOne = false;
        let groupString = `**__${group}__**`;
        let commandString = '';
        commands.each(command => {
          if (command.group == group && command.canRunCommand(msg)[0]) {
            if (!atleastOne) {
              atleastOne = true;
            }
            commandString += `**${command.name}:** ${command.description}\n`;
          }
        });
        if (atleastOne) {
          msgEmbed.addFields({
            name: groupString,
            value: commandString
          });
        }
      }
    }
    msg.channel.send(msgEmbed);
  }
}

module.exports = HelpCommand;