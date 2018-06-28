import { Conversion } from "./conversion";

export class ConversionPair {
    id: string;
    key1: Conversion;
    key2: Conversion;
    useDate: Date;

    constructor(id: string, key1: Conversion, key2: Conversion) {
        this.id = id;
        this.key1 = key1;
        this.key2 = key2;
        this.useDate = new Date();
    }

    static create(netObj: Object) {
        const netObjKeys = Object.keys(netObj).sort();
        const convArray = netObjKeys.map(key => new Conversion(key, netObj[key]));
        return new ConversionPair(convArray[0].id, convArray[0], convArray[1]);
    }

    static convertAmount(pair: ConversionPair, amount: number, key: string): number {
        const convRate = (key === pair.key1.id) ? pair.key1.rate : pair.key2.rate;
        return amount * convRate;
    }
}