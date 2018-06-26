import { Component, OnInit } from '@angular/core';
import { CurrencyApiService } from './services/currencyapi.service';
import { Currency } from './shared/currency';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Conversion } from './shared/conversion';

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
  }

  convert(convWay: string) {
    const val = parseFloat((convWay === 'ab') ? this.form.controls['amount'].value : this.form.controls['result'].value);
    const resultFormControl = (convWay === 'ab') ? this.form.controls['result'] : this.form.controls['amount'];
    const convRate = (convWay === 'ab') ? this._sourceConvRate : this._destConvRate;
    this._convWay = convWay;
    const res = convRate.rate * val;
    resultFormControl.setValue(res.toFixed(4));
  }

  setSourceCurrency(sourceCurrency: Currency) {
    this._sourceCurrency = sourceCurrency;
    this._selectCurrency();
  }

  setDestinationCurrency(destCurrency: Currency) {
    this._destCurrency = destCurrency;
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
        [this._sourceConvRate, this._destConvRate] = taux;
        this.convert(this._convWay);
      });
  }
}
