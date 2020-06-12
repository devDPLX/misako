var Discord = require('discord.js');
//var misako = new Discord.Client();
var col = new Discord.Collection();

function parseMessage(msg) {
    if (!msg.charAt(0) == '?') { return; };
    let args = msg.slice(1).split(' ');
    let command = args.shift();
    //--
    col.set('name',command);
    col.set('args',args);
}

function getCommandsIn(directory) {
    if (typeof directory !== 'string') { throw new TypeError('Directory must be a string.'); };
    const Command = require('./Commands/base');
    const group = require('require-all')(directory);
    let commands = [];
    console.log(group);
};

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Who are you?\n', name => {
    getCommandsIn(__dirname + '/Commands');
    readline.close();
});