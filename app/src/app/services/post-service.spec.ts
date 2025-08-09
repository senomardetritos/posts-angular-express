import { TestBed } from "@angular/core/testing";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";

import { PostService } from "./post-service";
import { provideHttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {
  PostInterface,
  PostResponseInterface,
  PostsResponseInterface,
} from "../interfaces/posts-interface";

describe("PostService", () => {
  let service: PostService;
  let httpTesting: HttpTestingController;
  let postsResponse: PostsResponseInterface;
  let postResponse: PostResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
    }).compileComponents();
    service = TestBed.inject(PostService);
    httpTesting = TestBed.inject(HttpTestingController);
    postsResponse = {} as PostsResponseInterface;
    postResponse = {} as PostResponseInterface;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Deveria chamar list e retornar PostsResponseInterface", () => {
    service.list().subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(postsResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/posts`);
    expect(req.request.method).toEqual("GET");
    httpTesting.verify();
  });

  it("Deveria chamar get e retornar PostResponseInterface", () => {
    service.get("1").subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(postResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/posts/1`);
    expect(req.request.method).toEqual("GET");
    httpTesting.verify();
  });

  it("Deveria chamar search e retornar PostsResponseInterface", () => {
    service.search("teste").subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(postsResponse);
    });
    const req = httpTesting.expectOne(
      `${environment.api_url}/posts/search/teste`
    );
    expect(req.request.method).toEqual("GET");
    httpTesting.verify();
  });

  it("Deveria chamar add e retornar PostResponseInterface", () => {
    service.add({} as PostInterface).subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(postResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/posts/add`);
    expect(req.request.method).toEqual("POST");
    httpTesting.verify();
  });

  it("Deveria chamar update e retornar PostResponseInterface", () => {
    service.update({ id: "1" } as PostInterface).subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(postResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/posts/update/1`);
    expect(req.request.method).toEqual("POST");
    httpTesting.verify();
  });
});
