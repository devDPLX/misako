const { Client, Command } = require('./misako');
const { betaToken } = require('./config');
const misako = new Client({
    owners: ['153277301793095682'],
    commandPath: `${__dirname}/commands`
});

misako.on('ready', e => {
    console.log('connected');
});

misako.on('message', msg => {
    misako.handleMessage(msg);
}); 

misako.login(betaToken);