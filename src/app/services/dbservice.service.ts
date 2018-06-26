import { Injectable } from '@angular/core';
import idb, { DB } from 'idb';
import { Currency } from '../shared/currency';
import { CurrenciesOperations } from '../shared/currencies_operations';
import { Conversion } from '../shared/conversion';

const IDB_DB_NAME: string = 'currency_converter';
const IDB_CURRENCIES_TABLE: string = 'currencies';
const IDB_CONVERSIONS_TABLE: string = 'conversions';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  _dbPromise: Promise<DB> = null;
  _currencyAPI: CurrencyDbAPI;
  _conversionsAPI: ConversionsDbAPI;

  constructor() { }

  getInstance(): DbService {
    if (!this._dbPromise) {
      this._dbPromise = this.openDatabase();
      this._currencyAPI = new CurrencyDbAPI(this._dbPromise);
      this._conversionsAPI = new ConversionsDbAPI(this._dbPromise);
    }
    return this;
  }

  getCurrencyAPI():CurrencyDbAPI {
    return this.getInstance()._currencyAPI;
  }

  getConversionAPI(): ConversionsDbAPI {
    return this.getInstance()._conversionsAPI;
  }

  openDatabase(): Promise<DB> {
    if (!navigator.serviceWorker) {
      return null;
    }

    return idb.open(IDB_DB_NAME, 2, (upgradeDb) => {
      switch (upgradeDb.oldVersion) {
        case 0:
          let store = upgradeDb.createObjectStore(IDB_CURRENCIES_TABLE, { keyPath: 'id' });
          store.createIndex('by-currencyName', 'currencyName');
        case 1:
          let store2 = upgradeDb.createObjectStore(IDB_CONVERSIONS_TABLE, { keyPath: 'id' });
      }
    });
  }
}


/******************************************************************************
 ****************************************************************************** 
 * This class contains all the possible operations that can be made to currencies
 ****************************************************************************** 
 ******************************************************************************/
export class CurrencyDbAPI {
  constructor(public dbPromise: Promise<DB>) {
  }

  /**
   * Fetch all the currencies
   */
  fetchAll(): Promise<Currency[]> {
    return this.dbPromise.then(db => {
      if (!db) {
        return Promise.resolve([]);
      }

      return db.transaction(IDB_CURRENCIES_TABLE)
        .objectStore(IDB_CURRENCIES_TABLE)
        .getAll();
    });
  }

  /**
   * Fetch one currency by its id
   * @param id 
   */
  fetchById(id: string): Promise<Currency> {
    return this.dbPromise.then(db => {
      if (!db) {
        return Promise.resolve(null);
      }

      return db.transaction(IDB_CURRENCIES_TABLE)
        .objectStore(IDB_CURRENCIES_TABLE)
        .get(id);
    });
  }

  /**
   * Insert one currency.
   * @param currency 
   */
  insertCurrency(currency: Currency) {
    this.dbPromise.then(db => {
      if (!db) return;

      var tx = db.transaction(IDB_CURRENCIES_TABLE, 'readwrite');
      var store = tx.objectStore(IDB_CURRENCIES_TABLE);

      store.put(currency);
    });
  }

  /**
   * Insert an array of currencies.
   * @param currencies 
   */
  insertMany(currencies: Currency[]) {
    console.log('Insert ', currencies);
    
    if (!currencies || currencies.length === 0) {
      return;
    }

    this.dbPromise.then(db => {
      if (!db) return;

      var tx = db.transaction(IDB_CURRENCIES_TABLE, 'readwrite');
      var store = tx.objectStore(IDB_CURRENCIES_TABLE);

      currencies.forEach(currency => store.put(currency));
    });
  }

  /**
   * Update a list of currencies.
   * @param currencies 
   */
  updateMany(currencies: Currency[]) {
    console.log('Update ', currencies);

    if (!currencies || currencies.length === 0) {
      return;
    }

    this.dbPromise.then(db => {
      if (!db) return;

      return db.transaction(IDB_CURRENCIES_TABLE, 'readwrite')
        .objectStore(IDB_CURRENCIES_TABLE)
        .openCursor();
    })
    .then(function itCur(cursor) {
      if (!cursor) return;
      const curValue = cursor.value;
      const idx = CurrenciesOperations.indexOf(currencies, curValue);
      if (idx !== -1) {
        cursor.update(currencies[idx]);
      }
      return cursor.continue().then(itCur);
    });
  }

  /**
   * Delete a list of currencies.
   * @param currencies 
   */
  deleteMany(currencies: Currency[]) {
    console.log('Delete ', currencies);

    if (!currencies || currencies.length === 0) {
      return;
    }

    this.dbPromise.then(db => {
      if (!db) return;

      return db.transaction(IDB_CURRENCIES_TABLE, 'readwrite')
        .objectStore(IDB_CURRENCIES_TABLE)
        .openCursor();
    })
    .then(function itCur(cursor) {
      if (!cursor) return;
      const curValue = cursor.value;
      const idx = CurrenciesOperations.indexOf(currencies, curValue);
      if (idx !== -1) {
        cursor.delete();
      }
      return cursor.continue().then(itCur);
    });
  }
}

export class ConversionsDbAPI {
  constructor(public dbPromise: Promise<DB>) { }
  
  fetchById(id: string): Promise<Conversion> {
    return this.dbPromise.then(db => {
      if (!db) {
        return Promise.resolve(null);
      }

      return db.transaction(IDB_CONVERSIONS_TABLE)
        .objectStore(IDB_CONVERSIONS_TABLE)
        .get(id);
    });
  }

  insert(conversion: Conversion) {
    this.dbPromise.then(db => {
      if (!db) return;

      var tx = db.transaction(IDB_CONVERSIONS_TABLE, 'readwrite');
      var store = tx.objectStore(IDB_CONVERSIONS_TABLE);

      store.put(conversion);
    });
  }
}