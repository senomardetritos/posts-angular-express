import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MessageService } from "../../../services/message-service";
import {
  MessageInterface,
  UserMessageInterface,
} from "../../../interfaces/message-interface";
import { TokenService } from "../../../services/token-service";
import { DatePipe } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebSocketService } from "../../../services/web-socket-service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-user-chat",
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: "./user-chat.html",
  styleUrl: "./user-chat.scss",
})
export class UserChat implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild("chatContainer") private chatContainerRef!: ElementRef;
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private tokenService = inject(TokenService);
  private webSocketService = inject(WebSocketService);

  formChat!: FormGroup;
  user = input<UserMessageInterface>({} as UserMessageInterface);
  logged_id = parseInt(this.tokenService.id);
  messages: MessageInterface[] = [];
  messageEvent!: Subscription;

  public ngOnInit(): void {
    this.formChat = this.formBuilder.group({
      message: ["", [Validators.required]],
    });
    if (this.user().id > 0) {
      this.messageService
        .getMessages(this.user().id.toString())
        .subscribe((res) => {
          if (res && res.data) {
            this.messages = res.data;
            this.setViewedMessages();
          } else {
            this.messages = [];
          }
        });
      this.messageEvent = this.webSocketService.messageEvent$.subscribe(
        (res) => {
          if (this.user().email == res.from) {
            this.addMessage({
              id: 10,
              user_id: this.user().id,
              name: this.user().name,
              message: res.message,
              date: new Date(),
            });
            this.setViewedMessages();
          }
        }
      );
    }
  }

  public ngOnDestroy(): void {
    console.log("OnDestroy");
    this.messageEvent.unsubscribe();
  }

  public setViewedMessages() {
    console.log("setViewedMessages");
    this.messageService
      .setViwedMessages(this.user().id.toString())
      .subscribe((res) => {
        if (res && res.data) {
          this.messageService.clearNewMessages(this.user().email);
        } else {
          this.messages = [];
        }
      });
  }

  public ngAfterViewChecked(): void {
    if (this.messages.length > 0) {
      this.chatContainerRef.nativeElement.scrollTop =
        this.chatContainerRef.nativeElement.scrollHeight;
    } else {
      this.chatContainerRef.nativeElement.scrollTop = 0;
    }
  }

  public onSubmit(): void {
    if (this.formChat.valid) {
      this.webSocketService.sendMessage({
        from: this.tokenService.email,
        to: this.user().email,
        message: this.formChat.get("message")?.value,
      });
      const last_id =
        this.messages.length > 0 ? this.messages.reverse()[0].id : 0;
      this.messages.reverse();
      this.addMessage({
        id: last_id + 1,
        user_id: parseInt(this.tokenService.id),
        name: this.tokenService.name,
        message: this.formChat.get("message")?.value,
        date: new Date(),
      });
    } else {
      this.formChat.get("message")?.markAsUntouched();
    }
  }

  public addMessage(message: MessageInterface) {
    this.messages.push(message);
    this.formChat.reset();
  }
}
