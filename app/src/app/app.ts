import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Header } from "./components/header/header";
import { Menu } from "./components/menu/menu";
import { Alert } from "./components/alert/alert";
import { AlertTypes } from "./interfaces/modal-interface";
import { ModalService } from "./services/modal-service";
import { Loading } from "./components/loading/loading";

@Component({
  selector: "app-root",
  imports: [Header, Menu, Alert, Loading, RouterOutlet],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App implements OnInit {
  protected title = "app";
  showAlert = false;
  messageAlert = "";
  typeAlert: string = AlertTypes.SUCCESS;

  private modalService = inject(ModalService);

  public ngOnInit(): void {
    this.modalService.alertEvent$.subscribe((res) => {
      this.showAlert = res.show;
      this.messageAlert = res.message;
      this.typeAlert = res.type;
    });
  }

  public closeAlert(): void {
    this.showAlert = false;
  }
}
