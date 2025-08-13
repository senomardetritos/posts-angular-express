import { EventEmitter, inject, Injectable } from "@angular/core";
import {
  LoginResponseInterface,
  UserInterface,
} from "../interfaces/users-interface";
import { WebSocketService } from "./web-socket-service";
import { retry } from "rxjs";
import { MessageService } from "./message-service";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  private webSocketService = inject(WebSocketService);
  private messageService = inject(MessageService);
  public loginEvent$: EventEmitter<LoginResponseInterface>;
  public logoutEvent$: EventEmitter<null>;
  public photoUserEvent$: EventEmitter<null>;

  constructor() {
    this.loginEvent$ = new EventEmitter();
    this.logoutEvent$ = new EventEmitter();
    this.photoUserEvent$ = new EventEmitter();
  }

  public login(user: LoginResponseInterface): void {
    this.webSocketService.connect(user.data.email);
    localStorage.setItem("new_messages", "{}");
    this.webSocketService
      .getMessages()
      .pipe(retry({ count: 1, delay: 1000 }))
      .subscribe((res) => {
        this.messageService.addNewMessage(res);
        this.webSocketService.messageEvent$.emit(res);
      });
    localStorage.setItem("id", user.data.id);
    localStorage.setItem("email", user.data.email);
    localStorage.setItem("name", user.data.name);
    localStorage.setItem("token", user.data.token);
    this.loginEvent$.emit(user);
  }

  public logout(): void {
    this.webSocketService.closeConnection();
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    this.logoutEvent$.emit();
  }

  public isLogged(): boolean {
    return !!localStorage.getItem("token");
  }

  public getUser(): LoginResponseInterface {
    return {
      data: {
        id: this.id,
        email: this.email,
        name: this.name,
        token: this.token,
      },
      error: "",
    };
  }

  get id(): string {
    return localStorage.getItem("id") ?? "";
  }

  get email(): string {
    return localStorage.getItem("email") ?? "";
  }

  get name(): string {
    return localStorage.getItem("name") ?? "";
  }

  set name(value: string) {
    localStorage.setItem("name", value);
    this.loginEvent$.emit(this.getUser());
  }

  get token(): string {
    return localStorage.getItem("token") ?? "";
  }

  get user(): UserInterface {
    return {
      id: parseInt(this.id),
      email: this.email,
      name: this.name,
    } as UserInterface;
  }
}
