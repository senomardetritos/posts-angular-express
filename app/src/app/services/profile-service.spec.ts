import { TestBed } from "@angular/core/testing";

import { ProfileService } from "./profile-service";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import {
  ChangePasswordInterface,
  ProfileInterface,
  ProfileResponseInterface,
  UserPhotoInterface,
} from "../interfaces/users-interface";
import { environment } from "../../environments/environment";

describe("ProfileService", () => {
  let service: ProfileService;
  let httpTesting: HttpTestingController;
  let profileResponse: ProfileResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
    }).compileComponents();
    service = TestBed.inject(ProfileService);
    httpTesting = TestBed.inject(HttpTestingController);
    profileResponse = {} as ProfileResponseInterface;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Deveria chamar updateProfile", () => {
    service.updateProfile({} as ProfileInterface).subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(profileResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/users/update`);
    expect(req.request.method).toEqual("POST");
    req.flush({ data: true });
    httpTesting.verify();
  });

  it("Deveria chamar updateProfile", () => {
    service.changePassword({} as ChangePasswordInterface).subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(profileResponse);
    });
    const req = httpTesting.expectOne(
      `${environment.api_url}/users/change-password`
    );
    expect(req.request.method).toEqual("POST");
    httpTesting.verify();
  });

  it("Deveria chamar uploadPhoto", () => {
    const photo = new Blob(["mock content"], { type: "image/png" });
    service
      .uploadPhoto({ photo: photo } as UserPhotoInterface)
      .subscribe((res) => {
        expect(res).toBeDefined();
        expect(res).toBeInstanceOf(profileResponse);
      });
    const req = httpTesting.expectOne(`${environment.api_url}/users/upload`);
    expect(req.request.method).toEqual("POST");
    httpTesting.verify();
  });
});
