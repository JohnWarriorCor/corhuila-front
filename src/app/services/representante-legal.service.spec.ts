import { TestBed } from '@angular/core/testing';

import { RepresentanteLegalService } from './representante-legal.service';

describe('RepresentanteLegalService', () => {
  let service: RepresentanteLegalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepresentanteLegalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
