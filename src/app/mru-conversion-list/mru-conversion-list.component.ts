import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConversionPair } from '../shared/conversion-pair';

@Component({
  selector: 'mru-conversion-list',
  templateUrl: './mru-conversion-list.component.html',
  styleUrls: ['./mru-conversion-list.component.css']
})
export class MruConversionListComponent implements OnInit {

  @Input()
  mruList: ConversionPair[];

  @Output()
  onSelectConversion: EventEmitter<ConversionPair>;
  
  constructor() { 
    this.onSelectConversion = new EventEmitter();
  }

  ngOnInit() {
  }

  selectConversionPair(conversionPair: ConversionPair) {
    this.onSelectConversion.emit(conversionPair);
  }

}
