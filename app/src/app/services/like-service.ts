import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
  LikeInterface,
  LikesResponseInterface,
} from "../interfaces/like-interface";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class LikeService {
  private http = inject(HttpClient);

  public list(id: string): Observable<LikesResponseInterface> {
    return this.http.get<LikesResponseInterface>(
      `${environment.api_url}/likes/${id}`
    );
  }

  public change(
    id: string,
    data: LikeInterface
  ): Observable<LikesResponseInterface> {
    return this.http.post<LikesResponseInterface>(
      `${environment.api_url}/likes/change/${id}`,
      data
    );
  }
}
