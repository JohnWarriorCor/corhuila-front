import { TestBed } from '@angular/core/testing';

import { NormaService } from './norma.service';

describe('NormaService', () => {
  let service: NormaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NormaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
