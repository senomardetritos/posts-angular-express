import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PostService } from "../../services/post-service";
import { PostInterface } from "../../interfaces/posts-interface";
import { DatePipe } from "@angular/common";
import { HomePostagemFooter } from "./home-postagem-footer/home-postagem-footer";

@Component({
  selector: "app-home",
  imports: [DatePipe, HomePostagemFooter],
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class Home implements OnInit {
  posts!: PostInterface[];

  constructor(private postService: PostService) {}

  public ngOnInit(): void {
    this.postService.firsts().subscribe((res) => {
      if (res && res.data) {
        this.posts = res.data;
      }
    });
  }
}
