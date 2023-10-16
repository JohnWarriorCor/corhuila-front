import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmplioComponent } from './amplio.component';

describe('AmplioComponent', () => {
  let component: AmplioComponent;
  let fixture: ComponentFixture<AmplioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmplioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmplioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
