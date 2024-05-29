import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducacionComponent } from './EducacionComponent.1';

describe('EducacionComponent', () => {
  let component: EducacionComponent;
  let fixture: ComponentFixture<EducacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
