import { Component, input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { AlertService } from "../../services/alert-service";
import { AlertTypes } from "../../interfaces/alert-interface";
import { PostService } from "../../services/post-service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-form-postagem",
  imports: [ReactiveFormsModule],
  templateUrl: "./form-postagem.html",
  styleUrl: "./form-postagem.scss",
})
export class FormPostagem {
  isNewPost: boolean = true;
  formPostagem!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.formPostagem = this.formBuilder.group({
      id: [""],
      user: [""],
      title: ["", [Validators.required, Validators.minLength(6)]],
      text: ["", [Validators.required, Validators.minLength(6)]],
      date: [""],
    });

    this.activatedRoute.params.subscribe((param: any) => {
      if (param.id) {
        this.formPostagem.get("id")?.setValue(param.id);
        this.postService.get(param.id).subscribe((res) => {
          if (res.error) {
            this.alertService.show(res.error, AlertTypes.ERROR);
          } else {
            this.formPostagem.setValue(res.data);
            this.isNewPost = false;
          }
        });
      }
    });
  }

  public onSubmit(): void {
    this.formPostagem.markAllAsTouched();
    if (this.formPostagem.valid) {
      if (this.isNewPost) {
        this.addPost();
      } else {
        this.updatePost();
      }
    } else {
      this.alertService.show(
        "Preencher os campos corretamente",
        AlertTypes.ERROR
      );
    }
  }

  private addPost(): void {
    this.formPostagem.get("date")?.setValue(new Date());
    this.postService.add(this.formPostagem.value).subscribe((res) => {
      if (res.error) {
        this.alertService.show(res.error, AlertTypes.ERROR);
      } else {
        this.alertService.show(
          "Post adicionado com sucesso",
          AlertTypes.SUCCESS
        );
        this.router.navigate(["/home"]);
      }
    });
  }

  private updatePost(): void {
    this.postService.update(this.formPostagem.value).subscribe((res) => {
      if (res.error) {
        this.alertService.show(res.error, AlertTypes.ERROR);
      } else {
        this.alertService.show(
          "Post atualizado com sucesso",
          AlertTypes.SUCCESS
        );
        this.router.navigate(["/home"]);
      }
    });
  }
}
