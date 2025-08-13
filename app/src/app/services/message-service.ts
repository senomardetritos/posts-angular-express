import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {
  MessagesResponseInterface,
  UsersMessageResponseInterface,
} from "../interfaces/message-interface";
import { WebSocketMessageInteface } from "../interfaces/web-socket-inteface";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private http = inject(HttpClient);

  public addNewMessage(message: WebSocketMessageInteface) {
    const new_messages = JSON.parse(
      localStorage.getItem("new_messages") || "{}"
    );
    if (new_messages[message.from]) {
      new_messages[message.from].push(message.message);
    } else {
      new_messages[message.from] = [message.message];
    }
    localStorage.setItem("new_messages", JSON.stringify(new_messages));
  }

  public getNewMessages() {
    const result = JSON.parse(localStorage.getItem("new_messages") || "{}");
    return result;
  }

  public clearNewMessages(email: string) {
    const new_messages = JSON.parse(
      localStorage.getItem("new_messages") || "{}"
    );
    new_messages[email] = [];
    localStorage.setItem("new_messages", JSON.stringify(new_messages));
  }

  public getMessages(id: string): Observable<MessagesResponseInterface> {
    return this.http.get<MessagesResponseInterface>(
      `${environment.api_url}/messages/list/${id}`,
      { headers: { skip: "loading" } }
    );
  }

  public setViwedMessages(id: string): Observable<MessagesResponseInterface> {
    return this.http.post<MessagesResponseInterface>(
      `${environment.api_url}/messages/viewed/${id}`,
      { headers: { skip: "loading" } }
    );
  }

  public getMessagesUsers(): Observable<UsersMessageResponseInterface> {
    return this.http.get<UsersMessageResponseInterface>(
      `${environment.api_url}/messages/users`,
      { headers: { skip: "loading" } }
    );
  }

  public searchUser(search: string): Observable<UsersMessageResponseInterface> {
    return this.http.get<UsersMessageResponseInterface>(
      `${environment.api_url}/messages/search-user/${search}`,
      { headers: { skip: "loading" } }
    );
  }
}
