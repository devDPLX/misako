class BaseCommand {
    constructor(client, info) {
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

    async run(msg, misako, args) {
        console.log(`Run command for ${this.constructor.name} doesn't exist.`);
    };
};

module.exports = BaseCommand;