import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Header } from "./components/header/header";
import { Menu } from "./components/menu/menu";
import { Alert } from "./components/alert/alert";
import { AlertTypes } from "./interfaces/alert-interface";
import { AlertService } from "./services/alert-service";

@Component({
  selector: "app-root",
  imports: [Header, Menu, Alert, RouterOutlet],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App implements OnInit {
  protected title = "app";
  showAlert = false;
  messageAlert = "";
  typeAlert: string = AlertTypes.SUCCESS;

  private alertService = inject(AlertService);

  public ngOnInit(): void {
    this.alertService.alertEvent$.subscribe((res) => {
      this.showAlert = res.show;
      this.messageAlert = res.message;
      this.typeAlert = res.type;
    });
  }

  public closeAlert(): void {
    this.showAlert = false;
  }
}
