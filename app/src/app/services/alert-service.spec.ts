import { TestBed } from "@angular/core/testing";
import { AlertService } from "./alert-service";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("AlertService", () => {
  let service: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      // ... other imports or declarations for your component/service
    }).compileComponents();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
