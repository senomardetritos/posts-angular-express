import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostagemComments } from './postagem-comments';

describe('PostagemComments', () => {
  let component: PostagemComments;
  let fixture: ComponentFixture<PostagemComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostagemComments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostagemComments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
