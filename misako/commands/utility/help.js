const Command = require('../base');

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
            args: [
                {
                    key: 'command-name',
                    type: 'string',
                    required: false,
                    repeatable: false
                }
            ]
        });

    };

    async run(misako, msg, arg) {
        let commands = misako.commands;
        let groups = misako.groups;
        let helpString = '';
        //--
        if (arg) {
            let command = misako.fetchCommand(arg);
            if (!command) { 
                helpString += `No command by that name exists. 
                
You can use **${misako.prefix}help** to get a list of all commands you can perform.`;
            } else {
                helpString += `**__${command.name} command__**
**aliases:** ${toString(command.aliases) || 'No aliases given.'}
**description:** ${command.description}
**group:** ${command.group}
**nsfw:** ${command.nsfw || false}
**examples:** ${command.examples || 'No examples given.'}
**ownerOnly:** ${command.ownerOnly || false}
**guildOnly:** ${command.canDM}`;
            };
        } else {
            helpString += `**List of commands you can perform in ${msg.guild.name || 'DMs'}**\n\n`;
            for (const group of groups) {
                let atleastOne = false;
                console.log(group);
                commands.each(command => {
                    if (this.canRunCommand(msg) && command.group == group) {
                        if (!atleastOne) { helpString += `**__${group}__**\n`; atleastOne = true; };
                        helpString += `**${command.name}:** ${command.description}\n`;
                    };
                });
                if (atleastOne) { helpString += '\n'; };
            };
        };
        msg.channel.send(helpString);
    };
};

module.exports = HelpCommand;