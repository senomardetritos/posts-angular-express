import { TestBed } from "@angular/core/testing";

import { TokenService } from "./token-service";
import { LoginResponseInterface } from "../interfaces/users-interface";

describe("TokenService", () => {
  let service: TokenService;
  let user: LoginResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({}).compileComponents();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenService);
    user = {
      data: {
        email: "teste@teste.com",
        name: "Teste",
        token: "123456",
      },
    } as LoginResponseInterface;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Fazer login", () => {
    service.login(user);
    expect(localStorage.getItem("email")).toEqual(user.data.email);
  });

  it("Fazer logout", () => {
    service.logout();
    expect(localStorage.getItem("email")).toEqual(null);
  });

  it("Check está logado e deslogado", () => {
    service.login(user);
    expect(service.isLogged()).toEqual(true);
    service.logout();
    expect(service.isLogged()).toEqual(false);
  });

  it("Se getUser está correto", () => {
    service.login(user);
    const res = service.getUser();
    expect(res.data.email).toEqual(user.data.email);
  });
});
