import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyApiService {

  constructor(@Inject('API_URL') private apiUrl: string) { }

  getCurrencies(): Promise<any> {
    return fetch(this.apiUrl + '/currencies')
      .then(response => response.json());
  }

  convertCurrencies(fromCurrency: string, toCurrency: string): Promise<any> {
    const conversionKey = fromCurrency + '_' + toCurrency;
    return fetch(this.apiUrl + '/convert?q=' + conversionKey + '&compact=y')
      .then(response => response.json())
      .then(result => result[conversionKey]['val']);
  }
}
