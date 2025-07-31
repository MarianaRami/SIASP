import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JefePisoComponent } from './jefe-piso.component';

describe('JefePisoComponent', () => {
  let component: JefePisoComponent;
  let fixture: ComponentFixture<JefePisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JefePisoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JefePisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
