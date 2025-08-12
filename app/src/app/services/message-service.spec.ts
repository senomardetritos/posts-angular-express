import { TestBed } from "@angular/core/testing";

import { MessageService } from "./message-service";
import { provideHttpClient } from "@angular/common/http";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import {
  MessagesResponseInterface,
  UsersMessageResponseInterface,
} from "../interfaces/message-interface";
import { environment } from "../../environments/environment";

describe("MessageService", () => {
  let service: MessageService;
  let httpTesting: HttpTestingController;
  let messagesResponse: MessagesResponseInterface;
  let usersMessageResponse: UsersMessageResponseInterface;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Provides HttpClient for your component/service
        provideHttpClientTesting(), // Provides HttpTestingController for mocking
      ],
    });
    service = TestBed.inject(MessageService);
    httpTesting = TestBed.inject(HttpTestingController);
    messagesResponse = {} as MessagesResponseInterface;
    usersMessageResponse = {} as UsersMessageResponseInterface;
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("Deveria chamar getMessages e retornar MessagesResponseInterface", () => {
    service.getMessages("1").subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(messagesResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/messages/list/1`);
    expect(req.request.method).toEqual("GET");
    httpTesting.verify();
  });

  it("Deveria chamar getMessagesUsers e retornar UsersMessageResponseInterface", () => {
    service.getMessagesUsers().subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(usersMessageResponse);
    });
    const req = httpTesting.expectOne(`${environment.api_url}/messages/users`);
    expect(req.request.method).toEqual("GET");
    httpTesting.verify();
  });

  it("Deveria chamar searchUser e retornar UsersMessageResponseInterface", () => {
    service.searchUser("teste").subscribe((res) => {
      expect(res).toBeDefined();
      expect(res).toBeInstanceOf(usersMessageResponse);
    });
    const req = httpTesting.expectOne(
      `${environment.api_url}/messages/search-user/teste`
    );
    expect(req.request.method).toEqual("GET");
    httpTesting.verify();
  });
});
