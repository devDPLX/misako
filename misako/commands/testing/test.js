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
        let reactMsg = await msg.reply('Pick an emoji.');
        let guildEmojis = msg.guild.emojis.cache;
        let reactEmojis = [];
        guildEmojis.each(emoji => { reactEmojis.push(emoji.identifier); });
        for (const reactEmoji of reactEmojis) {
            await reactMsg.react(reactEmoji);
        };
        misako.promptReaction(msg.author,msg.channel,reactMsg,true)
        .then(reaction => {
            if (reactEmojis.includes(reaction.emoji.identifier)) {
                msg.reply(`You reacted with ${reaction.emoji.name}`);
            } else {
                msg.reply(`That isn't a valid emoji. Try again dumbass.`);
            };
            reaction.users.remove(msg.author);
        })
        .catch(error => {
            if (error == 'time') {
                msg.reply('You didn\'t react in the time alloted.');
            };
        });
    };
};

module.exports = TestCommand;