var Discord = require('discord.js');
//var misako = new Discord.Client();
var col = new Discord.Collection();
const test = require('require-all')(__dirname + '/Commands');

function parseMessage(msg) {
    if (!msg.charAt(0) == '?') { return; };
    let args = msg.slice(1).split(' ');
    let command = args.shift();
    //--
    col.set('name',command);
    col.set('args',args);
}

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Who are you?\n', name => {
    parseMessage(name);
    readline.close();
});