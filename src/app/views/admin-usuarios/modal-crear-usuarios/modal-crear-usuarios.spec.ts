import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearUsuarios } from './modal-crear-usuarios';

describe('ModalCrearUsuarios', () => {
  let component: ModalCrearUsuarios;
  let fixture: ComponentFixture<ModalCrearUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
