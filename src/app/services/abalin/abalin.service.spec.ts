import { TestBed } from '@angular/core/testing';

import { AbalinService } from './abalin.service';

describe('AbalinService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AbalinService = TestBed.get(AbalinService);
    expect(service).toBeTruthy();
  });
});
