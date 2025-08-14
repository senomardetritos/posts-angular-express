import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserMessage } from "./user-message";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { WebSocketMessageInteface } from "../../../interfaces/web-socket-inteface";

describe("UserMessage", () => {
  let component: UserMessage;
  let fixture: ComponentFixture<UserMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [UserMessage],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMessage);
    component = fixture.componentInstance;
    component["webSocketService"].connect("teste@teste");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria chamar webSocketService.messageEvent no ngOnInit", () => {
    const messageEventSpy = jest.spyOn(
      component["webSocketService"]["messageEvent$"],
      "subscribe"
    );
    const setQtdNewMessagesSpy = jest.spyOn(component, "setQtdNewMessages");
    const messageData = jest.fn();
    component["webSocketService"].messageEvent$.subscribe(messageData);
    expect(messageEventSpy).toHaveBeenCalledWith(messageData);
    component.ngOnInit();
    component["webSocketService"].messageEvent$.emit();
    expect(messageData).toHaveBeenCalled();
    expect(setQtdNewMessagesSpy).toHaveBeenCalled();
  });

  it("Deveria fazer o reverse para pegar last_message no setLastMessages", () => {
    const mockMessage = {
      from: "teste1@teste",
      to: "teste2@teste",
      message: "Olá",
    };
    fixture.componentRef.setInput("user", { email: "teste1@teste" });
    component["messageService"].addNewMessage(mockMessage);
    component.setLastMessages();
    expect(component.last_message()).toBe("Olá");
  });
});
