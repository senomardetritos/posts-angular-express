import { Component, input } from "@angular/core";
import { UserMessageInterface } from "../../../interfaces/message-interface";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-user-message",
  imports: [],
  templateUrl: "./user-message.html",
  styleUrl: "./user-message.scss",
})
export class UserMessage {
  user = input<UserMessageInterface>({} as UserMessageInterface);
  img_url = `${environment.api_url}/user-photo/`;
  now = Date.now();
}
