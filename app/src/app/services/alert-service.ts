import { EventEmitter, Injectable } from "@angular/core";
import { AlertInterface, AlertTypes } from "../interfaces/alert-interface";

@Injectable({
  providedIn: "root",
})
export class AlertService {
  public alertEvent$: EventEmitter<AlertInterface>;

  constructor() {
    this.alertEvent$ = new EventEmitter();
  }

  public show(message: string, type: AlertTypes): void {
    this.alertEvent$.emit({ show: true, message, type });
  }
}
