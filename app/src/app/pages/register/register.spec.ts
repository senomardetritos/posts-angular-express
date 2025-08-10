import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Register } from "./register";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { RouterModule } from "@angular/router";
import { of } from "rxjs";
import { LoginResponseInterface } from "../../interfaces/users-interface";

describe("Register", () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let mockForm: object;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [Register, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    mockForm = {
      email: "teste@teste.com",
      name: "Teste do Teste",
      password: "123456",
    };
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria chamar markAllAsTouched no onSubmit", () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.formRegister,
      "markAllAsTouched"
    );
    component.onSubmit();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o registerService quando onSubmit quando formRegister for válido", () => {
    const registerServiceSpy = jest.spyOn(
      component["registerService"],
      "register"
    );
    component.formRegister.setValue(mockForm);
    component.onSubmit();
    expect(registerServiceSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o modalService.showAlert quando onSubmit quando formRegister for inválido", () => {
    const showAlertSpy = jest.spyOn(component["modalService"], "showAlert");
    component.formRegister.setValue({ email: "", name: "", password: "" });
    component.onSubmit();
    expect(showAlertSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o modalService.showAlert quando onSubmit quando resposta tiver erro", () => {
    const registerServiceSpy = jest.spyOn(
      component["registerService"],
      "register"
    );
    const showAlertSpy = jest.spyOn(component["modalService"], "showAlert");
    const mockResult = { error: "Erro" } as unknown as LoginResponseInterface;
    registerServiceSpy.mockReturnValue(of(mockResult));
    component.formRegister.setValue(mockForm);
    component.onSubmit();
    expect(showAlertSpy).toHaveBeenCalledWith(mockResult.error, "ERROR");
  });

  it("Deveria chamar o router.navigate quando onSubmit quando resposta tiver sucesso", () => {
    const registerServiceSpy = jest.spyOn(
      component["registerService"],
      "register"
    );
    const routerSpy = jest.spyOn(component["router"], "navigate");
    const mockResult = { data: mockForm } as unknown as LoginResponseInterface;
    registerServiceSpy.mockReturnValue(of(mockResult));
    component.formRegister.setValue(mockForm);
    component.onSubmit();
    expect(routerSpy).toHaveBeenCalledWith(["/home"]);
  });
});
