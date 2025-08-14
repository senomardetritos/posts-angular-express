import { EventEmitter, Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Observable, retry } from "rxjs";
import { WebSocketMessageInteface } from "../interfaces/web-socket-inteface";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private socket$!: WebSocketSubject<WebSocketMessageInteface>;
  public messageEvent$!: EventEmitter<WebSocketMessageInteface>;
  public connect(email: string): void {
    if (!this.socket$ || this.socket$.closed) {
      const url = `${environment.ws_url}?email=${email}`;
      this.socket$ = webSocket(url);
      this.socket$.pipe(retry({ count: 1, delay: 1000 }));
      this.messageEvent$ = new EventEmitter<WebSocketMessageInteface>();
    }
  }
  public sendMessage(message: WebSocketMessageInteface): void {
    if (this.socket$) {
      this.socket$.next(message);
    } else {
      console.log("Socket está fechado");
    }
  }
  public getMessages(): Observable<WebSocketMessageInteface> {
    if (this.socket$) {
      return this.socket$.asObservable();
    } else {
      return new Observable(); // Return an empty observable if not connected
    }
  }
  public closeConnection(): void {
    if (this.socket$) {
      this.socket$.complete();
    } else {
      console.log("Socket está fechado");
    }
  }
}
