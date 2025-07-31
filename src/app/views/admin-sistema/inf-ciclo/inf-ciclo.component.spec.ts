import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfCicloComponent } from './inf-ciclo.component';

describe('InfCicloComponent', () => {
  let component: InfCicloComponent;
  let fixture: ComponentFixture<InfCicloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfCicloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfCicloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
