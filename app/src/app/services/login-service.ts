import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  LoginInterface,
  LoginResponseInterface,
} from "../interfaces/users-interface";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment.development";
import { TokenService } from "./token-service";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public login(data: LoginInterface): Observable<LoginResponseInterface> {
    return this.http
      .post<LoginResponseInterface>(`${environment.api_url}/login`, data)
      .pipe(
        tap((res) => {
          if (res.data) {
            this.tokenService.login(res);
          }
        })
      );
  }
}
