import { Component, inject } from "@angular/core";
import { Modal } from "../modal/modal";
import { Subject } from "rxjs";
import { ModalService } from "../../services/modal-service";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-loading",
  imports: [Modal, AsyncPipe],
  templateUrl: "./loading.html",
  styleUrl: "./loading.scss",
})
export class Loading {
  private modalService = inject(ModalService);
  show: Subject<boolean> = this.modalService.isLoading;
}
