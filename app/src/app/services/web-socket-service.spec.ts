import { TestBed } from "@angular/core/testing";

import { WebSocketService } from "./web-socket-service";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("WebSocketService", () => {
  let service: WebSocketService;
  const mockMessage = {
    from: "teste1@teste",
    to: "teste2@teste",
    message: "Olá",
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
    });
    service = TestBed.inject(WebSocketService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Deveria chamar o connect e criar o socket$", () => {
    service.connect("teste@teste");
    expect(service["socket$"]).toBeTruthy();
  });

  it("Deveria chamar o connect e recriar o socket$ se estiver closed", () => {
    service.connect("teste@teste");
    service.closeConnection();
    service.connect("teste@teste");
    expect(service["socket$"]).toBeTruthy();
  });

  it("Deveria chamar next do socket$ no sendMessage se estiver aberto", () => {
    service.connect("teste@teste");
    const nextSpy = jest.spyOn(service["socket$"], "next");
    service.sendMessage(mockMessage);
    expect(nextSpy).toHaveBeenCalled();
  });

  it("Deveria dar throw do socket$ no sendMessage se estiver fechado", () => {
    service.sendMessage(mockMessage);
  });

  it("Deveria chamar asObservable() no getMessages se estiver aberto", () => {
    service.connect("teste@teste");
    const asObservableSpy = jest.spyOn(service["socket$"], "asObservable");
    service.getMessages();
    expect(asObservableSpy).toHaveBeenCalled();
  });

  it("Deveria retornar um new Observable() no getMessages se estiver fechado", () => {
    const result = service.getMessages();
    expect(result).toBeTruthy();
  });

  it("Deveria chamar next do socket$ no closeConnection se estiver aberto", () => {
    service.connect("teste@teste");
    const completeSpy = jest.spyOn(service["socket$"], "complete");
    service.closeConnection();
    expect(completeSpy).toHaveBeenCalled();
  });

  it("Deveria dar throw do socket$ no closeConnection se estiver fechado", () => {
    service.closeConnection();
  });
});
