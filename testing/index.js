const { Client } = require('../src');
const { botToken } = require('./config.json');
const Misako = new Client({
  prefix: '!',
  commandPath: `${__dirname}/commands`,
  owners: ['153277301793095682']
})
Misako.on('ready', () => {
  Misako.commands.each(command => {
    console.log(command.path);
  })
});
//--
Misako.login(botToken);