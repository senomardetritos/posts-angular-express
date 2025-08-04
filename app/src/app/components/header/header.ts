import { Component, inject, OnInit } from "@angular/core";
import { Logo } from "../logo/logo";
import { TokenService } from "../../services/token-service";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-header",
  imports: [Logo, RouterLink],
  templateUrl: "./header.html",
  styleUrl: "./header.scss",
})
export class Header implements OnInit {
  name = "";
  token = "";
  private tokenService = inject(TokenService);

  public ngOnInit(): void {
    this.name = this.tokenService.name;
    this.token = this.tokenService.token;
    this.tokenService.loginEvent$.subscribe((res) => {
      this.name = res.data.name;
      this.token = res.data.token;
    });
    this.tokenService.logoutEvent$.subscribe(() => {
      this.name = "";
      this.token = "";
    });
  }

  public logout(): void {
    this.tokenService.logout();
  }
}
