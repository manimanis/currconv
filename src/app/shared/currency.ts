export class Currency {
    id: string;
    currencySymbol?: string;
    currencyName: string;

    constructor(id, name, symbol = null) {
        this.id = id;
        this.currencyName = name;
        this.currencySymbol = symbol;
    }
}