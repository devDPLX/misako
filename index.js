const { Client, Command } = require('./misako');
const misako = new Client();
misako.register(__dirname + '/commands');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Enter your command:\n', msg => {
    misako.handleMessage(msg);
    readline.close();
});