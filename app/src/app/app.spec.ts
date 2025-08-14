import { ComponentFixture, TestBed } from "@angular/core/testing";
import { App } from "./app";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { AlertInterface } from "./interfaces/modal-interface";
import { LoginResponseInterface } from "./interfaces/users-interface";
import { RouterModule } from "@angular/router";
import { of } from "rxjs";
import { WebSocketMessageInteface } from "./interfaces/web-socket-inteface";

describe("App", () => {
  let app: App;
  let fixture: ComponentFixture<App>;
  const mockLogin = {
    data: {
      id: "1",
      email: "teste@teste",
      token: "123456",
    },
  } as unknown as LoginResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [App, RouterModule.forRoot([])],
    }).compileComponents();
    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    fixture.detectChanges();
    app.ngOnInit();
  });

  it("should create the app", () => {
    expect(app).toBeTruthy();
  });

  it("Deveria subscrever alertEvent$ no ngOnInit", () => {
    const alertEventSpy = jest.spyOn(
      app["modalService"]["alertEvent$"],
      "subscribe"
    );
    app["modalService"].alertEvent$.subscribe((res) => {
      expect(app.showAlert).toBe(res.show);
      expect(app.messageAlert).toBe(res.message);
      expect(app.typeAlert).toBe(res.type);
    });
    expect(alertEventSpy).toHaveBeenCalled();
  });

  it("Verificando função subscrever alertEvent$ no ngOnInit", () => {
    const alertData = jest.fn();
    const data = { show: false, message: "", type: "ERROR" } as AlertInterface;
    alertData.bind(data);
    const alertEventSpy = jest.spyOn(
      app["modalService"].alertEvent$,
      "subscribe"
    );
    app["modalService"].alertEvent$.subscribe(alertData);
    expect(alertEventSpy).toHaveBeenCalledWith(alertData);
    app["modalService"].alertEvent$.emit(data);
    expect(alertData).toHaveBeenCalled();
    expect(app.showAlert).toBe(false);
    expect(app.messageAlert).toBe("");
    expect(app.typeAlert).toBe("ERROR");
  });

  it("Deveria chamar o webSocketService.connect com email no OnInit se tiver logado", () => {
    const connectSpy = jest.spyOn(app["webSocketService"], "connect");
    app["tokenService"].login(mockLogin);
    app.ngOnInit();
    expect(connectSpy).toHaveBeenCalled();
  });

  it("Deveria chamar webSocketService.getMessages no OnInit se tiver logado", () => {
    const getMessagesSpy = jest.spyOn(app["webSocketService"], "getMessages");
    const addNewMessageSpy = jest.spyOn(app["messageService"], "addNewMessage");
    const messageEventSpy = jest.spyOn(
      app["webSocketService"].messageEvent$,
      "emit"
    );
    app["tokenService"].login(mockLogin);
    const mockResult = {
      from: "teste1@teste",
      to: "teste2@teste",
      message: "Olá",
    } as WebSocketMessageInteface;
    getMessagesSpy.mockReturnValue(of(mockResult));
    app.ngOnInit();
    expect(getMessagesSpy).toHaveBeenCalled();
    expect(addNewMessageSpy).toHaveBeenCalledWith(mockResult);
    expect(messageEventSpy).toHaveBeenCalledWith(mockResult);
  });

  it("Ao chamar closeAlert deveria setar showAlert com false", () => {
    app.closeAlert();
    expect(app.showAlert).toBe(false);
  });
});
