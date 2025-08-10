import { Component, inject, OnInit } from "@angular/core";
import { FriendService } from "../../services/friend-service";
import { DatePipe } from "@angular/common";
import { PostagemComments } from "../../components/postagem-comments/postagem-comments";
import { PostagemLikes } from "../../components/postagem-likes/postagem-likes";
import { ActivatedRoute } from "@angular/router";
import { TokenService } from "../../services/token-service";
import { FriendInterface } from "../../interfaces/friend-interface";
import { FriendHeader } from "../../components/friend-header/friend-header";

@Component({
  selector: "app-user",
  imports: [DatePipe, PostagemComments, PostagemLikes, FriendHeader],
  templateUrl: "./user.html",
  styleUrl: "./user.scss",
})
export class User implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private friendService = inject(FriendService);
  private tokenService = inject(TokenService);

  id = "";
  friend!: FriendInterface;

  public ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.activatedRoute.params.subscribe((param: any) => {
      this.id = param.user;
      this.loadUser();
    });
    this.friendService.changeFollowEvent$.subscribe(() => {
      this.loadUser();
    });
  }

  public loadUser() {
    const user_id = this.id ? this.id : this.tokenService.id;
    this.friendService.get(user_id).subscribe((res) => {
      if (res && res.data && res.data.user) {
        this.friend = res.data;
      } else {
        this.friend = {} as FriendInterface;
      }
    });
  }
}
