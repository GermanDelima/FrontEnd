import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HacercaDeComponent } from './hacerca-de.component';

describe('HacercaDeComponent', () => {
  let component: HacercaDeComponent;
  let fixture: ComponentFixture<HacercaDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HacercaDeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HacercaDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
