import { TestBed } from "@angular/core/testing";

import { TokenService } from "./token-service";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("TokenService", () => {
  let service: TokenService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      // ... other imports or declarations for your component/service
    }).compileComponents();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
