import { Component, OnInit } from '@angular/core';
import { CurrencyApiService } from './services/currencyapi.service';
import { Currency } from './shared/currency';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currencies: Currency[];
  form: FormGroup;
  
  constructor(private currAPI: CurrencyApiService,
              fb: FormBuilder) {
    this.form = fb.group({
      'amount': ['1', Validators.compose([Validators.required, Validators.pattern(/^\d+(\.\d*)?$/i)])],
      'result': [{value: '', disabled: true}],
      'sourceCurrency': ['', Validators.required],
      'destCurrency': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.currAPI.getCurrencies()
      .then(currencies => {
        this.currencies = Object.values(currencies.results);
        this.currencies.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        })
      });
  }

  convert() {
    this.currAPI.convertCurrencies(this.form.value.sourceCurrency.id, this.form.value.destCurrency.id)
      .then(taux => {
        const convRes = taux * parseInt(this.form.value.amount);
        this.form.controls['result'].setValue(convRes);
      });
  }
}
