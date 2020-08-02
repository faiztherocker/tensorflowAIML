import { TestBed } from '@angular/core/testing';

import { ObjectIdentifierService } from './object-identifier.service';

describe('ObjectIdentifierService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ObjectIdentifierService = TestBed.get(ObjectIdentifierService);
    expect(service).toBeTruthy();
  });
});
