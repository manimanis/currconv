import { Injectable, Inject } from '@angular/core';
import idb, { DB } from 'idb';
import { Currency } from '../shared/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyApiService {

  _dbPromise: Promise<DB>;

  constructor(@Inject('API_URL') 
              private apiUrl: string,
              @Inject('IDX_DB_NAME') 
              private idxDbname: string,
              @Inject('IDX_DB_CURRENCIES_STORE')
              private idxDbCurrenciesStore) { 
    this._dbPromise = this.openDatabase();
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  openDatabase(): Promise<DB> {
    if (!navigator.serviceWorker) {
      return null;
    }

    return idb.open(this.idxDbname, 1, (upgradeDb) => {
      switch (upgradeDb.oldVersion) {
        case 0:
          let store = upgradeDb.createObjectStore(this.idxDbCurrenciesStore, { keyPath: 'id' });
          store.createIndex('by-currencyName', 'currencyName');
      }
    });
  }

  fetchCurrenciesFromDB() {
    return this._dbPromise.then(db => {
      if (!db) return;

      var tx = db.transaction(this.idxDbCurrenciesStore);
      var store = tx.objectStore(this.idxDbCurrenciesStore);
      return store.getAll();
    });
  }

  updateCurrencies(currencies: Currency[]) {
    this._dbPromise.then(db => {
      if (!db) return;

      var tx = db.transaction(this.idxDbCurrenciesStore, 'readwrite');
      var store = tx.objectStore(this.idxDbCurrenciesStore);

      currencies.forEach(currency => store.put(currency));
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getCurrencies(): Promise<Currency[]> {
    return this.fetchCurrenciesFromDB()
    .then(currencies => {
      const netFetch = fetch(this.apiUrl + '/currencies')
        .then(response => response.json())
        .then(currencies => {
          let sortedCurr: Currency[] = Object.values(currencies.results);
          sortedCurr.sort((a: Currency, b: Currency) => {
            if (a.id > b.id) return 1;
            if (a.id < b.id) return -1;
            return 0;
          });
          this.updateCurrencies(sortedCurr);
          return sortedCurr;
        });
        return Promise.resolve(currencies) || netFetch;
    });
  }

  convertCurrencies(fromCurrency: string, toCurrency: string): Promise<any> {
    const conversionKey = fromCurrency + '_' + toCurrency;
    return fetch(this.apiUrl + '/convert?q=' + conversionKey + '&compact=y')
      .then(response => response.json())
      .then(result => result[conversionKey]['val']);
  }
}
