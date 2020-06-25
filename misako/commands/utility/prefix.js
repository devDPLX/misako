const Command = require('../base');

class PrefixCommand extends Command {
    constructor(Client) {
        super(Client, {
            name: 'prefix',
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
        
    };
};

module.exports = PrefixCommand;