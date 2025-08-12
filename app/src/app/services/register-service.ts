import { inject, Injectable } from "@angular/core";
import {
  LoginResponseInterface,
  RegisterInterface,
} from "../interfaces/users-interface";
import { HttpClient } from "@angular/common/http";
import { TokenService } from "./token-service";
import { environment } from "../../environments/environment";
import { Observable, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RegisterService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  public register(data: RegisterInterface): Observable<LoginResponseInterface> {
    return this.http
      .post<LoginResponseInterface>(`${environment.api_url}/register`, data)
      .pipe(
        tap((res) => {
          if (res.data) {
            this.tokenService.login(res);
          } else {
            this.tokenService.logout();
          }
        })
      );
  }
}
