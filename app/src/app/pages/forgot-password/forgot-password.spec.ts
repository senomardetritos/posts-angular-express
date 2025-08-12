import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ForgotPassword } from "./forgot-password";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { RouterModule } from "@angular/router";
import { of } from "rxjs";
import { LoginResponseInterface } from "../../interfaces/users-interface";

describe("ForgotPassword", () => {
  let component: ForgotPassword;
  let fixture: ComponentFixture<ForgotPassword>;
  const mockSendEmail = {
    email: "teste@teste.com",
  };
  // const mockForgot = {
  //   email: "teste@teste.com",
  //   otp: "123456",
  // };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [ForgotPassword, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria chamar markAllAsTouched no onSubmit", () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.formForgot,
      "markAllAsTouched"
    );
    component.onSubmit();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o forgotService quando onSubmit quando formForgot for válido", () => {
    const forgotServiceSpy = jest.spyOn(
      component["forgotService"],
      "sendEmail"
    );
    component.formForgot.setValue(mockSendEmail);
    component.onSubmit();
    expect(forgotServiceSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o modalService.showAlert quando onSubmit quando formForgot for inválido", () => {
    const showAlertSpy = jest.spyOn(component["modalService"], "showAlert");
    component.formForgot.setValue({ email: "" });
    component.onSubmit();
    expect(showAlertSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o modalService.showAlert quando onSubmit quando resposta tiver erro", () => {
    const forgotServiceSpy = jest.spyOn(
      component["forgotService"],
      "sendEmail"
    );
    const showAlertSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = { error: "Erro" } as unknown as LoginResponseInterface;
    forgotServiceSpy.mockReturnValue(of(mockResult));
    component.formForgot.setValue(mockSendEmail);
    component.onSubmit();
    expect(showAlertSpy).toHaveBeenCalledWith(mockResult.error, "ERROR");
  });

  it("Deveria setar o sentEmail = true quando onSubmit quando resposta tiver sucesso", () => {
    const forgotServiceSpy = jest.spyOn(
      component["forgotService"],
      "sendEmail"
    );
    const mockResult = {
      data: mockSendEmail,
    } as unknown as LoginResponseInterface;
    forgotServiceSpy.mockReturnValue(of(mockResult));
    component.formForgot.setValue(mockSendEmail);
    component.onSubmit();
    expect(component.sentEmail).toBe(true);
  });
});
