const { Client, Command } = require('./misako');
const misako = new Client();

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Enter your command:\n', msg => {
    misako.register(__dirname + '/commands');
    misako.commands.each(command => {
        console.log(command.name);
    })
    readline.close();
});