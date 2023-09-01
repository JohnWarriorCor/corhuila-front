import { TestBed } from '@angular/core/testing';

import { CuerposColegiadosService } from './cuerpos-colegiados.service';

describe('CuerposColegiadosService', () => {
  let service: CuerposColegiadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuerposColegiadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
