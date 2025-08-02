import { Component, OnInit } from "@angular/core";
import { Logo } from "../../components/logo/logo";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { LoginService } from "../../services/login-service";
import { Router, RouterLink } from "@angular/router";
import { AlertService } from "../../services/alert-service";
import { AlertTypes } from "../../interfaces/alert-interface";

@Component({
  selector: "app-login",
  imports: [Logo, ReactiveFormsModule, RouterLink],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class Login implements OnInit {
  formLogin!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private alertService: AlertService
  ) {}

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
