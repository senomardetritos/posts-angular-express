import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Register } from "./register";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

describe("Register", () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => "test-id" } },
            paramMap: of({ get: (key: string) => "test-id" }), // For observable paramMap
          },
        },
      ],
      imports: [Register],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
