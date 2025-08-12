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
  const mockForgot = {
    email: "teste@teste.com",
    otp: "123456",
    password: "123456",
  };

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

  it("Deveria chamar markAllAsTouched no onSubmitForgot", () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.formForgot,
      "markAllAsTouched"
    );
    component.onSubmitForgot();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o forgotService quando onSubmitForgot quando formForgot for válido", () => {
    const forgotServiceSpy = jest.spyOn(
      component["forgotService"],
      "sendEmail"
    );
    component.formForgot.setValue(mockSendEmail);
    component.onSubmitForgot();
    expect(forgotServiceSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o modalService.showAlert quando onSubmitForgot quando formForgot for inválido", () => {
    const showAlertSpy = jest.spyOn(component["modalService"], "showAlert");
    component.formForgot.setValue({ email: "" });
    component.onSubmitForgot();
    expect(showAlertSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o modalService.showAlert quando onSubmitForgot quando resposta tiver erro", () => {
    const forgotServiceSpy = jest.spyOn(
      component["forgotService"],
      "sendEmail"
    );
    const showAlertSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = { error: "Erro" } as unknown as LoginResponseInterface;
    forgotServiceSpy.mockReturnValue(of(mockResult));
    component.formForgot.setValue(mockSendEmail);
    component.onSubmitForgot();
    expect(showAlertSpy).toHaveBeenCalledWith(mockResult.error, "ERROR");
  });

  it("Deveria setar o formChange email quando onSubmitForgot quando resposta tiver sucesso", () => {
    const forgotServiceSpy = jest.spyOn(
      component["forgotService"],
      "sendEmail"
    );
    const mockResult = {
      data: mockSendEmail,
    } as unknown as LoginResponseInterface;
    forgotServiceSpy.mockReturnValue(of(mockResult));
    component.formForgot.setValue(mockSendEmail);
    component.onSubmitForgot();
    expect(component.formChange.get("email")?.value).toBe(mockSendEmail.email);
  });

  it("Deveria chamar markAllAsTouched no onSubmitChange", () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.formChange,
      "markAllAsTouched"
    );
    component.onSubmitChange();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o forgotService quando onSubmitChange quando formChange for válido", () => {
    const forgotServiceSpy = jest.spyOn(
      component["forgotService"],
      "changePassword"
    );
    component.formChange.setValue(mockForgot);
    component.onSubmitChange();
    expect(forgotServiceSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o modalService.showAlert quando onSubmitChange quando formChange for inválido", () => {
    const showAlertSpy = jest.spyOn(component["modalService"], "showAlert");
    component.formChange.setValue({ email: "", otp: "", password: "" });
    component.onSubmitChange();
    expect(showAlertSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o modalService.showAlert quando onSubmitChange quando resposta tiver erro", () => {
    const forgotServiceSpy = jest.spyOn(
      component["forgotService"],
      "changePassword"
    );
    const showAlertSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = { error: "Erro" } as unknown as LoginResponseInterface;
    forgotServiceSpy.mockReturnValue(of(mockResult));
    component.formChange.setValue(mockForgot);
    component.onSubmitChange();
    expect(showAlertSpy).toHaveBeenCalledWith(mockResult.error, "ERROR");
  });

  it("Deveria setar o router navigate quando onSubmitChange quando resposta tiver sucesso", () => {
    const forgotServiceSpy = jest.spyOn(
      component["forgotService"],
      "changePassword"
    );
    const mockResult = {
      data: mockForgot,
    } as unknown as LoginResponseInterface;
    forgotServiceSpy.mockReturnValue(of(mockResult));
    component.formChange.setValue(mockForgot);
    component.onSubmitChange();
  });
});
