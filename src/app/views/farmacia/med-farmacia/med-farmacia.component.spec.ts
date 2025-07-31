import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedFarmaciaComponent } from './med-farmacia.component';

describe('MedFarmaciaComponent', () => {
  let component: MedFarmaciaComponent;
  let fixture: ComponentFixture<MedFarmaciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedFarmaciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedFarmaciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
