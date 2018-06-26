export class Conversion {
    id: string;
    srcCurrency: string;
    destCurrency: string;
    rate: number;
    useDate: Date;

    constructor(id: string = 'XXX_XXX', rate: number = 1.0) {
        this.id = id;
        [this.srcCurrency, this.destCurrency] = id.split('_');
        this.rate = rate;
        this.useDate = new Date();
    }
}