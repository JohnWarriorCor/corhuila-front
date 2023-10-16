import { TestBed } from '@angular/core/testing';

import { ClasificacionCineService } from './clasificacion-cine.service';

describe('ClasificacionCineService', () => {
  let service: ClasificacionCineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClasificacionCineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
