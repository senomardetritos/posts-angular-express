import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommentsResponseInterface } from "../interfaces/comment-interface";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class CommentService {
  constructor(private http: HttpClient) {}

  public list(id: string): Observable<CommentsResponseInterface> {
    return this.http.get<CommentsResponseInterface>(
      `${environment.api_url}/comments/${id}`
    );
  }

  public add(
    id: string,
    data: CommentsResponseInterface
  ): Observable<CommentsResponseInterface> {
    return this.http.post<CommentsResponseInterface>(
      `${environment.api_url}/comments/add/${id}`,
      data
    );
  }
}
