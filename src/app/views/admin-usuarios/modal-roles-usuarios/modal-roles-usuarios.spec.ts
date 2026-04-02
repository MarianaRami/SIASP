import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRolesUsuarios } from './modal-roles-usuarios';

describe('ModalRolesUsuarios', () => {
  let component: ModalRolesUsuarios;
  let fixture: ComponentFixture<ModalRolesUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRolesUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRolesUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
