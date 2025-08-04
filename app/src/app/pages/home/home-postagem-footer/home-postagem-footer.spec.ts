import { ComponentFixture, TestBed } from "@angular/core/testing";

import { HomePostagemFooter } from "./home-postagem-footer";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("HomePostagemFooter", () => {
  let component: HomePostagemFooter;
  let fixture: ComponentFixture<HomePostagemFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [HomePostagemFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePostagemFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
