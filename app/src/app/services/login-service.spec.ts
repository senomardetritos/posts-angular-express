import { TestBed } from "@angular/core/testing";

import { LoginService } from "./login-service";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import {
  LoginInterface,
  LoginResponseInterface,
} from "../interfaces/users-interface";

describe("LoginService", () => {
  let service: LoginService;
  let httpTesting: HttpTestingController;
  let loginResponse: LoginResponseInterface;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
    }).compileComponents();
    service = TestBed.inject(LoginService);
    httpTesting = TestBed.inject(HttpTestingController);
    loginResponse = {} as LoginResponseInterface;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Deveria chamar login e retornar LoginResponseInterface", () => {
    service.login({} as LoginInterface).subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(loginResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/login`);
    expect(req.request.method).toEqual("POST");
    httpTesting.verify();
  });

  it("Deveria chamar Login e chamar o TokenService com tap com data", () => {
    const tokenServiceLoginSpy = jest.spyOn(service["tokenService"], "login");
    service.login({} as LoginInterface).subscribe(() => {
      expect(tokenServiceLoginSpy).toHaveBeenCalled();
    });
    const req = httpTesting.expectOne(`${environment.api_url}/login`);
    expect(req.request.method).toEqual("POST");
    req.flush({ data: true });
    httpTesting.verify();
  });

  it("Deveria chamar Login e chamar o TokenService com tap sem data", () => {
    const tokenServiceLoginSpy = jest.spyOn(service["tokenService"], "login");
    service.login({} as LoginInterface).subscribe(() => {
      expect(tokenServiceLoginSpy).toHaveBeenCalled();
    });
    const req = httpTesting.expectOne(`${environment.api_url}/login`);
    expect(req.request.method).toEqual("POST");
    req.flush({});
    httpTesting.verify();
  });
});
