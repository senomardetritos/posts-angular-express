import { Component, inject, input, OnChanges, OnInit } from "@angular/core";
import { FriendService } from "../../services/friend-service";

@Component({
  selector: "app-follow",
  imports: [],
  templateUrl: "./follow.html",
  styleUrl: "./follow.scss",
})
export class Follow implements OnInit, OnChanges {
  private friendService = inject(FriendService);

  id = input(0);
  follow = false;

  public ngOnInit(): void {
    this.getFollow();
  }

  public ngOnChanges(): void {
    this.getFollow();
  }

  public changeFollow() {
    this.friendService.changeFollow(this.id().toString()).subscribe((res) => {
      this.follow = res.data;
    });
  }

  private getFollow() {
    if (this.id() > 0) {
      this.friendService.follow(this.id().toString()).subscribe((res) => {
        this.follow = res.data;
      });
    }
  }
}
