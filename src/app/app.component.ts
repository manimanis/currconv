import { Component, OnInit } from '@angular/core';
import { CurrencyApiService } from './services/currencyapi.service';
import { Currency } from './shared/currency';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Conversion } from './shared/conversion';
import { CurrenciesOperations } from './shared/currencies_operations';

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

  _sourceConvRate: Conversion = new Conversion();
  _destConvRate: Conversion = new Conversion();
  _loadingFailed: boolean = false;
  
  constructor(private currAPI: CurrencyApiService,
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
    
    this._sourceCurrency = {currencyName: "Euro", currencySymbol: "€", id: "EUR"};
    this._destCurrency = {currencyName: "Tunisian Dinar", id: "TND"};
    this.form.controls['sourceCurrency'].setValue(this._sourceCurrency.id);
    this.form.controls['destCurrency'].setValue(this._destCurrency.id);
    this._selectCurrency();
  }

  convert(convWay: string) {
    const val = parseFloat((convWay === 'ab') ? this.form.controls['amount'].value : this.form.controls['result'].value);
    const resultFormControl = (convWay === 'ab') ? this.form.controls['result'] : this.form.controls['amount'];
    const convRate = (convWay === 'ab') ? this._sourceConvRate : this._destConvRate;
    this._convWay = convWay;
    const res = convRate.rate * val;
    resultFormControl.setValue(res.toFixed(4));
  }

  setSourceCurrency(sourceCurrencyId: string) {
    this._sourceCurrency = CurrenciesOperations.getById(this.currencies, sourceCurrencyId);
    this._selectCurrency();
  }

  setDestinationCurrency(destCurrencyId: string) {
    this._destCurrency = CurrenciesOperations.getById(this.currencies, destCurrencyId);;
    this._selectCurrency();
  }

  _selectCurrency() {
    if (!this._sourceCurrency || !this._destCurrency) {
      return;
    }

    if (this._sourceCurrency.id === this._destCurrency.id) {
      return;
    }

    this._conversionKey = `${this._sourceCurrency.id}_${this._destCurrency.id}`;
    this.currAPI.convertCurrencies(this._sourceCurrency.id, this._destCurrency.id)
      .then(taux => {
        console.log('Conversion rates : ', taux);
        [this._sourceConvRate, this._destConvRate] = taux;
        this._loadingFailed = !this._sourceConvRate || !this._destConvRate;
        this.convert(this._convWay);
      })
      .catch(error => this._loadingFailed = true);
  }
}
