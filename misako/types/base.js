class Type {
    constructor(misako, msg, options) {
        validateOptions(options);
        this.misako = misako;
        this.name = options.name;
        this._value = options.value || undefined;
        this.defaultValue;
    };

    get value() {
        throw new Error(`Type ${this.name} doesn't have a getter function.`);
    };

    set value(newValue) {
        throw new Error(`Type ${this.name} doesn't have a setter function.`);
    };

    static validateOptions(options) {
        if (typeof options.name !== 'string') {
            throw new TypeError('Type name must be a string.'); };
    };
};

module.exports = Type;