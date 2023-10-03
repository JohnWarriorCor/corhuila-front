import { TestBed } from '@angular/core/testing';

import { NomogramaExcelService } from './nomograma-excel.service';

describe('NomogramaExcelService', () => {
  let service: NomogramaExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NomogramaExcelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
