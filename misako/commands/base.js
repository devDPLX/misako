class BaseCommand {
    constructor(misako, info) {
        this.misako = misako;
        this.name = info.name;
        this.aliases = info.aliases || [];
        this.description = info.description;
        this.group = info.group;
        this.nsfw = info.nsfw || false;
        this.throttle = info.throttle || 0;
        this.examples = info.examples;
        this.ownerOnly =  info.ownerOnly || false;
        this.canDM = info.canDM || false;
        this.path;
        // temporary
        this.args = info.args || [];
    };

    async run(misako, msg, args) {
        console.log(`Run command for ${this.constructor.name} doesn't exist.`);
    };

    canRunCommand(msg) {
        let user = msg.author;
        if (!this.canDM && msg.channel.type !== 'text')
            return [false,'This command can only be used in guilds.'];
        let member = msg.member;
        if (this.ownerOnly && !this.misako.owners.includes(user.id))
            return [false,'This command is owner-only.'];
        if (this.permissions && this.permissions.length > 0) {
            for (const perm of this.permissions) {
                if (!member.permissions.has(perm)) {
                    return [false,'You don\'t have valid permissions for this command.'];
                };
            };
        };
        return [true];
    };
};

module.exports = BaseCommand;