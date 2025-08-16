import { Component, inject, OnInit } from "@angular/core";
import { TokenService } from "../../services/token-service";
import { RouterLink } from "@angular/router";
import { Messages } from "../messages/messages";
import { MessageService } from "../../services/message-service";
import { WebSocketService } from "../../services/web-socket-service";

@Component({
  selector: "app-menu",
  imports: [Messages, RouterLink],
  templateUrl: "./menu.html",
  styleUrl: "./menu.scss",
})
export class Menu implements OnInit {
  private tokenService = inject(TokenService);
  private messageService = inject(MessageService);
  private webSocketService = inject(WebSocketService);

  token = "";
  isOpenMessage = false;
  new_messages = 0;

  public ngOnInit(): void {
    this.token = this.tokenService.token;
    if (this.token) {
      this.tokenService.loginEvent$.subscribe((res) => {
        this.token = res.data.token;
      });
      this.tokenService.logoutEvent$.subscribe(() => {
        this.token = "";
      });
      this.loadMessages();
      this.webSocketService.messageEvent$.subscribe(() => {
        console.log("Menu event message");
        this.loadMessages();
      });
    }
  }

  public loadMessages(): void {
    this.new_messages = Object.values<string[]>(
      this.messageService.getNewMessages()
    ).reduce((acc, item: string[]) => acc + item.length, 0);
  }

  public showMessages() {
    this.isOpenMessage = !this.isOpenMessage;
  }

  public closeMessages() {
    this.isOpenMessage = false;
  }

  public logout(): void {
    this.tokenService.logout();
  }
}
