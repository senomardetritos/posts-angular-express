import { Component, computed, input, OnInit, signal } from "@angular/core";
import { Modal } from "../../../../components/modal/modal";
import { CommentService } from "../../../../services/comment-service";
import { TokenService } from "../../../../services/token-service";
import { CommentInterface } from "../../../../interfaces/comment-interface";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AlertService } from "../../../../services/alert-service";
import { DatePipe } from "@angular/common";
import { AlertTypes } from "../../../../interfaces/alert-interface";

@Component({
  selector: "app-postagem-comments",
  imports: [Modal, ReactiveFormsModule, DatePipe],
  templateUrl: "./postagem-comments.html",
  styleUrl: "./postagem-comments.scss",
})
export class PostagemComments implements OnInit {
  id = input();
  list_comments = signal<CommentInterface[]>([]);
  comments = computed(() => this.list_comments().length);
  showComments = signal(false);
  formComment!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    private tokenService: TokenService,
    private alertService: AlertService
  ) {}

  public ngOnInit(): void {
    this.formComment = this.formBuilder.group({
      id: [""],
      post: [""],
      user: [""],
      date: [""],
      comment: ["", [Validators.required, Validators.minLength(6)]],
    });
    this.commentService.list(this.id() as string).subscribe((res) => {
      if (res && res.data) {
        this.list_comments.update((value) => res.data);
      }
    });
  }
  public onSubmit(): void {
    this.formComment.markAllAsTouched();
    if (this.formComment.valid) {
      const data: any = {
        comment: this.formComment.get("comment")?.value,
        date: new Date(),
      };
      this.commentService.add(this.id() as string, data).subscribe((res) => {
        if (res && res.data) {
          this.list_comments.update((value) => res.data);
          this.alertService.show(
            "Comentário enviado com sucesso",
            AlertTypes.SUCCESS
          );
          this.formComment.get("comment")?.setValue("");
          this.formComment.get("comment")?.markAsUntouched();
        } else {
          this.alertService.show(
            res.error ?? "Erro ao enviar comentário",
            AlertTypes.ERROR
          );
        }
      });
    }
  }

  public modalComments(): void {
    this.showComments.update((value) => !value);
  }
}
