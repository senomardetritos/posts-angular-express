import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Messages } from "./messages";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { LoginResponseInterface } from "../../interfaces/users-interface";
import { of } from "rxjs";
import {
  UserMessageInterface,
  UsersMessageResponseInterface,
} from "../../interfaces/message-interface";

describe("Messages", () => {
  let component: Messages;
  let fixture: ComponentFixture<Messages>;
  const mockLogin = {
    data: {
      id: "1",
      name: "Teste",
      token: "123456",
    },
  } as LoginResponseInterface;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [Messages],
    }).compileComponents();

    fixture = TestBed.createComponent(Messages);
    component = fixture.componentInstance;
    component["webSocketService"].connect("teste@teste");
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
    const loadUserSpy = jest.spyOn(component, "loadMessages");
    const alertData = jest.fn();
    const data = { data: { token: "123" } };
    alertData.bind(data);
    component["tokenService"].loginEvent$.subscribe(alertData);
    component["tokenService"].login(mockLogin);
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
    component["tokenService"].login(mockLogin);
    component["tokenService"].logoutEvent$.emit();
    expect(logoutEventSpy).toHaveBeenCalled();
    expect(component.token).toBe("");
  });

  it("Deveria chamar o getMessagesUsers do messageService quando loadMessages", () => {
    const getMessagesUsersSpy = jest.spyOn(
      component["messageService"],
      "getMessagesUsers"
    );
    const mockResult = { data: [] } as unknown as UsersMessageResponseInterface;
    getMessagesUsersSpy.mockReturnValue(of(mockResult));
    component.loadMessages();
    expect(getMessagesUsersSpy).toHaveBeenCalled();
    expect(component.messages_users).toBe(mockResult.data);
  });

  it("Deveria chamar markAllAsTouched no onSubmit", () => {
    const markAllAsTouchedSpy = jest.spyOn(
      component.formUser,
      "markAllAsTouched"
    );
    component.onSubmit();
    expect(markAllAsTouchedSpy).toHaveBeenCalled();
  });

  it("Deveria chamar o searchUser do messageService no OnSubmit quando dados válidos", () => {
    const searchUserSpy = jest.spyOn(component["messageService"], "searchUser");
    const mockResult = { data: [] } as unknown as UsersMessageResponseInterface;
    searchUserSpy.mockReturnValue(of(mockResult));
    component.formUser.setValue({ search: "Teste" });
    component.onSubmit();
    expect(searchUserSpy).toHaveBeenCalled();
    expect(component.list_search).toBe(mockResult.data);
  });

  it("Deveria chamar o searchUser do messageService no OnSubmit quando dados inválidos", () => {
    const searchUserSpy = jest.spyOn(component["messageService"], "searchUser");
    const mockResult = {
      error: "Erro",
    } as unknown as UsersMessageResponseInterface;
    searchUserSpy.mockReturnValue(of(mockResult));
    component.formUser.setValue({ search: "Teste" });
    component.onSubmit();
    expect(searchUserSpy).toHaveBeenCalled();
    expect(component.list_search.length).toBe(0);
  });

  it("Deveria chamar o selectUser quando selecionar um usuário", () => {
    const selectUserSpy = jest.spyOn(component, "selectUser");
    component.token = "123";
    component.isOpen = true;
    component.list_search = [
      { id: 1 } as UserMessageInterface,
      { id: 2 } as UserMessageInterface,
    ];
    fixture.detectChanges();
    const listUser = fixture.nativeElement.querySelector(".list-user");
    expect(listUser).toBeTruthy();
    const buttonUser = listUser.querySelector("button");
    expect(buttonUser).toBeTruthy();
    buttonUser.dispatchEvent(new Event("click"));
    expect(selectUserSpy).toHaveBeenCalled();
  });

  it("Deveria chamar backToMessages quando clicar no chevron-icon", () => {
    const backToMessagesSpy = jest.spyOn(component, "backToMessages");
    component.token = "123";
    component.selected_user.update(
      () =>
        ({
          id: 1,
          email: "teste@teste",
          name: "Teste",
        } as UserMessageInterface)
    );
    fixture.detectChanges();
    const chevronIcon = fixture.nativeElement.querySelector(".chevron-icon");
    expect(chevronIcon).toBeTruthy();
    chevronIcon.dispatchEvent(new Event("click"));
    expect(backToMessagesSpy).toHaveBeenCalled();
  });

  it("Deveria chamar openMessages quando clicar no without-close", () => {
    const openMessagesSpy = jest.spyOn(component, "openMessages");
    component.token = "123";
    fixture.detectChanges();
    const buttonWithoutClose =
      fixture.nativeElement.querySelector(".without-close");
    expect(buttonWithoutClose).toBeTruthy();
    buttonWithoutClose.dispatchEvent(new Event("click"));
    expect(openMessagesSpy).toHaveBeenCalled();
  });

  it("Deveria chamar closeMessages quando clicar no x-icon", () => {
    const closeMessagesSpy = jest.spyOn(component, "closeMessages");
    component.token = "123";
    component.isOpen = true;
    fixture.detectChanges();
    const xIcon = fixture.nativeElement.querySelector(".x-icon");
    expect(xIcon).toBeTruthy();
    xIcon.dispatchEvent(new Event("click"));
    expect(closeMessagesSpy).toHaveBeenCalled();
  });
});
