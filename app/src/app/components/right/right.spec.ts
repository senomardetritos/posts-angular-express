import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Right } from "./right";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { LoginResponseInterface } from "../../interfaces/users-interface";
import { of } from "rxjs";
import { FriendResponseInterface } from "../../interfaces/friend-interface";

describe("Right", () => {
  let component: Right;
  let fixture: ComponentFixture<Right>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [Right],
    }).compileComponents();

    fixture = TestBed.createComponent(Right);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria chamar o tokenService.loginEvent$ no ngOnInit", () => {
    const loginEventSpy = jest.spyOn(
      component["tokenService"].loginEvent$,
      "subscribe"
    );
    const loadUserSpy = jest.spyOn(component, "loadUser");
    const alertData = jest.fn();
    const data = { data: { token: "123" } };
    alertData.bind(data);
    component["tokenService"].loginEvent$.subscribe(alertData);
    component.ngOnInit();
    component["tokenService"].loginEvent$.emit(data as LoginResponseInterface);
    expect(loginEventSpy).toHaveBeenCalledWith(alertData);
    expect(loadUserSpy).toHaveBeenCalled();
    expect(component.token).toBe(data.data.token);
  });

  it("Deveria chamar o tokenService.logoutEvent$ no ngOnInit", () => {
    const logoutEventSpy = jest.spyOn(
      component["tokenService"].logoutEvent$,
      "subscribe"
    );
    component.ngOnInit();
    component["tokenService"].logoutEvent$.emit();
    expect(logoutEventSpy).toHaveBeenCalled();
    expect(component.token).toBe("");
  });

  it("Deveria chamar o friendService.changeFollowEvent$ no ngOnInit", () => {
    const loginEventSpy = jest.spyOn(
      component["friendService"].changeFollowEvent$,
      "subscribe"
    );
    const loadUserSpy = jest.spyOn(component, "loadUser");
    component.ngOnInit();
    component["friendService"].changeFollowEvent$.emit();
    expect(loginEventSpy).toHaveBeenCalled();
    expect(loadUserSpy).toHaveBeenCalled();
  });

  it("Deveria atualizar o following e followers quando chamar loadUser e trazer resultado", () => {
    const friendServiceGetSpy = jest.spyOn(component["friendService"], "get");
    const mockResult = {
      data: {
        following: [],
        followers: [],
      },
    } as unknown as FriendResponseInterface;
    friendServiceGetSpy.mockReturnValue(of(mockResult));
    component.loadUser();
    expect(component.following).toBe(mockResult.data.following);
    expect(component.followers).toBe(mockResult.data.followers);
  });
  it("Deveria atualizar o following e followers quando chamar loadUser e não trazer resultado", () => {
    const friendServiceGetSpy = jest.spyOn(component["friendService"], "get");
    const mockResult = {} as unknown as FriendResponseInterface;
    friendServiceGetSpy.mockReturnValue(of(mockResult));
    component.loadUser();
    expect(component.following.length).toBe(0);
    expect(component.followers.length).toBe(0);
  });
});
