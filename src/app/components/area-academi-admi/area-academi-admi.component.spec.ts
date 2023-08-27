import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaAcademiAdmiComponent } from './area-academi-admi.component';

describe('AreaAcademiAdmiComponent', () => {
  let component: AreaAcademiAdmiComponent;
  let fixture: ComponentFixture<AreaAcademiAdmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaAcademiAdmiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaAcademiAdmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
