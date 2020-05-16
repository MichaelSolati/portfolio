import { TestBed } from '@angular/core/testing';

import { HammerjsConfigService } from './hammerjs-config.service';

describe('HammerjsConfigService', () => {
  let service: HammerjsConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HammerjsConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
