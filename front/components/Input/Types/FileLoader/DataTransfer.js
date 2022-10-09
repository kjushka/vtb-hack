class DataTransfer {
    constructor() {
        this.items = new Set();
        this.files = this.items;
    }

    add(file) {
        this.items.add(file);
    }

    remove(file) {
        this.items.remove(file);
    }
}


module.exports = DataTransfer;