import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { messageDetailResolver } from './message-detail.resolver';

describe('messageDetailResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => messageDetailResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
