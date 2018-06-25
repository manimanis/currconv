import { TestBed, inject } from '@angular/core/testing';

import { CurrencyApiService } from './currencyapi.service';

describe('CurrencyApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CurrencyApiService]
    });
  });

  it('should be created', inject([CurrencyApiService], (service: CurrencyApiService) => {
    expect(service).toBeTruthy();
  }));
});
