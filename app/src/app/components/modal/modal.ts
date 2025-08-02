import { Component, input, OnInit } from "@angular/core";

@Component({
  selector: "app-modal",
  imports: [],
  templateUrl: "./modal.html",
  styleUrl: "./modal.scss",
})
export class Modal implements OnInit {
  show = input();

  public ngOnInit(): void {}
}
