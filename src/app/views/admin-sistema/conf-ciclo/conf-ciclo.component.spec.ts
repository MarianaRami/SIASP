import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfCicloComponent } from './conf-ciclo.component';

describe('ConfCicloComponent', () => {
  let component: ConfCicloComponent;
  let fixture: ComponentFixture<ConfCicloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfCicloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfCicloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
