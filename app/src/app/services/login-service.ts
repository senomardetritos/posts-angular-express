import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
  LoginInterface,
  LoginResponseInterface,
} from "../interfaces/users-interface";
import { Observable, tap } from "rxjs";
import { TokenService } from "./token-service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

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
