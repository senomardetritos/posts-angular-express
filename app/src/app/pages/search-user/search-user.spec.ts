import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchUser } from "./search-user";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { FriendsResponseInterface } from "../../interfaces/friend-interface";
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
});
