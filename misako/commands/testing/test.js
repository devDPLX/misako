const Command = require('../base');

class TestCommand extends Command {
    constructor(Client) {
        super(Client, {
            name: 'test',
            aliases: ['prompttest'],
            description: 'Just a test command.',
            group: 'testing',
            nsfw: false,
            throttle: 0,
            examples: ['test poop lol'],
            ownerOnly: false,
            canDM: false,
            args: []
        });

    };

    async run(misako, msg) {
        console.log(await misako.promptReaction(msg.author, msg.channel))
    };
};

module.exports = TestCommand;