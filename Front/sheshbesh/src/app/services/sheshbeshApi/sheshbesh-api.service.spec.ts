import { TestBed } from '@angular/core/testing';

import { SheshbeshApiService } from './sheshbesh-api.service';

describe('SheshbeshApiService', () => {
  let service: SheshbeshApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SheshbeshApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
