import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { Modal } from "../../../../components/modal/modal";
import { CommentService } from "../../../../services/comment-service";
import { CommentInterface } from "../../../../interfaces/comment-interface";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ModalService } from "../../../../services/modal-service";
import { DatePipe } from "@angular/common";
import { AlertTypes } from "../../../../interfaces/modal-interface";
import { TokenService } from "../../../../services/token-service";
import { UserInterface } from "../../../../interfaces/users-interface";

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
  user!: UserInterface;
  showComments = signal(false);
  formComment!: FormGroup;

  private formBuilder = inject(FormBuilder);
  private commentService = inject(CommentService);
  private modalService = inject(ModalService);
  private tokenService = inject(TokenService);

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
        this.list_comments.update(() => res.data);
      }
    });
    this.user = this.tokenService.user;
  }
  public onSubmit(): void {
    this.formComment.markAllAsTouched();
    if (this.formComment.valid) {
      const data = {
        comment: this.formComment.get("comment")?.value,
      };
      this.list_comments.update(() => [
        ...this.list_comments(),
        { ...data, user: this.tokenService.user } as CommentInterface,
      ]);
      this.commentService
        .add(this.id() as string, data as CommentInterface)
        .subscribe((res) => {
          if (res && res.data) {
            this.list_comments.update(() => res.data);
            this.modalService.showAlert(
              "Comentário enviado com sucesso",
              AlertTypes.SUCCESS
            );
            this.formComment.get("comment")?.setValue("");
            this.formComment.get("comment")?.markAsUntouched();
          } else {
            this.modalService.showAlert(
              res.error ?? "Erro ao enviar comentário",
              AlertTypes.ERROR
            );
          }
        });
    }
  }

  public deleteComment(id: string) {
    this.commentService.delete(id).subscribe((res) => {
      if (res && res.data) {
        this.list_comments.update(() => res.data);
        this.modalService.showAlert(
          "Comentário excluido com sucesso",
          AlertTypes.SUCCESS
        );
      } else {
        this.modalService.showAlert(
          res.error ?? "Erro ao excluir comentário",
          AlertTypes.ERROR
        );
      }
    });
  }

  public modalComments(): void {
    this.showComments.update((value) => !value);
  }
}
