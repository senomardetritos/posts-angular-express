import { Component, input } from "@angular/core";

@Component({
  selector: "app-modal",
  imports: [],
  templateUrl: "./modal.html",
  styleUrl: "./modal.scss",
})
export class Modal {
  show = input();
}
