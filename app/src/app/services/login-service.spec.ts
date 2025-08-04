import { TestBed } from "@angular/core/testing";

import { LoginService } from "./login-service";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";

describe("LoginService", () => {
  let service: LoginService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      // ... other imports or declarations for your component/service
    }).compileComponents();
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
