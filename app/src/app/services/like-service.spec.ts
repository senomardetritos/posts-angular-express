import { TestBed } from "@angular/core/testing";
import { LikeService } from "./like-service";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("LikeService", () => {
  let service: LikeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      // ... other imports or declarations for your component/service
    }).compileComponents();

    TestBed.configureTestingModule({});
    service = TestBed.inject(LikeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
