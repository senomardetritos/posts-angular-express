import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PostagemLikes } from "./postagem-likes";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("PostagemLikes", () => {
  let component: PostagemLikes;
  let fixture: ComponentFixture<PostagemLikes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [PostagemLikes],
    }).compileComponents();

    fixture = TestBed.createComponent(PostagemLikes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
