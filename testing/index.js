const { Client } = require('../../src');
const { botToken } = require('./config.json');
const Misako = new Client({
  prefix: '#'
})
//--
Misako.login(botToken);