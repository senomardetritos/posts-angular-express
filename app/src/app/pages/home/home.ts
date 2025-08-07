import { Component, inject, OnInit } from "@angular/core";
import { PostService } from "../../services/post-service";
import { PostInterface } from "../../interfaces/posts-interface";
import { DatePipe } from "@angular/common";
import { HomePostagemFooter } from "./home-postagem-footer/home-postagem-footer";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-home",
  imports: [DatePipe, HomePostagemFooter, RouterLink],
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class Home implements OnInit {
  private postService = inject(PostService);
  private activatedRoute = inject(ActivatedRoute);

  posts!: PostInterface[];
  search = "";
  img_url = `${environment.api_url}/user-photo/`;
  now = Date.now();

  public ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.activatedRoute.params.subscribe((param: any) => {
      if (param.search) {
        this.search = param.search;
        this.postService.search(param.search).subscribe((res) => {
          if (res && res.data) {
            this.posts = res.data;
          }
        });
      } else {
        this.postService.lasts().subscribe((res) => {
          if (res && res.data) {
            this.posts = res.data;
          }
        });
      }
    });
  }
}
