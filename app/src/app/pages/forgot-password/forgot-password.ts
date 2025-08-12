import { Component, inject, OnInit } from "@angular/core";
import { AlertTypes } from "../../interfaces/modal-interface";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ForgotPasswordService } from "../../services/forgot-password-service";
import { Router, RouterLink } from "@angular/router";
import { ModalService } from "../../services/modal-service";
import { Logo } from "../../components/logo/logo";

@Component({
  selector: "app-forgot-password",
  imports: [Logo, ReactiveFormsModule, RouterLink],
  templateUrl: "./forgot-password.html",
  styleUrl: "./forgot-password.scss",
})
export class ForgotPassword implements OnInit {
  formForgot!: FormGroup;
  formChange!: FormGroup;

  private formBuilder = inject(FormBuilder);
  private forgotService = inject(ForgotPasswordService);
  private router = inject(Router);
  private modalService = inject(ModalService);

  public ngOnInit(): void {
    this.formForgot = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
    this.formChange = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      otp: ["", [Validators.required, Validators.minLength(6)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  public onSubmitForgot(): void {
    this.formForgot.markAllAsTouched();
    if (this.formForgot.valid) {
      this.forgotService.sendEmail(this.formForgot.value).subscribe((res) => {
        if (res && res.error) {
          this.modalService.showAlert(res.error, AlertTypes.ERROR);
        } else {
          this.modalService.showAlert(
            "Email enviado com sucesso!",
            AlertTypes.ERROR
          );
          this.formChange.setValue({
            email: this.formForgot.get("email")?.value,
            otp: "",
            password: "",
          });
        }
      });
    } else {
      this.modalService.showAlert(
        "Preencher os campos corretamente",
        AlertTypes.ERROR
      );
    }
  }

  public onSubmitChange(): void {
    this.formChange.markAllAsTouched();
    if (this.formChange.valid) {
      this.forgotService
        .changePassword(this.formChange.value)
        .subscribe((res) => {
          if (res && res.error) {
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
