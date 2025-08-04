import { Component, input, output } from "@angular/core";
import { Modal } from "../modal/modal";

@Component({
  selector: "app-alert",
  imports: [Modal],
  templateUrl: "./alert.html",
  styleUrl: "./alert.scss",
})
export class Alert {
  show = input();
  message = input("");
  type = input("");
  closeAlert = output();

  public onClose() {
    this.closeAlert.emit();
  }
}
