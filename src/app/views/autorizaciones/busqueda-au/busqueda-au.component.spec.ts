import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaAUComponent } from './busqueda-au.component';

describe('BusquedaAUComponent', () => {
  let component: BusquedaAUComponent;
  let fixture: ComponentFixture<BusquedaAUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaAUComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusquedaAUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
