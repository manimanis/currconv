import { Injectable, Inject } from '@angular/core';
import idb, { DB } from 'idb';
import { Currency } from '../shared/currency';
import { CurrenciesOperations } from '../shared/currencies_operations';
import { DbService } from './dbservice.service';
import { Conversion } from '../shared/conversion';

@Injectable({
  providedIn: 'root'
})
export class CurrencyApiService {

  _currencies: Currency[] = null;

  constructor(private _dbService: DbService,
              @Inject('API_URL') 
              private _apiUrl: string) { }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  fetchCurrenciesFromNet(): Promise<Currency[]> {
    console.log('Fetching currencies from network!');
    return fetch(this._apiUrl + '/currencies')
      .then(reponse => reponse.json())
      .then(data => {
        let currencies: Currency[] = Object.values(data.results);
        currencies.sort((a: Currency, b: Currency) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        return currencies;
      });
  }

  getCurrencies(): Promise<Currency[]> {
    const thisObj = this;
    if (this._currencies) {
      return Promise.resolve(this._currencies);
    }

    return this._dbService.getCurrencyAPI().fetchAll()
      .then(dbCurrencies => {
        console.log('DB fetch OK!');
        thisObj._currencies = dbCurrencies;
        return this.fetchCurrenciesFromNet()
          .then(netCurrencies => {
            console.log('Network fetch OK!');
            thisObj._currencies = netCurrencies;
            
            // Determine the new currencies
            // the deleted currencies
            // the modified currencies
            let newCurr = CurrenciesOperations.minus(netCurrencies, dbCurrencies);
            let delCurr = CurrenciesOperations.minus(dbCurrencies, netCurrencies);
            let modCurr = CurrenciesOperations.intersect(dbCurrencies, netCurrencies);
            
            thisObj._dbService.getCurrencyAPI().insertMany(newCurr);
            thisObj._dbService.getCurrencyAPI().deleteMany(delCurr);
            thisObj._dbService.getCurrencyAPI().updateMany(modCurr);

            return Promise.resolve(thisObj._currencies);
          });
      });
  }

  convertCurrencies(fromCurrency: string, toCurrency: string): Promise<any> {
    const thisObj = this;
    const conversionKeys: string[] = [fromCurrency + '_' + toCurrency, toCurrency + '_' + fromCurrency];
    return fetch(this._apiUrl + '/convert?q=' + conversionKeys.join(',') + '&compact=ultra')
      .then(response => response.json())
      .then(result => {
        const convArray = Object.keys(result).map(key => new Conversion(key, result[key]));
        convArray.forEach(conversion => {
          thisObj._dbService
            .getConversionAPI()
            .insert(conversion);
        });

        return Promise.resolve(convArray);
      });
  }
}
