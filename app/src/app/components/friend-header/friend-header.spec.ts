import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FriendHeader } from "./friend-header";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

describe("FriendHeader", () => {
  let component: FriendHeader;
  let fixture: ComponentFixture<FriendHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [FriendHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(FriendHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria chamar ngOnChanges se passar friend", () => {
    fixture.componentRef.setInput("friend", { user: { id: 1 } });
    component.ngOnChanges();
    expect(component.friend).toBeDefined();
    expect(component.img_url).toBe(
      `${environment.api_url}/user-photo/${component.friend().user.id}?date=${
        Date.now
      }`
    );
  });

  it("Deveria chamar ngOnChanges ne não passar friend", () => {
    fixture.componentRef.setInput("friend", null);
    component.ngOnChanges();
    expect(component.img_url).toBe(
      `${environment.api_url}/user-photo/0?date=${Date.now}`
    );
  });
});
