import { HttpClient } from "@angular/common/http";
import { EventEmitter, inject, Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { environment } from "../../environments/environment";
import {
  FollowResponseInterface,
  FriendResponseInterface,
} from "../interfaces/friend-interface";

@Injectable({
  providedIn: "root",
})
export class FriendService {
  private http = inject(HttpClient);

  public changeFollowEvent$: EventEmitter<boolean>;

  constructor() {
    this.changeFollowEvent$ = new EventEmitter<boolean>();
  }

  public get(id: string): Observable<FriendResponseInterface> {
    return this.http.get<FriendResponseInterface>(
      `${environment.api_url}/friends/${id}`
    );
  }

  public follow(id: string): Observable<FollowResponseInterface> {
    return this.http.get<FollowResponseInterface>(
      `${environment.api_url}/friends/follow/${id}`
    );
  }

  public changeFollow(id: string): Observable<FollowResponseInterface> {
    return this.http
      .post<FollowResponseInterface>(
        `${environment.api_url}/friends/change-follow/${id}`,
        {}
      )
      .pipe(tap((res) => this.changeFollowEvent$.emit(res.data)));
  }
}
