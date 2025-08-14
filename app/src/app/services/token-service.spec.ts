import { TestBed } from "@angular/core/testing";

import { TokenService } from "./token-service";
import { LoginResponseInterface } from "../interfaces/users-interface";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { WebSocketMessageInteface } from "../interfaces/web-socket-inteface";
import { of } from "rxjs";

describe("TokenService", () => {
  let service: TokenService;
  const mockLogin = {
    data: {
      email: "teste@teste.com",
      name: "Teste",
      token: "123456",
    },
  } as LoginResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
    }).compileComponents();
    service = TestBed.inject(TokenService);
    service["webSocketService"].connect("teste@teste");
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Fazer login", () => {
    service.login(mockLogin);
    expect(localStorage.getItem("email")).toEqual(mockLogin.data.email);
  });

  it("Deveria chamar webSocketService.getMessages no login", () => {
    const getMessagesSpy = jest.spyOn(
      service["webSocketService"],
      "getMessages"
    );
    const addNewMessageSpy = jest.spyOn(
      service["messageService"],
      "addNewMessage"
    );
    const messageEventSpy = jest.spyOn(
      service["webSocketService"].messageEvent$,
      "emit"
    );
    const mockResult = {
      from: "teste1@teste",
      to: "teste2@teste",
      message: "Olá",
    } as WebSocketMessageInteface;
    getMessagesSpy.mockReturnValue(of(mockResult));
    service.login(mockLogin);
    expect(getMessagesSpy).toHaveBeenCalled();
    expect(addNewMessageSpy).toHaveBeenCalledWith(mockResult);
    expect(messageEventSpy).toHaveBeenCalledWith(mockResult);
  });

  it("Fazer logout", () => {
    service.logout();
    expect(localStorage.getItem("email")).toEqual(null);
  });

  it("Check está logado e deslogado", () => {
    service.login(mockLogin);
    expect(service.isLogged()).toEqual(true);
    service.logout();
    expect(service.isLogged()).toEqual(false);
  });

  it("Se getUser está correto", () => {
    service.login(mockLogin);
    const res = service.getUser();
    expect(res.data.email).toEqual(mockLogin.data.email);
  });

  it("Ao setar name deveria chamar emit do loginEvent$", () => {
    const loginEventSpy = jest.spyOn(service["loginEvent$"], "emit");
    service.name = "teste";
    expect(loginEventSpy).toHaveBeenCalled();
  });
});
