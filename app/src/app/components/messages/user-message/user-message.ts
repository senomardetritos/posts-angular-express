import { Component, inject, input, OnInit, signal } from "@angular/core";
import { UserMessageInterface } from "../../../interfaces/message-interface";
import { environment } from "../../../../environments/environment";
import { NewWebSocketMessageInteface } from "../../../interfaces/web-socket-inteface";
import { MessageService } from "../../../services/message-service";
import { WebSocketService } from "../../../services/web-socket-service";

@Component({
  selector: "app-user-message",
  imports: [],
  templateUrl: "./user-message.html",
  styleUrl: "./user-message.scss",
})
export class UserMessage implements OnInit {
  private messageService = inject(MessageService);
  private webSocketService = inject(WebSocketService);

  user = input<UserMessageInterface>({} as UserMessageInterface);
  img_url = `${environment.api_url}/user-photo/`;
  now = Date.now();
  new_messages: NewWebSocketMessageInteface[] = [];
  qtd_new_messages = signal(0);
  last_message = signal("");

  public ngOnInit(): void {
    this.webSocketService.messageEvent$.subscribe(() => {
      this.setQtdNewMessages();
    });
    this.setQtdNewMessages();
    this.setLastMessages();
  }

  public setQtdNewMessages() {
    const messages = this.messageService.getNewMessages()[this.user().email];
    const qtd = messages?.length;
    this.qtd_new_messages.update(() => qtd);
  }

  public setLastMessages() {
    const messages = this.messageService.getNewMessages()[this.user().email];
    const last_message = messages ? messages.reverse()[0] : "";
    messages?.reverse();
    this.last_message.update(() => last_message);
  }
}
