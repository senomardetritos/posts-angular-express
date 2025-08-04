import { TestBed } from "@angular/core/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";

import { PostService } from "./post-service";
import { provideHttpClient } from "@angular/common/http";

describe("PostService", () => {
  let service: PostService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      // ... other imports or declarations for your component/service
    }).compileComponents();
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
