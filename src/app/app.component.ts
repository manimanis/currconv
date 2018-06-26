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
      'amount': ['', Validators.compose([Validators.pattern(/^\d+(\.\d*)?$/i)])],
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

  convert() {
    this.currAPI.convertCurrencies(this.form.value.sourceCurrency.id, this.form.value.destCurrency.id)
      .then(taux => {
        const convRes = taux * parseInt(this.form.value.amount);
        this.form.controls['result'].setValue(convRes);
      });
  }
}
