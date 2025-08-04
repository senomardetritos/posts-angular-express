import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasPostagens } from './minhas-postagens';

describe('MinhasPostagens', () => {
  let component: MinhasPostagens;
  let fixture: ComponentFixture<MinhasPostagens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MinhasPostagens]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinhasPostagens);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
