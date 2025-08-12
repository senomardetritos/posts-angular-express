import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MessageService } from "../../services/message-service";
import {
  MessageInterface,
  UserMessageInterface,
} from "../../interfaces/message-interface";
import { UserMessage } from "./user-message/user-message";
import { UserChat } from "./user-chat/user-chat";
import { TokenService } from "../../services/token-service";

@Component({
  selector: "app-messages",
  imports: [UserMessage, UserChat, ReactiveFormsModule],
  templateUrl: "./messages.html",
  styleUrl: "./messages.scss",
})
export class Messages implements OnInit {
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private tokenService = inject(TokenService);

  formUser!: FormGroup;
  isOpen = false;
  token = "";
  list_search: UserMessageInterface[] = [];
  messages_users: UserMessageInterface[] = [];
  messages: MessageInterface[] = [];
  selected_user = signal<UserMessageInterface>({} as UserMessageInterface);

  public ngOnInit(): void {
    this.token = this.tokenService.token;
    this.formUser = this.formBuilder.group({
      search: ["", [Validators.required, Validators.minLength(3)]],
    });
    if (this.token) {
      this.loadMessages();
    }
    this.tokenService.loginEvent$.subscribe((res) => {
      this.token = res.data.token;
      this.loadMessages();
    });
    this.tokenService.logoutEvent$.subscribe(() => {
      this.token = "";
    });
  }

  public loadMessages(): void {
    this.messageService.getMessagesUsers().subscribe((res) => {
      this.messages_users = res.data;
    });
  }

  public onSubmit(): void {
    this.formUser.markAllAsTouched();
    if (this.formUser.valid) {
      this.messageService
        .searchUser(this.formUser.get("search")?.value)
        .subscribe((res) => {
          if (res && res.data) {
            this.list_search = res.data;
          }
        });
    }
  }

  public selectUser(user: UserMessageInterface) {
    this.selected_user.update(() => user);
    this.clearSearch();
  }

  public clearSearch(): void {
    this.formUser.reset();
    this.formUser.clearValidators();
    this.formUser.updateValueAndValidity();
    this.list_search = [];
  }

  public backToMessages(): void {
    this.selected_user.update(() => ({} as UserMessageInterface));
  }

  public openMessages(): void {
    this.isOpen = true;
  }
  public closeMessages(): void {
    this.isOpen = false;
  }
}
