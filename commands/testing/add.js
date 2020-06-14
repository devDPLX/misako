const { Command } = require(`${process.cwd()}/misako`);

class AddCommand extends Command {
    constructor(Client) {
        super(Client, {
            name: 'add',
            aliases: [],
            description: 'Adds 2 or more numbers together.',
            group: 'testing',
            nsfw: false,
            throttle: 0,
            examples: ['add 1 2 3 4'],
            ownerOnly: false,
            canDM: true,
            args: [
                {
                    key: 'numbers',
                    type: 'number',
                    required: true,
                    repeatable: true
                }
            ]
        });

    };

    run(misako, msg, args) {
        for (const arg of args) {
            console.log(arg,typeof arg);
        }
    };
};

module.exports = AddCommand;