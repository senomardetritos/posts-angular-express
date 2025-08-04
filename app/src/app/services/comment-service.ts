import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
  CommentInterface,
  CommentsResponseInterface,
} from "../interfaces/comment-interface";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommentService {
  private http = inject(HttpClient);

  public list(id: string): Observable<CommentsResponseInterface> {
    return this.http.get<CommentsResponseInterface>(
      `${environment.api_url}/comments/${id}`
    );
  }

  public add(
    id: string,
    data: CommentInterface
  ): Observable<CommentsResponseInterface> {
    return this.http.post<CommentsResponseInterface>(
      `${environment.api_url}/comments/add/${id}`,
      data
    );
  }
}
