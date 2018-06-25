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
        this.currencies = currencies;
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
