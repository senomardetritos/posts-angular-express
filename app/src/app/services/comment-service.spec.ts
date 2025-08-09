import { TestBed } from "@angular/core/testing";
import { CommentService } from "./comment-service";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import {
  CommentInterface,
  CommentsResponseInterface,
} from "../interfaces/comment-interface";
import { environment } from "../../environments/environment";

describe("CommentService", () => {
  let service: CommentService;
  let httpTesting: HttpTestingController;
  let commentsResponse: CommentsResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
    }).compileComponents();
    service = TestBed.inject(CommentService);
    httpTesting = TestBed.inject(HttpTestingController);
    commentsResponse = {} as CommentsResponseInterface;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Deveria chamar list e retornar CommentsResponseInterface", () => {
    service.list("1").subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(commentsResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/comments/1`);
    expect(req.request.method).toEqual("GET");
    httpTesting.verify();
  });

  it("Deveria chamar add e retornar CommentsResponseInterface", () => {
    service.add("1", {} as CommentInterface).subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(commentsResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/comments/add/1`);
    expect(req.request.method).toEqual("POST");
    httpTesting.verify();
  });

  it("Deveria chamar delete e retornar CommentsResponseInterface", () => {
    service.delete("1").subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(commentsResponse);
    });
    const req = httpTesting.expectOne(
      `${environment.api_url}/comments/delete/1`
    );
    expect(req.request.method).toEqual("POST");
    httpTesting.verify();
  });
});
