import { Component, inject, OnInit } from "@angular/core";
import { Logo } from "../../components/logo/logo";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { RegisterService } from "../../services/register-service";
import { ModalService } from "../../services/modal-service";
import { AlertTypes } from "../../interfaces/modal-interface";

@Component({
  selector: "app-register",
  imports: [Logo, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.html",
  styleUrl: "./register.scss",
})
export class Register implements OnInit {
  formRegister!: FormGroup;

  private formBuilder = inject(FormBuilder);
  private registerService = inject(RegisterService);
  private router = inject(Router);
  private modalService = inject(ModalService);

  public ngOnInit(): void {
    this.formRegister = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      name: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  public onSubmit(): void {
    this.formRegister.markAllAsTouched();
    if (this.formRegister.valid) {
      this.registerService
        .register(this.formRegister.value)
        .subscribe((res) => {
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
