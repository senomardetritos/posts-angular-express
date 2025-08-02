import { Component, input, OnInit, output } from "@angular/core";
import { Modal } from "../modal/modal";

@Component({
  selector: "app-alert",
  imports: [Modal],
  templateUrl: "./alert.html",
  styleUrl: "./alert.scss",
})
export class Alert implements OnInit {
  show = input();
  message = input("");
  type = input("");
  close = output();

  public ngOnInit(): void {}

  public onClose() {
    this.close.emit();
  }
}
