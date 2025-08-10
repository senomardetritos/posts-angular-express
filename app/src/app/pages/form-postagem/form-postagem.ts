import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ModalService } from "../../services/modal-service";
import { AlertTypes } from "../../interfaces/modal-interface";
import { PostService } from "../../services/post-service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-form-postagem",
  imports: [ReactiveFormsModule],
  templateUrl: "./form-postagem.html",
  styleUrl: "./form-postagem.scss",
})
export class FormPostagem implements OnInit {
  formPostagem!: FormGroup;

  private formBuilder = inject(FormBuilder);
  private postService = inject(PostService);
  private modalService = inject(ModalService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  public ngOnInit(): void {
    this.formPostagem = this.formBuilder.group({
      id: [""],
      user_id: [""],
      title: ["", [Validators.required, Validators.minLength(6)]],
      text: ["", [Validators.required, Validators.minLength(6)]],
      date: [""],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.activatedRoute.params.subscribe((param: any) => {
      if (param.id) {
        this.formPostagem.get("id")?.setValue(param.id);
        this.postService.get(param.id).subscribe((res) => {
          if (res.error) {
            this.modalService.showAlert(res.error, AlertTypes.ERROR);
          } else {
            this.formPostagem.setValue(res.data);
          }
        });
      } else {
        this.formPostagem.reset();
      }
    });
  }

  public onSubmit(): void {
    this.formPostagem.markAllAsTouched();
    if (this.formPostagem.valid) {
      if (this.formPostagem.get("id")?.value) {
        this.updatePost();
      } else {
        this.addPost();
      }
    } else {
      this.modalService.showAlert(
        "Preencher os campos corretamente",
        AlertTypes.ERROR
      );
    }
  }

  public addPost(): void {
    this.postService.add(this.formPostagem.value).subscribe((res) => {
      if (res.error) {
        this.modalService.showAlert(res.error, AlertTypes.ERROR);
      } else {
        this.modalService.showAlert(
          "Post adicionado com sucesso",
          AlertTypes.SUCCESS
        );
        this.router.navigate(["/minhas-postagens"]);
      }
    });
  }

  public updatePost(): void {
    this.postService.update(this.formPostagem.value).subscribe((res) => {
      if (res.error) {
        this.modalService.showAlert(res.error, AlertTypes.ERROR);
      } else {
        this.modalService.showAlert(
          "Post atualizado com sucesso",
          AlertTypes.SUCCESS
        );
        this.router.navigate(["/minhas-postagens"]);
      }
    });
  }
}
