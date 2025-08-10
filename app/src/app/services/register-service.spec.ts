import { TestBed } from "@angular/core/testing";

import { RegisterService } from "./register-service";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import {
  LoginResponseInterface,
  RegisterInterface,
} from "../interfaces/users-interface";
import { environment } from "../../environments/environment";

describe("RegisterService", () => {
  let service: RegisterService;
  let httpTesting: HttpTestingController;
  let loginResponse: LoginResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
    }).compileComponents();
    service = TestBed.inject(RegisterService);
    httpTesting = TestBed.inject(HttpTestingController);
    loginResponse = {} as LoginResponseInterface;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Deveria chamar register e retornar LoginResponseInterface com data", () => {
    service.register({} as RegisterInterface).subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(loginResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/register`);
    expect(req.request.method).toEqual("POST");
    req.flush({ data: true });
    httpTesting.verify();
  });

  it("Deveria chamar register e retornar LoginResponseInterface sem data", () => {
    service.register({} as RegisterInterface).subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(loginResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/register`);
    expect(req.request.method).toEqual("POST");
    req.flush({});
    httpTesting.verify();
  });
});
