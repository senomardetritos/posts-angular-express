import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Right } from './right';

describe('Right', () => {
  let component: Right;
  let fixture: ComponentFixture<Right>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Right]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Right);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
