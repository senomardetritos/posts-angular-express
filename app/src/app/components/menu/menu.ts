import { Component, inject, OnInit } from "@angular/core";
import { TokenService } from "../../services/token-service";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-menu",
  imports: [RouterLink],
  templateUrl: "./menu.html",
  styleUrl: "./menu.scss",
})
export class Menu implements OnInit {
  token = "";
  private tokenService = inject(TokenService);

  public ngOnInit(): void {
    this.token = this.tokenService.token;
    this.tokenService.loginEvent$.subscribe((res) => {
      this.token = res.data.token;
    });
    this.tokenService.logoutEvent$.subscribe(() => {
      this.token = "";
    });
  }

  public logout(): void {
    this.tokenService.logout();
  }
}
