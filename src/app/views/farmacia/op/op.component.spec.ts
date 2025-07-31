import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OPComponent } from './op.component';

describe('OPComponent', () => {
  let component: OPComponent;
  let fixture: ComponentFixture<OPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
