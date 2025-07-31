import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorFarmaciaComponent } from './director-farmacia.component';

describe('DirectorFarmaciaComponent', () => {
  let component: DirectorFarmaciaComponent;
  let fixture: ComponentFixture<DirectorFarmaciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorFarmaciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectorFarmaciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
