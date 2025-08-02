import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPostagem } from './form-postagem';

describe('FormPostagem', () => {
  let component: FormPostagem;
  let fixture: ComponentFixture<FormPostagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPostagem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPostagem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
