import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Header } from "./header";
import { environment } from "../../../environments/environment";
import { LoginResponseInterface } from "../../interfaces/users-interface";
import { ActivationEnd, RouterModule } from "@angular/router";
import { User } from "../../pages/user/user";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("Header", () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [
        Header,
        RouterModule.forRoot([{ path: "home/:search", component: User }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Verfica propriedades", () => {
    expect(component.formSearch).toBeDefined();
    expect(component.name).toBeDefined();
    expect(component.token).toBeDefined();
  });

  it("Deveria setar img_url", () => {
    expect(component.img_url()).toBe(
      `${environment.api_url}/user-photo/${
        component["tokenService"].id
      }?date=${component.photo_date()}`
    );
  });

  it("Deveria subscrever loginEvent$ no ngOnInit", () => {
    const loginEventSpy = jest.spyOn(
      component["tokenService"]["loginEvent$"],
      "subscribe"
    );
    component["tokenService"].loginEvent$.subscribe((res) => {
      expect(component.name).toBe(res.data.name);
      expect(component.token).toBe(res.data.token);
    });
    expect(loginEventSpy).toHaveBeenCalled();
  });

  it("Verificando função subscrever loginEvent$ no ngOnInit", () => {
    const loginData = jest.fn();
    const data = { data: { name: "", token: "123" } };
    loginData.bind(data);
    const loginEventSpy = jest.spyOn(
      component["tokenService"].loginEvent$,
      "subscribe"
    );
    component["tokenService"].loginEvent$.subscribe(loginData);
    expect(loginEventSpy).toHaveBeenCalledWith(loginData);
    component["tokenService"].loginEvent$.emit(data as LoginResponseInterface);
    expect(loginData).toHaveBeenCalled();
    expect(component.name).toBe(data.data.name);
    expect(component.token).toBe(data.data.token);
  });

  it("Deveria subscrever logoutEvent$ no ngOnInit", () => {
    const logoutEventSpy = jest.spyOn(
      component["tokenService"]["logoutEvent$"],
      "subscribe"
    );
    component["tokenService"].logoutEvent$.subscribe(() => {
      expect(component.name).toBe("");
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
    expect(component.name).toBe("");
    expect(component.token).toBe("");
  });

  it("Deveria subscrever photoUserEvent$ no ngOnInit", () => {
    const photoUserEventSpy = jest.spyOn(
      component["tokenService"]["photoUserEvent$"],
      "subscribe"
    );
    component["tokenService"].photoUserEvent$.subscribe(() => {
      expect(component.photo_date).toBe(Date.now());
    });
    expect(photoUserEventSpy).toHaveBeenCalled();
  });

  it("Verificando função subscrever photoUserEvent$ no ngOnInit", () => {
    const alertData = jest.fn();
    const photoUserEventSpy = jest.spyOn(
      component["tokenService"].photoUserEvent$,
      "subscribe"
    );
    component["tokenService"].photoUserEvent$.subscribe(alertData);
    expect(photoUserEventSpy).toHaveBeenCalledWith(alertData);
    component["tokenService"].photoUserEvent$.emit();
    expect(alertData).toHaveBeenCalled();
  });

  it("Verificando função subscrever router.events no ngOnInit", () => {
    const alertData = jest.fn();
    const routerEventSpy = jest.spyOn(
      component["router"]["events"],
      "subscribe"
    );
    component["router"]["events"].subscribe(alertData);
    expect(routerEventSpy).toHaveBeenCalledWith(alertData);
    component["router"].navigate(["/home/teste"]);
    expect(alertData).toHaveBeenCalled();
  });

  it("Verificando função subscrever router.events seta o formSearch", () => {
    component["router"]["events"].subscribe((event) => {
      if (event instanceof ActivationEnd) {
        if (event.snapshot) {
          expect(component.formSearch.get("search")?.value).toBe("teste");
        }
      }
    });
    component["router"].navigate(["/home/teste"]);
  });

  it("Verifica função logout", () => {
    const onSubmitSpy = jest.spyOn(component["tokenService"], "logout");
    component.logout();
    expect(onSubmitSpy).toHaveBeenCalled();
  });

  it("Verifica função onSubmit", () => {
    const onSubmitSpy = jest.spyOn(component, "onSubmit");
    component.onSubmit();
    expect(onSubmitSpy).toHaveBeenCalled();
  });
});
