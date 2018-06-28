import { Component, OnInit } from '@angular/core';
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
      'result': ['', Validators.compose([Validators.pattern(/^\d+(\.\d*)?$/i)])],
      'sourceCurrency': ['', Validators.required],
      'destCurrency': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.currAPI.getCurrencies()
      .then(currencies => {
        this.currencies = currencies;
      });
    this.refreshMostRecent();

    this._sourceCurrency = {currencyName: "Euro", currencySymbol: "€", id: "EUR"};
    this._destCurrency = {currencyName: "Tunisian Dinar", id: "TND"};
    this.form.controls['sourceCurrency'].setValue(this._sourceCurrency.id);
    this.form.controls['destCurrency'].setValue(this._destCurrency.id);
    this.selectCurrency([this._sourceCurrency, this._destCurrency]);
  }

  refreshMostRecent() {
    this.dbService.getConversionAPI().fetchMostRecent()
      .then(pairs => this._mostRecentList = pairs);
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
      })
      .catch(error => {
        console.log('Error : ', error);
      });
  }

  selectConversionPair(conversionPair: ConversionPair) {
    console.log(conversionPair);
    this._conversionPair = conversionPair;
    this._sourceCurrency = CurrenciesOperations.getById(this.currencies, conversionPair.key1.srcCurrency);
    this._destCurrency = CurrenciesOperations.getById(this.currencies, conversionPair.key1.destCurrency);
    this.convert(this._convWay);
  }
}
