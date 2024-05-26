import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { langDetailResolver } from './lang-detail.resolver';

describe('langDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => langDetailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
