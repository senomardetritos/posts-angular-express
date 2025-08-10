import { ComponentFixture, TestBed } from "@angular/core/testing";

import { User } from "./user";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { RouterModule } from "@angular/router";
import { FriendResponseInterface } from "../../interfaces/friend-interface";
import { of } from "rxjs";

describe("User", () => {
  let component: User;
  let fixture: ComponentFixture<User>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [User, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(User);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria chamar o friendService.changeFollowEvent$ no ngOnIni", () => {
    const changeFollowEventSpy = jest.spyOn(
      component["friendService"].changeFollowEvent$,
      "subscribe"
    );
    component["friendService"].changeFollowEvent$.subscribe();
    component.ngOnInit();
    expect(changeFollowEventSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o loadUser quando emitir o friendService.changeFollowEvent$", () => {
    const loadUserSpy = jest.spyOn(component, "loadUser");
    component.ngOnInit();
    component["friendService"].changeFollowEvent$.emit();
    expect(loadUserSpy).toHaveBeenCalled();
  });
  it("Deveria testar o this.id quando chamar o loadUser", () => {
    component.id = "1";
    component.loadUser();
    expect(component.id).toBe("1");
  });

  it("Deveria setar o friend quando chamar o loadUser com resultado", () => {
    const friendServiceGetSpy = jest.spyOn(component["friendService"], "get");
    const mockResult = {
      data: { user: { id: "1" } },
    } as unknown as FriendResponseInterface;
    friendServiceGetSpy.mockReturnValue(of(mockResult));
    component.loadUser();
    expect(friendServiceGetSpy).toHaveBeenCalled();
    expect(component.friend).toBe(mockResult.data);
  });

  it("Deveria setar o friend quando chamar o loadUser sem resultado", () => {
    const friendServiceGetSpy = jest.spyOn(component["friendService"], "get");
    const mockResult = {} as unknown as FriendResponseInterface;
    friendServiceGetSpy.mockReturnValue(of(mockResult));
    component.loadUser();
    expect(friendServiceGetSpy).toHaveBeenCalled();
    expect(Object.keys(component.friend).length).toBe(0);
  });
});
