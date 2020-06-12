var Discord = require('discord.js');
const path = require('path');
const Command = require('./commands/base');
const defaultPrefix = '?';

class Misako extends Discord.Client {
    constructor(options = {}) {
        super(options);
        if (!options.prefix) { this.prefix = defaultPrefix; };
        //--
        this.commands = new Discord.Collection();
        this.commandObjects = new Discord.Collection();
        this.types = new Discord.Collection();
        this._prefix = null;
    };

    get prefix() { return this._prefix; };

    set prefix(newPrefix) {
        if (!this.validate(newPrefix,'string')) { throw new TypeError('newPrefix must be a string.'); };
        if (newPrefix.length > 1) { throw new RangeError('newPrefix can only be one character.'); };
        this._prefix = newPrefix;
    }

    /*/--

        Validate Functions

    --/*/

    validate(value, type) {
        if (type == 'array') {
            return Array.isArray(value);
        }
        return typeof value == type;
    };

    /*/--

        Command Functions

    --/*/

    fetchCommand(command) {
        if (this.validate(command,'function')) { command = command.name; };
        if (!this.validate(command,'string')) {
            throw new TypeError('Command must be a function or string.'); };
        return this.commandObjects.find(_command => _command.name == command) ||
        this.commandObjects.find(_command => _command.aliases.includes(command));
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
        this.commands.set(_command.name,command);
        this.commandObjects.set(_command.name,_command);
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
        if (!this.validate(folder,'array')) { return; };
        let types = [];
        for (const type of folder) {
            if (typeof type == 'function' && type.name !== 'base') {
                types.push(type);
            };
        };
        this.types = types;
        return types;
    };

    /*/--

        Argument Functions

    --/*/

    updateArguments(command, msg, args) {
        let newArgs = [];
        for (const arg of args) {
            let type = this.types.find(_type => _type.name == arg.type);
            if (!type) { throw new Error('Invalid arg type.'); };
            try {
                let _type = new type(this, msg, {
                    
                })
            } catch (error) {

            };
        };
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
        if (!msg.charAt(0) == this.prefix) { return; };
        let parsed = this.parseMessage(msg);
        let command = parsed[0];
        let args = parsed[1];
        //--
        if (!this.fetchCommand(command)) { console.log(`Command ${command} doesn't exist.`); return; };
        let Command = this.commands[command];
        let _command = new Command(this, msg, args);
        _command = updateArguments(_command, msg, args);
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