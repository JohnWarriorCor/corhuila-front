import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalladoComponent } from './detallado.component';

describe('DetalladoComponent', () => {
  let component: DetalladoComponent;
  let fixture: ComponentFixture<DetalladoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalladoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
