import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import {
  MessagesResponseInterface,
  UsersMessageResponseInterface,
} from "../interfaces/message-interface";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private http = inject(HttpClient);

  public getMessages(id: string): Observable<MessagesResponseInterface> {
    return this.http.get<MessagesResponseInterface>(
      `${environment.api_url}/messages/list/${id}`
    );
  }

  public getMessagesUsers(): Observable<UsersMessageResponseInterface> {
    return this.http.get<UsersMessageResponseInterface>(
      `${environment.api_url}/messages/users`
    );
  }

  public searchUser(search: string): Observable<UsersMessageResponseInterface> {
    return this.http.get<UsersMessageResponseInterface>(
      `${environment.api_url}/messages/search-user/${search}`
    );
  }
}
