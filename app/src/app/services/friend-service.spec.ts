import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { FriendService } from "./friend-service";
import {
  FollowResponseInterface,
  FriendResponseInterface,
  FriendsResponseInterface,
} from "../interfaces/friend-interface";
import { environment } from "../../environments/environment";

describe("LikeService", () => {
  let service: FriendService;
  let httpTesting: HttpTestingController;
  let friendsResponse: FriendsResponseInterface;
  let friendResponse: FriendResponseInterface;
  let followResponse: FollowResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
    }).compileComponents();
    service = TestBed.inject(FriendService);
    httpTesting = TestBed.inject(HttpTestingController);
    friendsResponse = {} as FriendsResponseInterface;
    friendResponse = {} as FriendResponseInterface;
    followResponse = {} as FollowResponseInterface;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Deveria chamar get e retornar FriendResponseInterface", () => {
    service.get("1").subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(friendResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/friends/1`);
    expect(req.request.method).toEqual("GET");
    httpTesting.verify();
  });

  it("Deveria chamar search e retornar FriendsResponseInterface", () => {
    service.search("1").subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(friendsResponse);
    });
    const req = httpTesting.expectOne(
      `${environment.api_url}/friends/search/1`
    );
    expect(req.request.method).toEqual("GET");
    httpTesting.verify();
  });

  it("Deveria chamar follow e retornar FollowResponseInterface", () => {
    service.follow("1").subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(followResponse);
    });
    const req = httpTesting.expectOne(
      `${environment.api_url}/friends/follow/1`
    );
    expect(req.request.method).toEqual("GET");
    httpTesting.verify();
  });

  it("Deveria chamar changeFollow e chamar changeFollowEvent$", () => {
    const changeFollowEventSpy = jest.spyOn(
      service["changeFollowEvent$"],
      "emit"
    );
    service.changeFollow("1").subscribe(() => {
      expect(changeFollowEventSpy).toHaveBeenCalled();
    });
    const req = httpTesting.expectOne(
      `${environment.api_url}/friends/change-follow/1`
    );
    expect(req.request.method).toEqual("POST");
    req.flush({ data: true });
    httpTesting.verify();
  });
});
