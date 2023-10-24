import { TestBed } from '@angular/core/testing';

import { ProgramaPdfService } from './programa-pdf.service';

describe('ProgramaPdfService', () => {
  let service: ProgramaPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramaPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
