import { ComponentFixture, TestBed } from "@angular/core/testing";
import { App } from "./app";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { AlertInterface } from "./interfaces/modal-interface";

describe("App", () => {
  let app: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [App],
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

  it("Ao chamar closeAlert deveria setar showAlert com false", () => {
    app.closeAlert();
    expect(app.showAlert).toBe(false);
  });
});
