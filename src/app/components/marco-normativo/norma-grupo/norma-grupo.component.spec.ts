import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormaGrupoComponent } from './norma-grupo.component';

describe('NormaGrupoComponent', () => {
  let component: NormaGrupoComponent;
  let fixture: ComponentFixture<NormaGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NormaGrupoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NormaGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
