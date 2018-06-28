import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Currency } from '../shared/currency';
import { CurrenciesOperations } from '../shared/currencies_operations';

@Component({
  selector: 'currency-select',
  templateUrl: './currency-select.component.html',
  styleUrls: ['./currency-select.component.css']
})
export class CurrencySelectComponent implements OnInit {

  @Output()
  onCurrencySelected: EventEmitter<Currency[]>;

  @Input()
  currenciesList: Currency[] = [new Currency('USD', 'United States Dollar', '$'), new Currency('TND', 'Tunisian Dinar')];

  @Input()
  selectedCurrencies: Currency[] = [null, null];

  _selectionOK: boolean = false;

  constructor() {
    this.onCurrencySelected = new EventEmitter();
  }

  ngOnInit() {
  }

  _setSelectedCurrency(idx: number, currId: string) {
    this.selectedCurrencies[idx] = CurrenciesOperations.getById(this.currenciesList, currId);
    this._updateSelection();
  }

  _updateSelection() {
    if (this.selectedCurrencies.filter(currencie => !currencie).length !== 0) {
      this._selectionOK = false;
      this.onCurrencySelected.emit(null);
      return;
    }

    if (this.selectedCurrencies[0].id === this.selectedCurrencies[1].id) {
      this._selectionOK = false;
      this.onCurrencySelected.emit(null);
      return;
    }

    this._selectionOK = true;
    this.onCurrencySelected.emit(this.selectedCurrencies);
  }
}
