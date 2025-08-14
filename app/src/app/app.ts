import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Header } from "./components/header/header";
import { Menu } from "./components/menu/menu";
import { Alert } from "./components/alert/alert";
import { AlertTypes } from "./interfaces/modal-interface";
import { ModalService } from "./services/modal-service";
import { Loading } from "./components/loading/loading";
import { Right } from "./components/right/right";
import { Messages } from "./components/messages/messages";
import { TokenService } from "./services/token-service";
import { WebSocketService } from "./services/web-socket-service";
import { MessageService } from "./services/message-service";

@Component({
  selector: "app-root",
  imports: [Header, Menu, Right, Messages, Alert, Loading, RouterOutlet],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App implements OnInit {
  protected title = "app";
  showAlert = false;
  messageAlert = "";
  typeAlert: string = AlertTypes.SUCCESS;

  private modalService = inject(ModalService);
  private tokenService = inject(TokenService);
  private webSocketService = inject(WebSocketService);
  private messageService = inject(MessageService);

  public ngOnInit(): void {
    this.modalService.alertEvent$.subscribe((res) => {
      this.showAlert = res.show;
      this.messageAlert = res.message;
      this.typeAlert = res.type;
    });
    if (this.tokenService.isLogged()) {
      this.webSocketService.connect(this.tokenService.email);
      localStorage.setItem("new_messages", "{}");
      this.webSocketService.getMessages().subscribe((res) => {
        this.messageService.addNewMessage(res);
        this.webSocketService.messageEvent$.emit(res);
      });
    } else {
      this.webSocketService.closeConnection();
    }
  }

  public closeAlert(): void {
    this.showAlert = false;
  }
}
