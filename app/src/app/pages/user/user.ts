import { Component, inject, OnInit } from "@angular/core";
import { FriendService } from "../../services/friend-service";
import { UserInterface } from "../../interfaces/users-interface";
import { DatePipe } from "@angular/common";
import { PostInterface } from "../../interfaces/posts-interface";
import { environment } from "../../../environments/environment";
import { PostagemComments } from "../../components/postagem-comments/postagem-comments";
import { PostagemLikes } from "../../components/postagem-likes/postagem-likes";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TokenService } from "../../services/token-service";
import { Follow } from "../../components/follow/follow";

@Component({
  selector: "app-user",
  imports: [DatePipe, PostagemComments, PostagemLikes, Follow, RouterLink],
  templateUrl: "./user.html",
  styleUrl: "./user.scss",
})
export class User implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private friendService = inject(FriendService);
  private tokenService = inject(TokenService);

  logged = parseInt(this.tokenService.id);
  id = "";
  user!: UserInterface;
  following!: UserInterface[];
  followers!: UserInterface[];
  posts!: PostInterface[];
  img_url = "";

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

  private loadUser() {
    const user_id = this.id ? this.id : this.tokenService.id;
    this.friendService.get(user_id).subscribe((res) => {
      if (res && res.data && res.data.user) {
        this.user = res.data.user;
        this.following = res.data.following;
        this.followers = res.data.followers;
        this.posts = res.data.posts;
        this.img_url = `${environment.api_url}/user-photo/${
          this.user.id
        }?date=${Date.now()}`;
      }
    });
  }
}
