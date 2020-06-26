class TypeBase {
    constructor(misako) {
        this.misako = misako;
    }

    parse(msg, value) {
        throw new Error(`Type ${this.name} doesn't have a parse function.`);
    }
}

module.exports = TypeBase;