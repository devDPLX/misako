const Command = require('../base');

class TestCommand extends Command {
    constructor(Client) {
        super(Client, {
            name: 'test',
            aliases: ['prompttest'],
            description: 'Just a test command.',
            group: 'testing',
            nsfw: false,
            throttle: 5,
            examples: ['test #general'],
            ownerOnly: false,
            canDM: false,
            args: [
              {
                  key: 'channel-name',
                  type: 'channel',
                  required: true,
                  repeatable: false
              }
            ]
        });

    };

    /*async run(misako, msg) {
        let channel = msg.channel;
        let author = msg.author;
        await msg.delete().catch(error => { console.log(error); });
        let reactMsg = await channel.send(`${author.name}, Pick an emoji.`);
        let guildEmojis = channel.guild.emojis.cache;
        let reactEmojis = [];
        guildEmojis.each(emoji => { reactEmojis.push(emoji.identifier); });
        for (const reactEmoji of reactEmojis) {
            await reactMsg.react(reactEmoji);
        };
        misako.promptReaction(author,channel,reactMsg,true)
        .then(reaction => {
            if (reactEmojis.includes(reaction.emoji.identifier)) {
                channel.send(`${author.name}, You reacted with ${reaction.emoji.name}`);
                reactMsg.delete().catch(error => {
                  console.log(error);
                });
            } else {
                channel.send(`That isn't a valid emoji.`);
            };
            reaction.users.remove(author);
        })
        .catch(error => {
            if (error == 'time') {
                channel.send('You didn\'t react in the time alloted.');
            };
        });
    };*/

    async run(misako, msg, arg) {
      msg.reply(arg.lastMessage);
    };
};

module.exports = TestCommand;