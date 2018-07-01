import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ConversionPair } from '../shared/conversion-pair';
import { MatAccordion, MatExpansionPanel } from '@angular/material';

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

  @ViewChild(MatExpansionPanel) 
  expansionPanel: MatExpansionPanel;
  
  constructor() { 
    this.onSelectConversion = new EventEmitter();
  }

  ngOnInit() {
  }

  selectConversionPair(conversionPair: ConversionPair) {
    this.expansionPanel.close();
    this.onSelectConversion.emit(conversionPair);
  }

}
