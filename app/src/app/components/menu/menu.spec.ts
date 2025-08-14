import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Menu } from "./menu";
import { LoginResponseInterface } from "../../interfaces/users-interface";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("Menu", () => {
  let component: Menu;
  let fixture: ComponentFixture<Menu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [Menu],
    }).compileComponents();

    fixture = TestBed.createComponent(Menu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria subscrever loginEvent$ no ngOnInit", () => {
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
    const alertData = jest.fn();
    const logoutEventSpy = jest.spyOn(
      component["tokenService"].logoutEvent$,
      "subscribe"
    );
    component["tokenService"].logoutEvent$.subscribe(alertData);
    expect(logoutEventSpy).toHaveBeenCalledWith(alertData);
    component["tokenService"].logoutEvent$.emit();
    expect(alertData).toHaveBeenCalled();
    expect(component.token).toBe("");
  });

  it("Verifica função logout", () => {
    const onSubmitSpy = jest.spyOn(component["tokenService"], "logout");
    component.logout();
    expect(onSubmitSpy).toHaveBeenCalled();
  });
});
