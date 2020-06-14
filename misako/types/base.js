class Type {
    constructor(misako) {
        this.misako = misako;
    };

    parse(value) {
        throw new Error(`Type ${this.name} doesn't have a parse function.`);
    };
};

module.exports = Type;