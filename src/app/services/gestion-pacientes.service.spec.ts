import { TestBed } from '@angular/core/testing';

import { GestionPacientesService } from './gestion-pacientes.service';

describe('GestionPacientesService', () => {
  let service: GestionPacientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionPacientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
