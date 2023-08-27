import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizacionInternaComponent } from './organizacion-interna.component';

describe('OrganizacionInternaComponent', () => {
  let component: OrganizacionInternaComponent;
  let fixture: ComponentFixture<OrganizacionInternaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizacionInternaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizacionInternaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
