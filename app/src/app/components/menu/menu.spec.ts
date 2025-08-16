import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Menu } from "./menu";
import { LoginResponseInterface } from "../../interfaces/users-interface";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ActivatedRoute } from "@angular/router";

describe("Menu", () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;
  const mockActivatedRouteWithParam = {};
  const mockLogin = {
    data: {
      id: "1",
      name: "Teste",
      token: "123",
    },
  } as LoginResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
        { provide: ActivatedRoute, useValue: mockActivatedRouteWithParam },
      ],
      imports: [Menu],
    }).compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    component["webSocketService"].connect(mockLogin.data.email);
    component["tokenService"].login(mockLogin);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria iniciar dados e eventos no ngOnInit", () => {
    component.ngOnInit();
    const loadMessagesSpy = jest.spyOn(component, "loadMessages");
    component.ngOnInit();
    expect(loadMessagesSpy).toHaveBeenCalled();
  });

  it("Deveria subscrever loginEvent$ no ngOnInit", () => {
    component.ngOnInit();
    const alertEventSpy = jest.spyOn(
      component["tokenService"]["loginEvent$"],
      "subscribe"
    );
    component["tokenService"].loginEvent$.subscribe((res) => {
      expect(component.token).toBe(res.data.token);
    });
    expect(alertEventSpy).toHaveBeenCalled();
  });

  it("Verificando função subscrever loginEvent$ no ngOnInit", () => {
    component.ngOnInit();
    const alertData = jest.fn();
    const data = { data: { token: "123" } };
    alertData.bind(data);
    const loginEventSpy = jest.spyOn(
      component["tokenService"].loginEvent$,
      "subscribe"
    );
    component["tokenService"].loginEvent$.subscribe(alertData);
    expect(loginEventSpy).toHaveBeenCalledWith(alertData);
    component["tokenService"].loginEvent$.emit(data as LoginResponseInterface);
    expect(alertData).toHaveBeenCalled();
    expect(component.token).toBe(data.data.token);
  });

  it("Deveria subscrever logoutEvent$ no ngOnInit", () => {
    component.ngOnInit();
    const logoutEventSpy = jest.spyOn(
      component["tokenService"]["logoutEvent$"],
      "subscribe"
    );
    component["tokenService"].logoutEvent$.subscribe(() => {
      expect(component.token).toBe("");
    });
    expect(logoutEventSpy).toHaveBeenCalled();
  });

  it("Verificando função subscrever logoutEvent$ no ngOnInit", () => {
    component.ngOnInit();
    const alertData = jest.fn();
    const logoutEventSpy = jest.spyOn(
      component["tokenService"].logoutEvent$,
      "subscribe"
    );
    component["tokenService"].logoutEvent$.subscribe(alertData);
    expect(logoutEventSpy).toHaveBeenCalledWith(alertData);
    component["tokenService"].logoutEvent$.subscribe(() => {
      expect(component.token).toBe("");
    });
    component["tokenService"].logoutEvent$.emit();
    expect(alertData).toHaveBeenCalled();
  });

  it("Verifica função logout", () => {
    component.ngOnInit();
    const onSubmitSpy = jest.spyOn(component["tokenService"], "logout");
    component.logout();
    expect(onSubmitSpy).toHaveBeenCalled();
  });

  it("Verifica chamar showMessages ao clicar no icone", () => {
    const showMessagesSpy = jest.spyOn(component, "showMessages");
    const iconMessage = fixture.nativeElement.querySelector(".items.chat a");
    expect(iconMessage).toBeTruthy();
    iconMessage.dispatchEvent(new Event("click"));
    expect(showMessagesSpy).toHaveBeenCalled();
  });

  it("Verifica chamar closeMessages ao output buttonClose", () => {
    const closeMessagesSpy = jest.spyOn(component, "closeMessages");
    component.isOpenMessage = true;
    fixture.detectChanges();
    const appMessage = fixture.nativeElement.querySelector(".app-messages");
    expect(appMessage).toBeTruthy();
    appMessage.dispatchEvent(new Event("buttonClose"));
    expect(closeMessagesSpy).toHaveBeenCalled();
  });
});
