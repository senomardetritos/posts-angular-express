import { TestBed } from "@angular/core/testing";
import { LikeService } from "./like-service";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { LikesResponseInterface } from "../interfaces/like-interface";
import { environment } from "../../environments/environment";

describe("LikeService", () => {
  let service: LikeService;
  let httpTesting: HttpTestingController;
  let likeResponse: LikesResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
    }).compileComponents();
    service = TestBed.inject(LikeService);
    httpTesting = TestBed.inject(HttpTestingController);
    likeResponse = {} as LikesResponseInterface;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Deveria chamar list e retornar LikesResponseInterface", () => {
    service.list("1").subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(likeResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/likes/1`);
    expect(req.request.method).toEqual("GET");
    httpTesting.verify();
  });

  it("Deveria chamar change e retornar LikesResponseInterface", () => {
    service.change("1").subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(likeResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/likes/change/1`);
    expect(req.request.method).toEqual("POST");
    httpTesting.verify();
  });
});
