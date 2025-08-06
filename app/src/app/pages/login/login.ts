import { Component, inject, OnInit } from "@angular/core";
import { Logo } from "../../components/logo/logo";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { LoginService } from "../../services/login-service";
import { Router, RouterLink } from "@angular/router";
import { ModalService } from "../../services/modal-service";
import { AlertTypes } from "../../interfaces/modal-interface";

@Component({
  selector: "app-login",
  imports: [Logo, ReactiveFormsModule, RouterLink],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class Login implements OnInit {
  formLogin!: FormGroup;

  private formBuilder = inject(FormBuilder);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private modalService = inject(ModalService);

  public ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  public onSubmit(): void {
    this.formLogin.markAllAsTouched();
    if (this.formLogin.valid) {
      this.loginService.login(this.formLogin.value).subscribe((res) => {
        if (res.error) {
          this.modalService.showAlert(res.error, AlertTypes.ERROR);
        } else {
          this.router.navigate(["/home"]);
        }
      });
    } else {
      this.modalService.showAlert(
        "Preencher os campos corretamente",
        AlertTypes.ERROR
      );
    }
  }
}
