import { TestBed } from '@angular/core/testing';

import { Indicadores } from './indicadores';

describe('Indicadores', () => {
  let service: Indicadores;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Indicadores);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
