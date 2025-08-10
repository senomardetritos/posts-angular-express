import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Login } from "./login";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { RouterModule } from "@angular/router";
import { of } from "rxjs";
import { AlertTypes } from "../../interfaces/modal-interface";

describe("Login", () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [Login, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Inicializa form", () => {
    const mockForm = {
      email: "teste@email.com",
      password: "teste123",
    };
    component.formLogin.setValue(mockForm);
    expect(component.formLogin.getRawValue()["email"]).toBe(mockForm.email);
  });

  it("Verifica validação do Form required", () => {
    component.formLogin.get("email")?.setValue("");
    expect(component.formLogin.get("email")?.errors?.["required"]).toEqual(
      true
    );
    component.formLogin.get("password")?.setValue("");
    expect(component.formLogin.get("password")?.errors?.["required"]).toEqual(
      true
    );
  });

  it("Verifica validação do Form email e minlength", () => {
    component.formLogin.get("email")?.setValue("teste");
    component.formLogin.get("password")?.setValue("123");
    expect(component.formLogin.get("email")?.errors?.["email"]).toEqual(true);
    expect(
      component.formLogin.get("password")?.errors?.["minlength"]
    ).toBeDefined();
  });

  it("Verifica função onSubmit", () => {
    const onSubmitSpy = jest.spyOn(component, "onSubmit");
    const markAllAsTouchedSpy = jest.spyOn(
      component.formLogin,
      "markAllAsTouched"
    );
    component.onSubmit();
    expect(onSubmitSpy).toHaveBeenCalled();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it("Se form válido deveria chamar loginService.login", () => {
    const mockForm = {
      email: "teste@email.com",
      password: "teste123",
    };
    component.formLogin.setValue(mockForm);
    const loginSpy = jest.spyOn(component["loginService"], "login");
    component.onSubmit();
    expect(loginSpy).toHaveBeenCalled();
  });

  it("Se form inválido não deveria chamar loginService.login", () => {
    const mockForm = {
      email: "teste",
      password: "123",
    };
    component.formLogin.setValue(mockForm);
    const loginSpy = jest.spyOn(component["loginService"], "login");
    component.onSubmit();
    expect(loginSpy).not.toHaveBeenCalled();
  });

  it("Deveria trazer LoginResponseInterface se dados válidos", () => {
    const mockForm = {
      email: "teste@email.com",
      password: "teste123",
    };
    component.formLogin.setValue(mockForm);
    const subscribeLoginSpy = jest.spyOn(component["loginService"], "login");
    const routerSpy = jest.spyOn(component["router"], "navigate");
    const mockData = {
      data: { id: "", email: "", name: "", token: "" },
      error: "",
    };
    subscribeLoginSpy.mockReturnValue(of(mockData));
    component.onSubmit();
    expect(routerSpy).toHaveBeenCalled();
  });

  it("Deveria trazer erro no LoginResponseInterface se dados inválidos", () => {
    const mockForm = {
      email: "novo@email.com",
      password: "teste123456",
    };
    component.formLogin.setValue(mockForm);
    const subscribeLoginSpy = jest.spyOn(component["loginService"], "login");
    const mockData = {
      data: { id: "", email: "", name: "", token: "" },
      error: "Email não existe",
    };
    subscribeLoginSpy.mockReturnValue(of(mockData));
    const alertSpy = jest.spyOn(component["modalService"], "showAlert");
    component.onSubmit();
    expect(alertSpy).toHaveBeenCalledWith(mockData.error, AlertTypes.ERROR);
  });

  it("Se form válido não deveria chamar modalService.showAlert", () => {
    const mockForm = {
      email: "teste@email.com",
      password: "teste123",
    };
    component.formLogin.setValue(mockForm);
    const alertSpy = jest.spyOn(component["modalService"], "showAlert");
    component.onSubmit();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it("Se form inválido deveria chamar modalService.showAlert", () => {
    const mockForm = {
      email: "teste",
      password: "123",
    };
    component.formLogin.setValue(mockForm);
    const alertSpy = jest.spyOn(component["modalService"], "showAlert");
    component.onSubmit();
    expect(alertSpy).toHaveBeenCalled();
  });
});
