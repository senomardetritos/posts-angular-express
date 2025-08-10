import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { TokenService } from "./token-service";
import { Observable, tap } from "rxjs";
import {
  ChangePasswordInterface,
  ProfileInterface,
  ProfileResponseInterface,
  UserPhotoInterface,
} from "../interfaces/users-interface";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

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
          if (res && res.data) {
            this.tokenService.name = data.name;
          } else {
            this.tokenService.name = "";
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

  public uploadPhoto(
    data: UserPhotoInterface
  ): Observable<ProfileResponseInterface> {
    const formData = new FormData();
    formData.append("photo", data.photo, data.photo.name);
    return this.http.post<ProfileResponseInterface>(
      `${environment.api_url}/users/upload`,
      formData
    );
  }
}
