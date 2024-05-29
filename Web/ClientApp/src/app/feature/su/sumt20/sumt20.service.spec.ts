import { TestBed } from '@angular/core/testing';

import { Sumt20Service } from './sumt20.service';

describe('Sumt20Service', () => {
  let service: Sumt20Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sumt20Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
