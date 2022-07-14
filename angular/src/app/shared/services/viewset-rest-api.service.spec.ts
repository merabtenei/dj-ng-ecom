import { TestBed } from '@angular/core/testing';

import { ViewsetRestApiService } from './viewset-rest-api.service';

describe('ViewsetRestApiService', () => {
  let service: ViewsetRestApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewsetRestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
