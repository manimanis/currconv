import { Injectable, Inject } from '@angular/core';
import idb, { DB } from 'idb';
import { Currency } from '../shared/currency';
import { CurrenciesOperations } from '../shared/currencies_operations';
import { DbService } from './dbservice.service';
import { Conversion } from '../shared/conversion';
import { promise } from 'protractor';
import { ConversionPair } from '../shared/conversion-pair';

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
    const thisObj = this;
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
      })
      .then(netCurrencies => {
        console.log('Network fetch OK!');
        // Determine the new currencies
        // the deleted currencies
        // the modified currencies
        let newCurr = CurrenciesOperations.minus(netCurrencies, thisObj._currencies);
        let delCurr = CurrenciesOperations.minus(thisObj._currencies, netCurrencies);
        let modCurr = CurrenciesOperations.intersect(thisObj._currencies, netCurrencies);

        thisObj._currencies = netCurrencies;
        
        thisObj._dbService.getCurrencyAPI().insertMany(newCurr);
        thisObj._dbService.getCurrencyAPI().deleteMany(delCurr);
        thisObj._dbService.getCurrencyAPI().updateMany(modCurr);

        return Promise.resolve(netCurrencies);
      });
  }

  fetchCurrenciesFromDB(): Promise<Currency[]> {
    return  this._dbService.getCurrencyAPI().fetchAll()
      .then(dbCurrencies => {
        console.log('IDB fetch OK!');
        this._currencies = dbCurrencies;

        return Promise.resolve(dbCurrencies);
      });
  }

  convertCurrencies(fromCurrency: string, toCurrency: string): Promise<any> {
    const thisObj = this;
    const conversionKeys: string[] = [fromCurrency + '_' + toCurrency, toCurrency + '_' + fromCurrency].sort();
    const currencyKey: string = conversionKeys[0];
    const netFetch = fetch(this._apiUrl + '/convert?q=' + conversionKeys.join(',') + '&compact=ultra')
      .then(response => response.json())
      .then(result => {
        const convArray = ConversionPair.create(result);
        thisObj._dbService
          .getConversionAPI()
          .insert(convArray);
        return Promise.resolve(convArray);
      });
    
    return this._dbService
          .getConversionAPI()
          .fetchById(currencyKey)
          .then(value => {
            if (value) {
              return value;
            }
            return netFetch;
          }) || netFetch;
  }
}
