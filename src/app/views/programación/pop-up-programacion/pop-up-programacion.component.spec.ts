import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpProgramacionComponent } from './pop-up-programacion.component';

describe('PopUpProgramacionComponent', () => {
  let component: PopUpProgramacionComponent;
  let fixture: ComponentFixture<PopUpProgramacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpProgramacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopUpProgramacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
