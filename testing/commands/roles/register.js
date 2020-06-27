const { Command } = require('../../../src');

class RegisterCommand extends Command {
  constructor (misako) {
    super(misako, {
      name: 'register',
      aliases: ['registerrole'],
      description: 'Registers a role and emoji for general use.',
      group: 'roles',
      nsfw: false,
      throttle: 5,
      examples: ['register :Valorant: Valorant'],
      ownerOnly: false,
      canDM: true,
      args: [
        {
          key: 'emote',
          type: 'emoji',
          required: true,
          repeatable: false
        },
        {
          key: 'role',
          type: 'role',
          required: true,
          repeatable: true
        }
      ]
    });
  }
  
  async run(misako, msg, args) {
    let emoji = args[0];
    let role = args[1];
    if (!emoji) { throw new Error('There was an error fetching the emote. My apologies.')}
    if (!role) { throw new Error('There was an error fetching the role. My apologies.')}
    //--
    let registeredRoles = misako.registeredRoles;
    if (registeredRoles.get(role.id)) {
      msg.channel.sendEmbed('This role is already registered.');
      return;
    }
    if (registeredRoles.find(_role => _role.emoji == emoji.id)) {
      msg.channel.sendEmbed('This emote is already registered.');
      return;
    }
    registeredRoles.set(role.id,{
      guild: msg.guild.id,
      emoji: emoji.id
    });
    msg.channel.sendEmbed(`Role **${role.name}** has been registered to the emote ${emoji}`);
    let roleMsg = misako.roleMsgs.find(_msg => _msg.guild.id == msg.guild.id);
    if (roleMsg) {
      roleMsg.react(emoji).catch(error => {
        console.log(error);
      });
    }
  }
}

module.exports = RegisterCommand;