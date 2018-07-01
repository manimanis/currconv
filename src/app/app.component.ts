import { Component, OnInit, ApplicationRef } from '@angular/core';
import { CurrencyApiService } from './services/currencyapi.service';
import { Currency } from './shared/currency';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Conversion } from './shared/conversion';
import { CurrenciesOperations } from './shared/currencies_operations';
import { ConversionPair } from './shared/conversion-pair';
import { DbService } from './services/dbservice.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currencies: Currency[];
  form: FormGroup;

  _sourceCurrency: Currency = null;
  _destCurrency: Currency = null;
  _conversionKey: string = '';
  _convWay: string = 'ab';
  _mostRecentList: ConversionPair[] = null;

  _loadingFailed: boolean = false;
  _conversionPair: ConversionPair = null;
  
  constructor(private currAPI: CurrencyApiService,
              private dbService: DbService,
              fb: FormBuilder) {
    this.form = fb.group({
      'amount': ['1', Validators.compose([Validators.pattern(/^\d+(\.\d*)?$/i)])],
      'result': ['', Validators.compose([Validators.pattern(/^\d+(\.\d*)?$/i)])]
    });
  }

  ngOnInit() {
    this.currAPI.fetchCurrenciesFromDB()
      .then(currencies => {
        console.log('Currencies fetched:', currencies);
        this.setCurrencies(currencies);
        this.currAPI.fetchCurrenciesFromNet()
          .then(currencies => {
            this.setCurrencies(currencies);
          });
      });
    this.refreshMostRecent();

    this._sourceCurrency = {currencyName: "Euro", currencySymbol: "€", id: "EUR"};
    this._destCurrency = {currencyName: "Tunisian Dinar", id: "TND"};
    this.refreshCurrencySelect();
  }

  refreshMostRecent() {
    this.dbService.getConversionAPI().fetchMostRecent()
      .then(pairs => this._mostRecentList = pairs);
  }

  refreshCurrencySelect() {
    this.selectCurrency([this._sourceCurrency, this._destCurrency]);
  }

  setCurrencies(currencies: Currency[]) {
    this.currencies = currencies;
    this.refreshCurrencySelect();
  }

  convert(convWay: string = 'ab') {
    this._convWay = convWay;
    const key = (convWay === 'ab') ? `${this._sourceCurrency.id}_${this._destCurrency.id}` : `${this._destCurrency.id}_${this._sourceCurrency.id}`;
    const amount = (convWay === 'ab') ? this.form.controls['amount'].value : this.form.controls['result'].value;
    const resControl = (convWay === 'ab') ? this.form.controls['result'] : this.form.controls['amount'];
    const res = ConversionPair.convertAmount(this._conversionPair, amount, key);
    resControl.setValue(res.toFixed(4));
  }

  selectCurrency(currencies: Currency[]) {
    if (currencies == null) {
      [this._sourceCurrency, this._destCurrency] = [null, null];
      return;
    }
    [this._sourceCurrency, this._destCurrency] = currencies;

    this.currAPI.convertCurrencies(this._sourceCurrency.id, this._destCurrency.id)
      .then(conversionPair => {
        console.log(conversionPair);
        this._conversionPair = conversionPair;
        this.convert(this._convWay);
        this.refreshMostRecent();
        this._loadingFailed = false;
      })
      .catch(error => {
        console.log('Error : ', error);
        this._loadingFailed = true;
      });
  }

  selectConversionPair(conversionPair: ConversionPair) {
    console.log(conversionPair);
    this._conversionPair = conversionPair;
    this._sourceCurrency = CurrenciesOperations.getById(this.currencies, conversionPair.key1.srcCurrency);
    this._destCurrency = CurrenciesOperations.getById(this.currencies, conversionPair.key1.destCurrency);
    this.convert(this._convWay);
    this._loadingFailed = false;
  }

  elapsedTime() {
    if (!this._conversionPair) {
      return "";
    }

    const diffDate: number = Math.floor((new Date().getTime() - this._conversionPair.useDate.getTime()) / 1000);
    if (diffDate < 3600) {
      return "less than 1 hour";
    } else if (diffDate < 3600 * 24) {
      return `${Math.floor(diffDate/3600)}hours ${Math.floor((diffDate % 3600)/60)}minutes`;
    } else {
      return "more than one day";
    }
  }

  isObsoleteConversionPair() {
    if (!this._conversionPair) {
      return true;
    }

    // calculates the number of hours passed for this conversion pair
    const diffDate = new Date().getTime() - this._conversionPair.useDate.getTime();
    const elapsedTime = diffDate / 1000 / 3600;
    if (elapsedTime > 1) {
      return true;
    }
    return false;
  }
}
