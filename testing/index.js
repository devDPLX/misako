const { Client } = require('../src');
const Enmap = require('enmap');
var misako = new Client({
  commandPath: `${__dirname}/commands`
});
//--
misako.on('ready', () => {
  let channels = misako.channels.cache;
  let registeredRoles = misako.registeredRoles;
  misako.roleMsgs = [];
  let roleAssignChannels = channels.filter(channel => channel.name == 'role-assign');
  if (!roleAssignChannels.size) {
    console.log('No role-assign channels found.');
    return;
  }
  roleAssignChannels.each(channel => {
    channel.messages.fetch({limit:5}).then(msgs => {
      msgs.each(msg => {
        msg.delete().catch(error => {
          console.log(error);
        });
      })
    });
    channel.sendEmbed('React to this message with one of the given emotes and you\'ll be given a role corresponding to that emote.').then( roleMsg => { 
      misako.roleMsgs.push(roleMsg);
      console.log('roleMsgs.length:',misako.roleMsgs.length);
      let filteredRoles = registeredRoles.filter(role => role.guild == roleMsg.guild.id);
      filteredRoles.every(role => {
        roleMsg.react(role.emoji).catch(error => {
          console.log(error);
        });
      });
    });
  });
  misako.on('messageReactionAdd', (reaction, user) => {
    if (user.equals(misako.user)) return;
    let msg = reaction.message;
    msg.reactions.cache.each(_reaction => {
      let reactUsers = _reaction.users;
      reactUsers.remove(user.id);
    });
    console.log('roleMsgs.length:',misako.roleMsgs.length);
    let roleMsg = misako.roleMsgs.find(_msg => _msg.equals(msg));
    if (!roleMsg) return;
    let roleID = registeredRoles.findKey(_role => _role.emoji == reaction.emoji.id);
    console.log(roleID);
    if (!roleID) return;
    let members = msg.guild.members;
    members.fetch(user).then(member => {
      let memberRoles = member.roles;
      let rolesCache = memberRoles.cache;
      if (rolesCache.find(_role => _role.id == roleID)) {
        memberRoles.remove(roleID).catch(error => {
          msg.channel.sendEmbed('There was an error removing this role.').then(_msg => {
            setTimeout(function() {_msg.delete(); }, 3000);
          });
          console.log(error);
        });
      } else {
        memberRoles.add(roleID).catch(error => {
          msg.channel.sendEmbed('There was an error giving you this role.').then(_msg => {
            setTimeout(function() {_msg.delete(); }, 3000);
          });
          console.log(error);
        });
      }
    }).catch(error => {
      msg.channel.sendEmbed('There was an error fetching the member.').then(_msg => {
        setTimeout(function() {_msg.delete(); }, 3000);
      });
      console.log(error);
    });
  });
});
misako.on('message', msg => misako.handleMessage(msg));
//--
misako.registeredRoles = new Enmap({
  name: 'registeredRoles',
  autoFetch: true
});

//--
misako.login('NDU3MzExMjY5MzU2MTc1MzYw.XvbB8g.wwKkrgKPrrTYcgZ2cgjyc1YfpSo');