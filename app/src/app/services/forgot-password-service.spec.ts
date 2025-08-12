import { TestBed } from "@angular/core/testing";

import { ForgotPasswordService } from "./forgot-password-service";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { LoginResponseInterface } from "../interfaces/users-interface";
import { environment } from "../../environments/environment";

describe("ForgotPasswordService", () => {
  let service: ForgotPasswordService;
  let httpTesting: HttpTestingController;
  let loginResponse: LoginResponseInterface;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
    });
    service = TestBed.inject(ForgotPasswordService);
    httpTesting = TestBed.inject(HttpTestingController);
    loginResponse = {} as LoginResponseInterface;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Deveria chamar sendEmail e retornar LoginResponseInterface", () => {
    service.sendEmail({ email: "teste@email.com" }).subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(loginResponse);
    });
    const req = httpTesting.expectOne(
      `${environment.api_url}/send-email-forgot-password`
    );
    expect(req.request.method).toEqual("POST");
    httpTesting.verify();
  });

  it("Deveria chamar changePassword e retornar LoginResponseInterface com dados válidos", () => {
    service
      .changePassword({ email: "teste@email.com", otp: "123456" })
      .subscribe((res) => {
        expect(res).toBeDefined();
        expect(res).toBeInstanceOf(loginResponse);
      });
    const req = httpTesting.expectOne(
      `${environment.api_url}/change-forgot-password`
    );
    expect(req.request.method).toEqual("POST");
    req.flush({ data: {} });
    httpTesting.verify();
  });

  it("Deveria chamar changePassword e retornar LoginResponseInterface com dados inválidos", () => {
    service
      .changePassword({ email: "teste@email.com", otp: "123456" })
      .subscribe((res) => {
        expect(res).toBeDefined();
        expect(res).toBeInstanceOf(loginResponse);
      });
    const req = httpTesting.expectOne(
      `${environment.api_url}/change-forgot-password`
    );
    expect(req.request.method).toEqual("POST");
    req.flush({});
    httpTesting.verify();
  });
});
