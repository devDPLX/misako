var Discord = require('discord.js');
const path = require('path');
const Command = require('./commands/base');
const defaultPrefix = '?';

class Misako extends Discord.Client {
    constructor(options = {}) {
        super(options);
        //--
        this.commands = new Discord.Collection();
        this.types = new Discord.Collection();
        this._prefix = null;
        if (!options.prefix) { this.prefix = defaultPrefix; };
    };

    get prefix() { return this._prefix; };

    set prefix(newPrefix) {
        if (!this.validate(newPrefix,'string')) { throw new TypeError('newPrefix must be a string.'); };
        if (newPrefix.length > 1) { throw new RangeError('newPrefix can only be one character.'); };
        this._prefix = newPrefix;
    }

    /*/--

        Utility Functions

    --/*/

    validate(value, type) {
        if (type == 'array') {
            return Array.isArray(value);
        }
        return typeof value == type;
    };

    /*/--

        Input Functions

    --/*/

    async prompt(user, channel) {
        let response = new Promise((resolve,reject) => {
            const filter = msg => msg.author.equals(user);
            channel.awaitMessages(filter,{
                max: 1,
                time: 60000,
                errors: ['time']
            }).then(col => {
                resolve(col.first());
            }).catch(col => {
                reject('time');
            });
        });
        return response;
    };

    async promptReaction(user, channel, msg) {
        if (!msg) { msg = `${user.toString()}, awaiting a reaction to this message.`; };
        if (this.validate(msg,'string')) { 
            msg = await channel.send(msg);
        };
        let response = new Promise((resolve,reject) => {
            const filter = (reaction, reactUser) => reactUser.equals(user);
            msg.awaitReactions(filter,{
                max: 1,
                time: 10000,
                errors: ['time']
            }).then(col => {
                response = col.first();
            }).catch(col => {
                reject('time');
            });
        });
        return response;
    }

    /*/--

        Command Functions

    --/*/

    fetchCommand(command) {
        if (this.validate(command,'function')) { command = command.name; };
        if (!this.validate(command,'string')) {
            throw new TypeError('Command must be a function or string.'); };
        return this.commands.find(_command => _command.name == command) ||
        this.commands.find(_command => _command.aliases.includes(command));
    };

    fetchCommandPath(command) {
        return path.join(__dirname,'/commands',command.group,command.name);
    };

    registerCommand(command) {
        if (!this.validate(command,'function')) { throw new TypeError('Command must be a function.'); };
        let _command = new command(this);
        if (!(_command instanceof Command)) { throw new Error('Tried to register invalid command.'); };
        if (this.fetchCommand(_command.name)) { throw new Error(`Command ${_command.name} is already registered.`); };
        for (const alias of _command.aliases) {
            if (this.fetchCommand(alias)) { throw new Error(`Alias ${alias} is already registered.`); };
        };
        //--
        _command.path = this.fetchCommandPath(_command);
        if (_command.args) {
            let args = _command.args;
            for (const arg of args) {
                let type = this.types.find(_type => _type.name == arg.type);
                if (!type) {
                    throw new Error(`Argument ${arg.key} doesn't have it's type registered.`);
                };
                arg.parse = type.parse;
            };
        };
        this.commands.set(_command.name,_command);
    };

    registerCommands(commands) {
        if (!this.validate(commands,'array')) { throw new TypeError('Commands must be an Array.'); };
        for (let command of commands) {
            if (this.validate(command,'function') || command instanceof Command) {
                this.registerCommand(command);
            } else {
                console.log(`Tried to register invalid command.`);
            };
        };
    };

    fetchCommandsIn(directory) {
        if (!this.validate(directory,'string')) { throw new TypeError('Directory must be a string.'); };
        const folder = require('require-all')(directory);
        let commands = [];
        for (const group of Object.values(folder)) {
            for (const command of Object.values(group)) {
                if (typeof command == 'function' || command instanceof Command) {
                    commands.push(command);
                } else {
                    console.log(`Tried to push invalid command.`);
                };
            };
        };
        return commands;
    };

    /*/-- 

        Type Commands

    --/*/

    registerTypes() {
        const typePath = path.join(__dirname,'types');
        const folder = require('require-all')(typePath);
        if (!this.validate(folder,'object')) { return; };
        let types = [];
        for (const type of Object.values(folder)) {
            if (typeof type == 'function' && type.name !== 'Type') {
                let _type = new type(this);
                types.push(_type.name,_type);
            };
        };
        this.types = types;
        return types;
    };

    /*/--

        Message Functions

    --/*/

    parseMessage(msg) {
        let args = msg.slice(1).trim().split(' ');
        let command = args.shift();
        //--
        return [command,args];
    };

    handleMessage(msg) {
        if (msg.content.charAt(0) !== this.prefix) { return; };
        if (msg.author.equals(this.user)) { return; };
        let parsed = this.parseMessage(msg.content);
        let command = parsed[0];
        let args = parsed[1];
        //--
        let _command = this.fetchCommand(command) 
        if (!_command) { console.log(`Command ${command} doesn't exist.`); return; };
        var parsedArgs = [];
        if (_command.args && _command.args.length > 0) {
            for (const index in _command.args) {
                let arg = _command.args[index];
                if (arg.required && args.length == 0) {
                    console.log('not enough arguments given.');
                    return;
                };
                var value = args[0];
                if (arg.repeatable) {
                    let valueArray = [];
                    for (var _value of args) {
                        let parsedValue = arg.parse(_value);
                        if (!parsedValue) {
                            console.log(`${_value} should have been a ${arg.type}.`)
                            return;
                        };
                        valueArray.push(parsedValue);
                    };
                    value = valueArray;
                } else {
                    let parsedValue = arg.parse(value);
                    if (!parsedValue) {
                        console.log(`${_value} should have been a ${arg.type}.`)
                        return;
                    };
                    value = parsedValue;
                    args.shift();
                }
                parsedArgs.push(value);
            };
            if (_command.args.length == 1) { parsedArgs = parsedArgs[0]; };
            _command.run(this, msg, parsedArgs);
        } else {
            _command.run(this, msg);
        };
    };

    /*/--

        Main Functions

    --/*/

    register(path) {
        this.registerTypes();
        this.registerCommands(this.fetchCommandsIn(`${__dirname}/commands`));
        this.registerCommands(this.fetchCommandsIn(path));
    };
};

module.exports = Misako;