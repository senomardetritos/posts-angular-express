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

  /**
   * Teste unitário para verificar o comportamento do método login()
   * quando recebe uma resposta com dados válidos
   */
  it("Deveria chamar Login e chamar o TokenService com tap com data", () => {
    // Prepara o teste - Espiona o método login do TokenService
    const tokenServiceLoginSpy = jest.spyOn(service["tokenService"], "login");
    // Executa a ação - Chama o método login() do serviço
    service.login({} as LoginInterface).subscribe(() => {
      expect(tokenServiceLoginSpy).toHaveBeenCalled(); // Confirma que o TokenService.login foi chamado
    });
    // Simula a resposta HTTP - Captura a requisição feita
    const req = httpTesting.expectOne(`${environment.api_url}/login`);
    // Verifica se a requisição foi do tipo POST
    expect(req.request.method).toEqual("POST");
    // Completa a requisição simulada com uma resposta de sucesso
    req.flush({ data: true });
    // Verifica se não há requisições pendentes
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
