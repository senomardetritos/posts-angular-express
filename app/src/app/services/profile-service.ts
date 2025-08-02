import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TokenService } from "./token-service";
import { Observable, tap } from "rxjs";
import {
  ChangePasswordInterface,
  ProfileInterface,
  ProfileResponseInterface,
} from "../interfaces/users-interface";
import { environment } from "../../environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  public getProfile(): Observable<ProfileResponseInterface> {
    return this.http.get<ProfileResponseInterface>(
      `${environment.api_url}/users/get`
    );
  }

  public updateProfile(
    data: ProfileInterface
  ): Observable<ProfileResponseInterface> {
    return this.http
      .post<ProfileResponseInterface>(
        `${environment.api_url}/users/update`,
        data
      )
      .pipe(
        tap((res) => {
          if (res) {
            this.tokenService.name = data.name;
          }
        })
      );
  }

  public changePassword(
    data: ChangePasswordInterface
  ): Observable<ProfileResponseInterface> {
    return this.http.post<ProfileResponseInterface>(
      `${environment.api_url}/users/change-password`,
      data
    );
  }
}
