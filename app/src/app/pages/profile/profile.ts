import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ProfileService } from "../../services/profile-service";
import { AlertService } from "../../services/alert-service";
import { AlertTypes } from "../../interfaces/alert-interface";

@Component({
  selector: "app-profile",
  imports: [ReactiveFormsModule],
  templateUrl: "./profile.html",
  styleUrl: "./profile.scss",
})
export class Profile implements OnInit {
  formProfile!: FormGroup;
  formPassword!: FormGroup;

  private formBuilder = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private alertService = inject(AlertService);

  public ngOnInit(): void {
    this.formProfile = this.formBuilder.group({
      name: ["", [Validators.required]],
    });
    this.formPassword = this.formBuilder.group({
      actual_password: ["", [Validators.required, Validators.minLength(6)]],
      new_password: ["", [Validators.required, Validators.minLength(6)]],
    });
    this.profileService.getProfile().subscribe((res) => {
      if (res && res.data) {
        this.formProfile.get("name")?.setValue(res.data.name);
      }
    });
  }

  public onSubmitProfile(): void {
    this.formProfile.markAllAsTouched();
    if (this.formProfile.valid) {
      this.profileService
        .updateProfile(this.formProfile.value)
        .subscribe((res) => {
          if (res.error) {
            this.alertService.show(res.error, AlertTypes.ERROR);
          } else {
            this.alertService.show(
              "Dados alterados com sucesso",
              AlertTypes.SUCCESS
            );
          }
        });
    } else {
      this.alertService.show(
        "Preencher os campos corretamente",
        AlertTypes.ERROR
      );
    }
  }

  public onSubmitPassword(): void {
    this.formPassword.markAllAsTouched();
    if (this.formPassword.valid) {
      this.profileService
        .changePassword(this.formPassword.value)
        .subscribe((res) => {
          if (res.error) {
            this.alertService.show(res.error, AlertTypes.ERROR);
          } else {
            this.alertService.show(
              "Senha alterada com sucesso",
              AlertTypes.SUCCESS
            );
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
