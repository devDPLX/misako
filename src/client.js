var Discord = require('discord.js');
const path = require('path');
const Enmap = require('enmap');
const Command = require('./commands/base');
const defaultPrefix = '?';

class Misako extends Discord.Client {
  constructor(options = {}) {
    super(options);
    //--
    this.commands = new Discord.Collection();
    this.types = new Discord.Collection();
    this.throttles = new Discord.Collection();
    this.groups = [];
    this._prefix = null;
    this.owners = options.owners || [];
    this.prefix = options.prefix || defaultPrefix;
    //--
    this.settings = new Enmap({
      name: 'settings',
      //fetchAll: false,
      autoFetch: true,
      cloneLevel: 'deep'
    });

    this.defaultSettings = {
      prefix: this.prefix
    };

    this.on('guildDelete', guild => {
      this.settings.delete(guild.id)
    });
    this.on('guildCreate', guild => {
      this.settings.set(guild.id, this.defaultSettings)
    });
    this.on('message', msg => this.handleMessage(msg));

    //--
    this.register(options.commandPath);
  }

  get prefix() {
    return this._prefix;
  }

  set prefix(newPrefix) {
    if (!this.validate(newPrefix, 'string')) {
      throw new TypeError('newPrefix must be a string.');
    }
    if (newPrefix.length > 1) {
      throw new RangeError('newPrefix can only be one character.');
    }
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
  }

  /*/--

      Input Functions

  --/*/

  async prompt(user, channel, typeName = undefined) {
    let response = new Promise((resolve, reject) => {
      const filter = msg => {
        if (msg.author.equals(user)) {
          if (typeName) {
            let type = this.types.find(_type => _type.name == typeName);
            if (!type) {
              throw new Error('Type by that name doesn\'t exist.');
            }
            let parseArg = type.parse(msg, msg.content);
            if (parseArg !== undefined) {
              return true;
            }
            channel.sendEmbed(`Sorry, that wasn't a valid entry. The expected type is a **${type.name}.**`);
            return false;
          } else {
            return true;
          }
        }
        return false
      };
      channel.awaitMessages(filter, {
        max: 1,
        time: 60000,
        errors: ['time']
      }).then(col => {
        resolve(col.first());
      }).catch(() => {
        reject('time');
      });
    });
    return response;
  }

  async promptReaction(user, channel, msg, useGivenReactions = false) {
    if (!msg) {
      msg = `${user.toString()}, awaiting a reaction to this message.`;
    }
    if (this.validate(msg, 'string')) {
      msg = await channel.sendEmbed(msg);
    }
    let response = new Promise((resolve, reject) => {
      const filter = (reaction, reactUser) => {
        return (!useGivenReactions && reactUser.equals(user)) || (
          useGivenReactions &&
          reaction.users.cache.find(reactUser => reactUser.bot) &&
          reaction.count > 1
        )
      };
      msg.awaitReactions(filter, {
        max: 1,
        time: 30000,
        errors: ['time']
      }).then(col => {
        resolve(col.first());
      }).catch(() => {
        reject('time');
      });
    });
    return response;
  }

  /*/--

      Command Functions

  --/*/

  fetchCommand(command) {
    if (this.validate(command, 'function')) {
      command = command.name;
    }
    if (!this.validate(command, 'string')) {
      throw new TypeError('Command must be a function or string.');
    }
    return this.commands.find(_command => _command.name == command) ||
      this.commands.find(_command => _command.aliases.includes(command));
  }

  fetchCommandPath(command) {
    return path.join(__dirname, '/commands', command.group, command.name);
  }

  registerCommand(command) {
    if (!this.validate(command, 'function')) {
      throw new TypeError('Command must be a function.');
    }
    let _command = new command(this);
    if (!(_command instanceof Command)) {
      throw new Error('Tried to register invalid command.');
    }
    if (this.fetchCommand(_command.name)) {
      throw new Error(`Command ${_command.name} is already registered.`);
    }
    for (const alias of _command.aliases) {
      if (this.fetchCommand(alias)) {
        throw new Error(`Alias ${alias} is already registered.`);
      }
    }
    //--
    _command.path = this.fetchCommandPath(_command);
    if (_command.args) {
      let args = _command.args;
      for (const arg of args) {
        let type = this.types.find(_type => _type.name == arg.type);
        if (!type) {
          throw new Error(`Argument ${arg.key} doesn't have it's type registered.`);
        }
        arg.parse = type.parse;
      }
    }
    if (!this.groups.includes(_command.group)) this.groups.push(_command.group);
    this.throttles.set(_command.name, new Discord.Collection());
    this.commands.set(_command.name, _command);
  }

  registerCommands(commands) {
    if (!this.validate(commands, 'array')) {
      throw new TypeError('Commands must be an Array.');
    }
    for (let command of commands) {
      if (this.validate(command, 'function') || command instanceof Command) {
        this.registerCommand(command);
      } else {
        console.log(`Tried to register invalid command.`);
      }
    }
  }

  fetchCommandsIn(directory) {
    if (!this.validate(directory, 'string')) {
      throw new TypeError('Directory must be a string.');
    }
    const folder = require('require-all')(directory);
    let commands = [];
    for (const group of Object.values(folder)) {
      for (const command of Object.values(group)) {
        if (typeof command == 'function' || command instanceof Command) {
          commands.push(command);
        } else {
          console.log(`Tried to push invalid command.`);
        }
      }
    }
    return commands;
  }

  /*/-- 

      Type Commands

  --/*/

  registerTypes() {
    const typePath = path.join(__dirname, 'types');
    const folder = require('require-all')(typePath);
    if (!this.validate(folder, 'object')) {
      return;
    }
    let types = [];
    for (const type of Object.values(folder)) {
      if (typeof type == 'function' && type.name !== 'TypeBase') {
        let _type = new type(this);
        types.push(_type.name, _type);
      }
    }
    this.types = types;
    return types;
  }

  /*/--

      Message Functions

  --/*/

  parseMessage(msg) {
    let args = msg.slice(1).trim().split(' ');
    let command = args.shift();
    //--
    return [command, args];
  }

  handleMessage(msg) {
    if (msg.author.bot) return;
    if (msg.author.equals(this.user)) {
      return;
    }
    if (msg.channel.type == 'dm' && !msg.content.startsWith(this.prefix)) {
      return;
    }
    if (msg.channel.type == 'text') {
      this.settings.ensure(msg.guild.id, this.defaultSettings);
      if (!msg.content.startsWith(this.settings.get(msg.guild.id, 'prefix'))) {
        return;
      }
    }
    let parsed = this.parseMessage(msg.content);
    let command = parsed[0];
    let args = parsed[1];
    let channel = msg.channel;
    //--
    let _command = this.fetchCommand(command)
    if (!_command) {
      channel.sendEmbed(`Sorry, that command doesn't exist. Try using **${this.prefix}help** for a list of commands I can perform for you.`);
      return;
    }
    //--
    let isValid = _command.canRunCommand(msg);
    if (isValid[0] == false) {
      msg.channel.sendEmbed(isValid[1]);
      return;
    }
    //--
    let timestamps = this.throttles.get(_command.name);
    let userStamp = timestamps.get(msg.author.id);
    let time = new Date();
    if (userStamp) {
      const expirationTime = userStamp.getTime() + _command.throttle;
      if (time > expirationTime) {
        // i dont know what the fuck this is but it works
        const timeLeft = -(-_command.throttle - ((expirationTime - time) / 1000));
        channel.sendEmbed(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing **${_command.name}**.`);
        return;
      }
    }
    //--
    var parsedArgs = {};
    if (_command.args && _command.args.length > 0) {
      for (const index in _command.args) {
        let arg = _command.args[index];
        if (arg.required && args.length == 0) {
          channel.sendEmbed(`You did not provide enough arguments for this command. Please try your command again or use **${this.prefix}help ${_command.name}** for more detailed help with this command.`);
          return;
        }
        var value = args[0];
        if (value == undefined && !arg.required) {
          //lol
        } else if (arg.repeatable) {
          let toParse = args.join(' ');
          let parsedValue = arg.parse(msg, toParse);
          if (!parsedValue) {
            channel.sendEmbed(`Argument at position **${index}** should have been a(n) ${arg.type}. Please try your command again or use **${this.prefix}help ${_command.name}** for more detailed help with this command.`);
            return;
          }
          value = parsedValue;
        } else {
          let parsedValue = arg.parse(msg, value);
          if (!parsedValue) {
            channel.sendEmbed(`Argument at position **${index}** should have been a(n) ${arg.type}. Please try your command again or use **${this.prefix}help ${_command.name}** for more detailed help with this command.`);
            return;
          }
          value = parsedValue;
          args.shift();
        }
        Object.defineProperty(parsedArgs, arg.key, {
          value: value,
          enumerable: true
        })
      }
      /* if (_command.args.length == 1) {
        parsedArgs = parsedArgs[0];
      } */
      _command.run(this, msg, parsedArgs);
    } else {
      _command.run(this, msg);
    }
    timestamps.set(msg.author.id, time);
    setTimeout(() => timestamps.delete(msg.author.id), _command.throttle * 1000);
  }

  //--

  registerExtensions() {
    const extPath = path.join(__dirname, 'extensions');
    require('require-all')(extPath);
  }

  /*/--

      Main Functions

  --/*/

  register(path) {
    this.registerTypes();
    this.registerExtensions();
    this.registerCommands(this.fetchCommandsIn(`${__dirname}/commands`));
    if (path) {
      try {
        this.registerCommands(this.fetchCommandsIn(path));
      } catch(error) {
        console.log(error);
      }
    }
  }
}

module.exports = Misako;