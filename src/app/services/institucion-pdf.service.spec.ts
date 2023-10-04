import { TestBed } from '@angular/core/testing';

import { InstitucionPdfService } from './institucion-pdf.service';

describe('InstitucionPdfService', () => {
  let service: InstitucionPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstitucionPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
