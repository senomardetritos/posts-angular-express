import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MessageService } from "../../../services/message-service";
import { MessageInterface } from "../../../interfaces/message-interface";
import { TokenService } from "../../../services/token-service";
import { DatePipe } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-user-chat",
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: "./user-chat.html",
  styleUrl: "./user-chat.scss",
})
export class UserChat implements OnInit, AfterViewChecked {
  @ViewChild("chatContainer") private chatContainerRef!: ElementRef;
  private messageService = inject(MessageService);
  private tokenService = inject(TokenService);
  private formBuilder = inject(FormBuilder);

  formChat!: FormGroup;
  id = input(0);
  logged_id = parseInt(this.tokenService.id);
  messages: MessageInterface[] = [];

  public ngOnInit(): void {
    this.formChat = this.formBuilder.group({
      message: ["", [Validators.required]],
    });
    if (this.id() > 0) {
      this.messageService.getMessages(this.id().toString()).subscribe((res) => {
        if (res && res.data) {
          this.messages = res.data;
        } else {
          this.messages = [];
        }
      });
    }
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
  }
}
