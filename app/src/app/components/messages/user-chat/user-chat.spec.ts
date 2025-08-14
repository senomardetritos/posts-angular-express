import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserChat } from "./user-chat";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { of } from "rxjs";
import {
  MessageInterface,
  MessagesResponseInterface,
} from "../../../interfaces/message-interface";
import { WebSocketMessageInteface } from "../../../interfaces/web-socket-inteface";

describe("UserChat", () => {
  let component: UserChat;
  let fixture: ComponentFixture<UserChat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
      imports: [UserChat],
    }).compileComponents();

    fixture = TestBed.createComponent(UserChat);
    component = fixture.componentInstance;
    component["webSocketService"].connect("teste@teste");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("Deveria chamar messageService.getMessages no ngOnInit quando dados válidos", () => {
    const getMessagesSpy = jest.spyOn(
      component["messageService"],
      "getMessages"
    );
    const mockResult = { data: {} } as MessagesResponseInterface;
    getMessagesSpy.mockReturnValue(of(mockResult));
    fixture.componentRef.setInput("user", { id: 1 });
    component.ngOnInit();
    expect(getMessagesSpy).toHaveBeenCalled();
    expect(component.messages).toBe(mockResult.data);
  });

  it("Deveria chamar messageService.getMessages no ngOnInit quando dados inválidos", () => {
    const getMessagesSpy = jest.spyOn(
      component["messageService"],
      "getMessages"
    );
    const mockResult = { error: "Erro" } as MessagesResponseInterface;
    getMessagesSpy.mockReturnValue(of(mockResult));
    fixture.componentRef.setInput("user", { id: 1 });
    component.ngOnInit();
    expect(getMessagesSpy).toHaveBeenCalled();
    expect(component.messages.length).toBe(0);
  });

  it("Deveria chamar webSocketService.messageEvent no ngOnInit se email for = from", () => {
    const messageEventSpy = jest.spyOn(
      component["webSocketService"]["messageEvent$"],
      "subscribe"
    );
    fixture.componentRef.setInput("user", { id: 1, email: "teste@teste" });
    const mockResult = { from: "teste@teste" };
    const messageData = jest.fn();
    messageData.bind(mockResult);
    component["webSocketService"].messageEvent$.subscribe(messageData);
    expect(messageEventSpy).toHaveBeenCalledWith(messageData);
    component.ngOnInit();
    component["webSocketService"].messageEvent$.emit(
      mockResult as WebSocketMessageInteface
    );
    expect(messageData).toHaveBeenCalled();
  });

  it("Deveria chamar webSocketService.messageEvent no ngOnInit se email for != from", () => {
    const messageEventSpy = jest.spyOn(
      component["webSocketService"]["messageEvent$"],
      "subscribe"
    );
    fixture.componentRef.setInput("user", { id: 1, email: "teste1@teste" });
    const mockResult = { from: "teste2@teste" };
    const messageData = jest.fn();
    messageData.bind(mockResult);
    component["webSocketService"].messageEvent$.subscribe(messageData);
    expect(messageEventSpy).toHaveBeenCalledWith(messageData);
    component.ngOnInit();
    component["webSocketService"].messageEvent$.emit(
      mockResult as WebSocketMessageInteface
    );
    expect(messageData).toHaveBeenCalled();
  });

  it("Deveria chamar messageService.setViewedMessages quando dados válidos", () => {
    const setViewedMessagesSpy = jest.spyOn(
      component["messageService"],
      "setViewedMessages"
    );
    const mockResult = { data: [] } as unknown as MessagesResponseInterface;
    setViewedMessagesSpy.mockReturnValue(of(mockResult));
    fixture.componentRef.setInput("user", { id: 1 });
    component.setViewedMessages();
    expect(setViewedMessagesSpy).toHaveBeenCalled();
    expect(component.messages.length).toBe(0);
  });

  it("Deveria chamar messageService.setViewedMessagesSpy quando dados inválidos", () => {
    const setViewedMessagesSpy = jest.spyOn(
      component["messageService"],
      "setViewedMessages"
    );
    const mockResult = { error: "Erro" } as MessagesResponseInterface;
    setViewedMessagesSpy.mockReturnValue(of(mockResult));
    fixture.componentRef.setInput("user", { id: 1 });
    component.setViewedMessages();
    expect(setViewedMessagesSpy).toHaveBeenCalled();
    expect(component.messages.length).toBe(0);
  });

  it("Deveria fazer scrollTop no ngAfterViewChecked se tiver mensagens", () => {
    component.messages = [
      { id: 1 } as MessageInterface,
      { id: 2 } as MessageInterface,
    ];
    fixture.detectChanges();
    component.ngAfterViewChecked();
    expect(component["chatContainerRef"].nativeElement.scrollTop).toBe(
      component["chatContainerRef"].nativeElement.scrollHeight
    );
  });

  it("Deveria chamar addMessage no OnSubmit se form for válido e tiver mensagens", () => {
    const addMessageSpy = jest.spyOn(component, "addMessage");
    component.messages = [
      { id: 1 } as MessageInterface,
      { id: 2 } as MessageInterface,
    ];
    component.formChat.setValue({ message: "Teste" });
    component.onSubmit();
    expect(addMessageSpy).toHaveBeenCalled();
  });

  it("Deveria chamar addMessage no OnSubmit se form for válido e não tiver mensagens", () => {
    const addMessageSpy = jest.spyOn(component, "addMessage");
    component.formChat.setValue({ message: "Teste" });
    component.onSubmit();
    expect(addMessageSpy).toHaveBeenCalled();
  });

  it("Deveria chamar addMessage no OnSubmit se form for inválido", () => {
    component.formChat.setValue({ message: "" });
    component.onSubmit();
    expect(component.formChat.untouched).toBe(true);
  });
});
