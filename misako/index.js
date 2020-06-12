var Discord = require('discord.js');
const Command = require('./Commands/base');
const defaultPrefix = '?';

class Misako extends Discord.Client {
    constructor(options = {}) {
        super(options);
        if (!options.prefix) { this.prefix = defaultPrefix; };
        //--
        this.commands = {};
        this._prefix = null;
    };

    get prefix() { return this._prefix; };

    set prefix(newPrefix) {
        console.log(newPrefix);
        if (!this.validate(newPrefix,'string')) { throw new TypeError('newPrefix must be a string.'); };
        if (newPrefix.length > 1) { throw new RangeError('newPrefix can only be one character.'); };
        this._prefix = newPrefix;
    }

    /*/--

        Testing Functions

    --/*/

    parseMessage(msg) {
        if (!msg.charAt(0) == this.prefix) { return; };
        let args = msg.slice(1).split(' ');
        let command = args.shift();
        //--
        
    };

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
        
    };

    registerCommand(command) {
        if (!this.validate(command,'function')) { throw new TypeError('Command must be a function.'); };
        command = new command(this);
        if (!(command instanceof Command)) { throw new Error('Tried to register invalid command.'); };

    };

    registerCommands(commands) {
        if (!this.validate(commands,'array')) { throw new TypeError('Commands must be an Array.'); };
        const Command = require('./Commands/base');
        for (let command of commands) {
            if (this.validate(command,'function') || command instanceof Command) {
                this.registerCommand(command);
            } else {
                console.log(`Tried to register invalid command.`);
            };
        };
    };

    getCommandsIn(directory) {
        if (!this.validate(directory,'string')) { throw new TypeError('Directory must be a string.'); };
        const folder = require('require-all')(directory);
        let commands = [];
        for (const group of Object.values(folder)) {
            for (const command of Object.values(group)) {
                if (typeof Command == 'function' || command instanceof Command) {
                    commands.push(command);
                } else {
                    console.log(`Tried to push invalid command.`);
                };
            };
        };
        return commands;
    };
};

module.exports = Misako;