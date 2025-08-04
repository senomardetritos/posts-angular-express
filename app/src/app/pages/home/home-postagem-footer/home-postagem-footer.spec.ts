import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePostagemFooter } from './home-postagem-footer';

describe('HomePostagemFooter', () => {
  let component: HomePostagemFooter;
  let fixture: ComponentFixture<HomePostagemFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePostagemFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePostagemFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
