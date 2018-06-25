import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule, 
  MatBadgeModule, 
  MatButtonModule, 
  MatDatepickerModule, 
  MatFormFieldModule, 
  MatGridListModule, 
  MatInputModule, 
  MatLineModule, 
  MatListModule,
  MatNativeDateModule, 
  MatOptionModule, 
  MatPaginatorModule, 
  MatProgressBarModule, 
  MatProgressSpinnerModule, 
  MatRadioModule, 
  MatRippleModule, 
  MatSelectModule, 
  MatSidenavModule, 
  MatSortModule, 
  MatSliderModule, 
  MatStepperModule, 
  MatSlideToggleModule, 
  MatTabsModule, 
  MatTreeModule, 
  MatTableModule, 
  MatToolbarModule, 
  MatTooltipModule,
  MatIconModule,
  MatCardModule,
  MatMenuModule, } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CurrencyApiService } from './services/currencyapi.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatIconModule,
    MatLineModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatOptionModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatSliderModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatTreeModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: 'API_URL',                   useValue: 'https://free.currencyconverterapi.com/api/v5' },
    { provide: 'IDX_DB_NAME',               useValue: 'currency_converter' },
    { provide: 'IDX_DB_CURRENCIES_STORE',   useValue: 'curr_conv' },
    { provide: 'IDX_DB_CONVERSION_STORE',   useValue: 'curr_conv_conv' },
    CurrencyApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
