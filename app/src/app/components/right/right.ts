import { Component, inject, OnInit } from "@angular/core";
import { TokenService } from "../../services/token-service";
import { FriendService } from "../../services/friend-service";
import { UserInterface } from "../../interfaces/users-interface";
import { environment } from "../../../environments/environment";
import { RouterLink } from "@angular/router";
import { ListUser } from "./list-user/list-user";

@Component({
  selector: "app-right",
  imports: [RouterLink, ListUser],
  templateUrl: "./right.html",
  styleUrl: "./right.scss",
})
export class Right implements OnInit {
  private tokenService = inject(TokenService);
  private friendService = inject(FriendService);

  token = "";
  following!: UserInterface[];
  followers!: UserInterface[];
  img_url = `${environment.api_url}/user-photo/`;
  now = Date.now();

  public ngOnInit(): void {
    this.token = this.tokenService.token;
    this.tokenService.loginEvent$.subscribe((res) => {
      this.token = res.data.token;
      this.loadUser();
    });
    this.tokenService.logoutEvent$.subscribe(() => {
      this.token = "";
    });
    this.friendService.changeFollowEvent$.subscribe(() => {
      this.loadUser();
    });
    this.loadUser();
  }

  public loadUser() {
    this.friendService.get(this.tokenService.id).subscribe((res) => {
      if (res && res.data && res.data.following && res.data.followers) {
        this.following = res.data.following;
        this.followers = res.data.followers;
      } else {
        this.following = [];
        this.followers = [];
      }
    });
  }
}
