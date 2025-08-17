import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfProtocoloComponent } from './inf-protocolo.component';

describe('InfProtocoloComponent', () => {
  let component: InfProtocoloComponent;
  let fixture: ComponentFixture<InfProtocoloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfProtocoloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfProtocoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
