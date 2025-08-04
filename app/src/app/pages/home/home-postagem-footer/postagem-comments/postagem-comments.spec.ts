import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PostagemComments } from "./postagem-comments";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";

describe("PostagemComments", () => {
  let component: PostagemComments;
  let fixture: ComponentFixture<PostagemComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [PostagemComments],
    }).compileComponents();

    fixture = TestBed.createComponent(PostagemComments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
