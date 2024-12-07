import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaInformationComponent } from './vista-information.component';

describe('VistaInformationComponent', () => {
  let component: VistaInformationComponent;
  let fixture: ComponentFixture<VistaInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
