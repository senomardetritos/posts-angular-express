import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Follow } from "./follow";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { of } from "rxjs";
import { FollowResponseInterface } from "../../interfaces/friend-interface";

describe("Follow", () => {
  let component: Follow;
  let fixture: ComponentFixture<Follow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [Follow],
    }).compileComponents();

    fixture = TestBed.createComponent(Follow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("No changeFollow deveria chamar o friendService.changeFollow", () => {
    const changeFollowSpy = jest.spyOn(
      component["friendService"],
      "changeFollow"
    );
    component.changeFollow();
    expect(changeFollowSpy).toHaveBeenCalled();
    component["friendService"].changeFollow("1").subscribe((res) => {
      expect(component.follow).toBe(res.data);
    });
  });

  it("Verificando função subscrever changeFollow no friendService", () => {
    const changeFollowSpy = jest.spyOn(
      component["friendService"],
      "changeFollow"
    );
    const mockData = { data: {} } as FollowResponseInterface;
    changeFollowSpy.mockReturnValue(of(mockData));
    component.changeFollow();
    expect(component.follow).toBe(mockData.data);
  });

  it("No getFollow deveria chamar o friendService.follow if id > 0", () => {
    const followSpy = jest.spyOn(component["friendService"], "follow");
    fixture.componentRef.setInput("id", "1");
    component.getFollow();
    expect(followSpy).toHaveBeenCalled();
    component["friendService"].follow("1").subscribe((res) => {
      expect(component.follow).toBe(res.data);
    });
  });

  it("Deveria atualizar o follow no getFollow quando id > 0", () => {
    const followSpy = jest.spyOn(component["friendService"], "follow");
    const mockData = { data: {} } as FollowResponseInterface;
    followSpy.mockReturnValue(of(mockData));
    fixture.componentRef.setInput("id", "1");
    component.getFollow();
    expect(component.follow).toBe(mockData.data);
  });

  it("No getFollow deveria chamar o friendService.follow if id == 0", () => {
    const followSpy = jest.spyOn(component["friendService"], "follow");
    component.getFollow();
    expect(followSpy).not.toHaveBeenCalled();
  });
});
