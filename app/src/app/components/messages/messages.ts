import {
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from "@angular/core";
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
import { WebSocketService } from "../../services/web-socket-service";

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
  private webSocketService = inject(WebSocketService);

  formUser!: FormGroup;
  startOpen = input(false);
  isOpen = false;
  buttonClose = output();
  token = "";
  list_search: UserMessageInterface[] = [];
  messages_users: UserMessageInterface[] = [];
  messages: MessageInterface[] = [];
  selected_user = signal<UserMessageInterface>({} as UserMessageInterface);
  new_messages = 0;

  public ngOnInit(): void {
    this.token = this.tokenService.token;
    this.formUser = this.formBuilder.group({
      search: ["", [Validators.required, Validators.minLength(3)]],
    });
    if (this.token) {
      this.loadMessages();
      this.webSocketService.messageEvent$.subscribe(() => {
        this.loadMessages();
      });
    }
    this.tokenService.loginEvent$.subscribe((res) => {
      this.token = res.data.token;
      this.loadMessages();
    });
    this.tokenService.logoutEvent$.subscribe(() => {
      this.token = "";
      this.isOpen = false;
      this.selected_user.update(() => ({} as UserMessageInterface));
    });
    this.isOpen = this.startOpen();
  }

  public loadMessages(): void {
    this.messageService.getMessagesUsers().subscribe((res) => {
      this.messages_users = res.data;
    });
    this.new_messages = Object.values<string[]>(
      this.messageService.getNewMessages()
    ).reduce((acc, item: string[]) => acc + item.length, 0);
  }

  public onSubmit(): void {
    this.formUser.markAllAsTouched();
    if (this.formUser.valid) {
      this.messageService
        .searchUser(this.formUser.get("search")?.value)
        .subscribe((res) => {
          if (res && res.data) {
            this.list_search = res.data;
          } else {
            this.list_search = [];
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
    this.loadMessages();
  }

  public openMessages(): void {
    this.isOpen = true;
    this.loadMessages();
  }
  public closeMessages(): void {
    this.isOpen = false;
    this.loadMessages();
    this.buttonClose.emit();
  }
}
