import { TestBed } from '@angular/core/testing';

import { YearMakeModelService } from './year-make-model.service';

describe('YearMakeModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YearMakeModelService = TestBed.get(YearMakeModelService);
    expect(service).toBeTruthy();
  });
});
