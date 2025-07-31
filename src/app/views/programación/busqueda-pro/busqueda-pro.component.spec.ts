import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaProComponent } from './busqueda-pro.component';

describe('BusquedaProComponent', () => {
  let component: BusquedaProComponent;
  let fixture: ComponentFixture<BusquedaProComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaProComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusquedaProComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
