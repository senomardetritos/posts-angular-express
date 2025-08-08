import { Component, inject, input, OnChanges } from "@angular/core";
import { FriendInterface } from "../../interfaces/friend-interface";
import { Follow } from "../follow/follow";
import { RouterLink } from "@angular/router";
import { TokenService } from "../../services/token-service";
import { DatePipe } from "@angular/common";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-friend-header",
  imports: [Follow, RouterLink, DatePipe],
  templateUrl: "./friend-header.html",
  styleUrl: "./friend-header.scss",
})
export class FriendHeader implements OnChanges {
  private tokenService = inject(TokenService);

  friend = input<FriendInterface>({} as FriendInterface);
  logged = parseInt(this.tokenService.id);
  img_url = `${environment.api_url}/user-photo/0`;

  public ngOnChanges(): void {
    if (this.friend()) {
      this.img_url = `${environment.api_url}/user-photo/${
        this.friend().user.id
      }?date=${Date.now}`;
    }
  }
}
