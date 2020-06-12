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

    run(msg, misako, args) {
        console.log(args);
    };
};

module.exports = AddCommand;