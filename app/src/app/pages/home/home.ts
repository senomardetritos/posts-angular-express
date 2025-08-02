import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { PostService } from "../../services/post-service";
import { PostInterface } from "../../interfaces/posts-interface";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-home",
  imports: [RouterLink, DatePipe],
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class Home implements OnInit {
  posts!: PostInterface[];

  constructor(private postService: PostService) {}

  public ngOnInit(): void {
    this.postService.list().subscribe((res) => {
      if (res && res.data) {
        this.posts = res.data;
      }
    });
  }
}
