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
        misako.prompt(msg.author, msg.channel)
        .then(msg => {
            msg.reply(`Response message ID: ${msg.id}`)
        })
        .catch(error => {
            if (error == 'time') {
                msg.reply('You didn\'t respond in time.');
            };
        });
    };
};

module.exports = TestCommand;