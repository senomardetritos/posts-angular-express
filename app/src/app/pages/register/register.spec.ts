import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Register } from "./register";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { RouterModule } from "@angular/router";

describe("Register", () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [Register, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
