import { EventEmitter, Injectable } from "@angular/core";
import {
  LoginResponseInterface,
  UserInterface,
} from "../interfaces/users-interface";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  public loginEvent$: EventEmitter<LoginResponseInterface>;
  public logoutEvent$: EventEmitter<null>;

  constructor() {
    this.loginEvent$ = new EventEmitter();
    this.logoutEvent$ = new EventEmitter();
  }

  public login(user: LoginResponseInterface): void {
    localStorage.setItem("email", user.data.email);
    localStorage.setItem("name", user.data.name);
    localStorage.setItem("token", user.data.token);
    this.loginEvent$.emit(user);
  }
  public logout(): void {
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
    };
  }
}
