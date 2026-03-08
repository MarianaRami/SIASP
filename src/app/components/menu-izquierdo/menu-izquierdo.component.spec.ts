import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuIzquierdoComponent } from './menu-izquierdo.component';

describe('MenuIzquierdoComponent', () => {

  let component: MenuIzquierdoComponent;
  let fixture: ComponentFixture<MenuIzquierdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuIzquierdoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuIzquierdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});