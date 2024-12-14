import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaGrafoComponent } from './vista-tabla.component';

describe('VistaGrafoComponent', () => {
  let component: VistaGrafoComponent;
  let fixture: ComponentFixture<VistaGrafoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaGrafoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaGrafoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
