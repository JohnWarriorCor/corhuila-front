import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EspecificoComponent } from './especifico.component';

describe('EspecificoComponent', () => {
  let component: EspecificoComponent;
  let fixture: ComponentFixture<EspecificoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EspecificoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EspecificoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
