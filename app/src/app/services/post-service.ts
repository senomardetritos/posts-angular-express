import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  PostInterface,
  PostResponseInterface,
  PostsResponseInterface,
} from "../interfaces/posts-interface";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.development";

@Injectable({
  providedIn: "root",
})
export class PostService {
  constructor(private http: HttpClient) {}

  public list(): Observable<PostsResponseInterface> {
    return this.http.get<PostsResponseInterface>(
      `${environment.api_url}/posts`
    );
  }

  public get(id: string): Observable<PostResponseInterface> {
    return this.http.get<PostResponseInterface>(
      `${environment.api_url}/posts/${id}`
    );
  }

  public add(data: PostInterface): Observable<PostResponseInterface> {
    return this.http.post<PostResponseInterface>(
      `${environment.api_url}/posts/add`,
      data
    );
  }

  public update(data: PostInterface): Observable<PostResponseInterface> {
    return this.http.post<PostResponseInterface>(
      `${environment.api_url}/posts/update/${data.id}`,
      data
    );
  }
}
