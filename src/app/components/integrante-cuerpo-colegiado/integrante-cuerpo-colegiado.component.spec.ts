import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegranteCuerpoColegiadoComponent } from './integrante-cuerpo-colegiado.component';

describe('IntegranteCuerpoColegiadoComponent', () => {
  let component: IntegranteCuerpoColegiadoComponent;
  let fixture: ComponentFixture<IntegranteCuerpoColegiadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegranteCuerpoColegiadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegranteCuerpoColegiadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
