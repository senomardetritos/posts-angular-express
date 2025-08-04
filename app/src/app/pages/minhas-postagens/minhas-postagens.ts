import { Component, inject, OnInit } from "@angular/core";
import { PostInterface } from "../../interfaces/posts-interface";
import { PostService } from "../../services/post-service";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-minhas-postagens",
  imports: [DatePipe, RouterLink],
  templateUrl: "./minhas-postagens.html",
  styleUrl: "./minhas-postagens.scss",
})
export class MinhasPostagens implements OnInit {
  posts!: PostInterface[];

  private postService = inject(PostService);

  public ngOnInit(): void {
    this.postService.list().subscribe((res) => {
      if (res && res.data) {
        this.posts = res.data;
      }
    });
  }
}
