import { Currency } from "./currency";

export class CurrenciesOperations {
    static indexOf(currencies: Currency[], id: string): number {
        for (let i = 0; i < currencies.length; i++) {
            if (currencies[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    static exists(currencies: Currency[], id: string): boolean {
        return this.indexOf(currencies, id) !== -1;
    }

    static compareTo(curr_a: Currency, curr_b: Currency): number {
        if (curr_a.id > curr_b.id) {
            return 1;
        } else if (curr_a.id < curr_b.id) {
            return -1;
        } 

        if (curr_a.currencyName > curr_b.currencyName) {
            return 1;
        } else if (curr_a.currencyName < curr_b.currencyName) {
            return -1;
        } 

        if (!curr_a.currencySymbol && !curr_b.currencySymbol) {
            return 0;
        } else if (curr_a.currencySymbol && !curr_b.currencySymbol) {
            return 1;
        } else if (!curr_a.currencySymbol && curr_b.currencySymbol) {
            return -1;
        } 

        if (curr_a.currencySymbol > curr_b.currencySymbol) {
            return 1;
        } else if (curr_a.currencySymbol < curr_b.currencySymbol) {
            return -1;
        }

        return 0;
    }

    /**
     * returns A - B that are elements in A that are not in B
     * 
     * @param curr_a 
     * @param curr_b 
     */
    static minus(curr_a: Currency[], curr_b: Currency[]): Currency[] {
        const a_b: Currency[] = curr_a.filter(currency => !this.exists(curr_b, currency.id));
        return a_b;
    }

    /**
     * returns A intersect B that are elements in A and in B but 
     * the elements have the same id and not the same properties
     * 
     * @param curr_a 
     * @param curr_b 
     */
    static intersect(curr_a: Currency[], curr_b: Currency[]): Currency[] {
        const a_b: Currency[] = curr_a.filter(currency => { 
            const idx = this.indexOf(curr_b, currency.id);
            if (idx == -1) {
                return false;
            }
            return this.compareTo(currency, curr_b[idx]) != 0;
        });
        return a_b;
    }
}