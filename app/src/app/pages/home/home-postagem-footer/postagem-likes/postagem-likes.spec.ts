import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostagemLikes } from './postagem-likes';

describe('PostagemLikes', () => {
  let component: PostagemLikes;
  let fixture: ComponentFixture<PostagemLikes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostagemLikes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostagemLikes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
