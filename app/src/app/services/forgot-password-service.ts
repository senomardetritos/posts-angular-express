import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { TokenService } from "./token-service";
import {
  ForgotPasswordInterface,
  LoginResponseInterface,
  OTPPasswordInterface,
} from "../interfaces/users-interface";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ForgotPasswordService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  public sendEmail(
    data: ForgotPasswordInterface
  ): Observable<LoginResponseInterface> {
    return this.http.post<LoginResponseInterface>(
      `${environment.api_url}/send-email-forgot-password`,
      data
    );
  }

  public changePassword(
    data: OTPPasswordInterface
  ): Observable<LoginResponseInterface> {
    return this.http
      .post<LoginResponseInterface>(
        `${environment.api_url}/change-forgot-password`,
        data
      )
      .pipe(
        tap((res) => {
          if (res.data) {
            this.tokenService.login(res);
          } else {
            this.tokenService.login({} as LoginResponseInterface);
          }
        })
      );
  }
}
