const misako = require('./misako');
const client = new misako();

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Who are you?\n', name => {
    let commands = client.getCommandsIn(__dirname + '/misako/Commands');
    client.registerCommands(commands);
    console.log(commands);
    readline.close();
});