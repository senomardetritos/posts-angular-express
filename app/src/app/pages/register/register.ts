import { Component } from "@angular/core";
import { Logo } from "../../components/logo/logo";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { RegisterService } from "../../services/register-service";
import { AlertService } from "../../services/alert-service";
import { AlertTypes } from "../../interfaces/alert-interface";

@Component({
  selector: "app-register",
  imports: [Logo, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.html",
  styleUrl: "./register.scss",
})
export class Register {
  formRegister!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    private alertService: AlertService
  ) {}

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
            this.alertService.show(res.error, AlertTypes.ERROR);
          } else {
            this.router.navigate(["/home"]);
          }
        });
    } else {
      this.alertService.show(
        "Preencher os campos corretamente",
        AlertTypes.ERROR
      );
    }
  }
}
