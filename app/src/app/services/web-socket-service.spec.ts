import { TestBed } from "@angular/core/testing";

import { WebSocketService } from "./web-socket-service";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { environment } from "../../environments/environment";

// Objeto para armazenar o mock e observer
const webSocketMocks = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  instance: null as any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  observer: null as any,
  reset: () => {
    webSocketMocks.instance = null;
    webSocketMocks.observer = null;
  },
};

// Mock do webSocket
jest.mock("rxjs/webSocket", () => ({
  webSocket: jest.fn().mockImplementation(() => {
    webSocketMocks.instance = {
      subscribe: jest.fn().mockImplementation((observer) => {
        webSocketMocks.observer = observer;
        return { unsubscribe: jest.fn() };
      }),
    };
    return webSocketMocks.instance;
  }),
  WebSocketSubject: jest.fn(),
}));

describe("WebSocketService", () => {
  let service: WebSocketService;

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
});

describe("WebSocket Service", () => {
  let service: WebSocketService;
  const mockEmail = "test@example.com";
  const mockWsUrl = "ws://test.url";
  const mockMessage = {
    from: "teste1@teste",
    to: "teste2@teste",
    message: "Olá",
  };

  beforeEach(() => {
    environment.ws_url = mockWsUrl;
    service = new WebSocketService();
    webSocketMocks.reset();
  });

  describe("connect", () => {
    it("Deveria retornar false no sendMessage quando nao conectado", () => {
      const connectSpy = jest.spyOn(service, "connect");
      service.sendMessage(mockMessage);
      expect(connectSpy).not.toHaveBeenCalled();
    });

    it("Deveria retornar new Observable() no getMessages quando nao conectado", () => {
      const connectSpy = jest.spyOn(service, "connect");
      const messages = service.getMessages();
      expect(connectSpy).not.toHaveBeenCalled();
      expect(messages).toBeTruthy();
    });

    it("should handle complete event by reconnecting", () => {
      const connectSpy = jest.spyOn(service, "connect");

      service.connect(mockEmail);

      // Simula o evento complete
      webSocketMocks.observer.complete();

      // Verificações
      expect(connectSpy).toHaveBeenCalledTimes(2);
      expect(connectSpy).toHaveBeenCalledWith(mockEmail);
    });

    it("should log completion message", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      service.connect(mockEmail);
      webSocketMocks.observer.complete();

      expect(consoleSpy).toHaveBeenCalledWith(
        "WebSocket connection completed. Repeating..."
      );
      consoleSpy.mockRestore();
    });

    it("should log error message", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();

      service.connect(mockEmail);
      webSocketMocks.observer.error();

      expect(consoleSpy).toHaveBeenCalledWith("Error socket");
      consoleSpy.mockRestore();
    });
  });
});
