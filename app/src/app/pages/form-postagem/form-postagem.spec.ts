import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FormPostagem } from "./form-postagem";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { RouterModule } from "@angular/router";

describe("FormPostagem", () => {
  let component: FormPostagem;
  let fixture: ComponentFixture<FormPostagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [FormPostagem, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FormPostagem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
