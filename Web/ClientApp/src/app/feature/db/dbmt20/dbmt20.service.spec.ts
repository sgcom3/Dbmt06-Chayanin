
import { TestBed } from '@angular/core/testing';

import { Dbmt20Service } from './dbmt20.service';

describe('Dbmt20Service', () => {
  let service: Dbmt20Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dbmt20Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
