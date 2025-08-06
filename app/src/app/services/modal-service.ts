import { EventEmitter, Injectable } from "@angular/core";
import { AlertInterface, AlertTypes } from "../interfaces/modal-interface";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  public alertEvent$: EventEmitter<AlertInterface>;

  public isLoading = new Subject<boolean>();

  constructor() {
    this.alertEvent$ = new EventEmitter();
  }

  public showAlert(message: string, type: AlertTypes): void {
    this.alertEvent$.emit({ show: true, message, type });
  }

  public showLoading(): void {
    this.isLoading.next(true);
  }

  public closeLoading(): void {
    this.isLoading.next(false);
  }
}
