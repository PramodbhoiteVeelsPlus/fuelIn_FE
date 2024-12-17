import { TestBed } from '@angular/core/testing';

import { TransTablesService } from './trans-tables.service';

describe('TransTablesService', () => {
  let service: TransTablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransTablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
