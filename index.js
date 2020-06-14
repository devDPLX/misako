const { Client, Command } = require('./misako');
const { betaToken } = require('./config');
const misako = new Client();
misako.register(__dirname + '/commands');

misako.on('ready', e => {
    console.log('connected');
});

misako.on('message', msg => {
    misako.handleMessage(msg);
}); 

misako.login(betaToken);