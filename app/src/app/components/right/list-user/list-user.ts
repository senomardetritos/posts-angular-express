import { Component, computed, input, signal } from "@angular/core";
import { UserInterface } from "../../../interfaces/users-interface";
import { environment } from "../../../../environments/environment";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { Modal } from "../../modal/modal";

@Component({
  selector: "app-list-user",
  imports: [DatePipe, RouterLink, Modal],
  templateUrl: "./list-user.html",
  styleUrl: "./list-user.scss",
})
export class ListUser {
  users = input<UserInterface[]>([]);
  title = input<string>("");
  filter_users = computed(() => this.users()?.slice(0, 3));
  see_more = computed(() => this.users()?.length > this.filter_users()?.length);
  img_url = `${environment.api_url}/user-photo/`;
  now = Date.now();
  showModal = signal(false);
  public onShowModal(): void {
    this.showModal.set(true);
  }
  public onCloseModal(): void {
    this.showModal.set(false);
  }
}
