const Command = require('../base');

class TestCommand extends Command {
    constructor(Client) {
        super(Client, {
            name: 'test',
            aliases: [],
            description: 'Just a test command.',
            group: 'testing',
            nsfw: false,
            throttle: 0,
            examples: ['test poop lol'],
            ownerOnly: false,
            canDM: false,
            args: [
                {
                    key: 'extra',
                    type: 'string',
                    prompt: 'What are the strings?',
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

module.exports = TestCommand;