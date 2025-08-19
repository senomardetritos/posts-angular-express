import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchUser } from "./search-user";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import {
  FriendResponseInterface,
  FriendsResponseInterface,
} from "../../interfaces/friend-interface";
import { of } from "rxjs";

describe("SearchUser", () => {
  let component: SearchUser;
  let fixture: ComponentFixture<SearchUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [SearchUser],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria atualizar o following e followers quando chamar ngOnInit e trazer resultado", () => {
    const friendServiceGetSpy = jest.spyOn(component["friendService"], "get");
    const mockResult = {
      data: {
        following: [],
        followers: [],
      },
    } as unknown as FriendResponseInterface;
    friendServiceGetSpy.mockReturnValue(of(mockResult));
    component.ngOnInit();
    expect(component.following).toBe(mockResult.data.following);
    expect(component.followers).toBe(mockResult.data.followers);
  });

  it("Deveria atualizar o following e followers quando chamar ngOnInit e nao trazer resultado", () => {
    const friendServiceGetSpy = jest.spyOn(component["friendService"], "get");
    const mockResult = {
      data: {},
    } as unknown as FriendResponseInterface;
    friendServiceGetSpy.mockReturnValue(of(mockResult));
    component.ngOnInit();
    expect(component.following.length).toBe(0);
    expect(component.followers.length).toBe(0);
  });

  it("Verifica função onSubmit", () => {
    const onSubmitSpy = jest.spyOn(component, "onSubmit");
    component.onSubmit();
    expect(onSubmitSpy).toHaveBeenCalled();
  });

  it("No search deveria chamar o friendService.search no onSubmit", () => {
    const searchSpy = jest.spyOn(component["friendService"], "search");
    component.formSearch.get("search")?.setValue("teste");
    component.onSubmit();
    if (component.formSearch.valid) {
      expect(searchSpy).toHaveBeenCalled();
      component["friendService"].search("1").subscribe((res) => {
        expect(component.friends).toBe(res.data);
      });
    }
  });

  it("Deveria setar o friends ao chamar o friendService.search no onSubmit", () => {
    const searchSpy = jest.spyOn(component["friendService"], "search");
    const mockResult = {
      data: [{ id: "1" }],
    } as unknown as FriendsResponseInterface;
    searchSpy.mockReturnValue(of(mockResult));
    component.formSearch.get("search")?.setValue("teste");
    component.onSubmit();
    expect(searchSpy).toHaveBeenCalled();
    expect(component.friends).toBe(mockResult.data);
  });

  it("Verifica chamar clearSearch ao clicar no icone", () => {
    const clearSearchSpy = jest.spyOn(component, "clearSearch");
    component.formSearch.get("search")?.setValue("Teste");
    fixture.detectChanges();
    const iconMessage = fixture.nativeElement.querySelector(
      ".input-submit-icon button"
    );
    expect(iconMessage).toBeTruthy();
    iconMessage.dispatchEvent(new Event("click"));
    expect(clearSearchSpy).toHaveBeenCalled();
  });

  it("Verifica chamar changeShowFollowing ao clicar no button", () => {
    const changeShowFollowingSpy = jest.spyOn(component, "changeShowFollowing");
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 200,
    });
    fixture.detectChanges();
    const iconMessage = fixture.nativeElement.querySelector(
      ".button-view button"
    );
    expect(iconMessage).toBeTruthy();
    iconMessage.dispatchEvent(new Event("click"));
    expect(changeShowFollowingSpy).toHaveBeenCalled();
  });
});
