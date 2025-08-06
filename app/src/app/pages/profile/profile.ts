import { Component, inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ProfileService } from "../../services/profile-service";
import { ModalService } from "../../services/modal-service";
import { AlertTypes } from "../../interfaces/modal-interface";

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
  private modalService = inject(ModalService);

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
            this.modalService.showAlert(res.error, AlertTypes.ERROR);
          } else {
            this.modalService.showAlert(
              "Dados alterados com sucesso",
              AlertTypes.SUCCESS
            );
          }
        });
    } else {
      this.modalService.showAlert(
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
            this.modalService.showAlert(res.error, AlertTypes.ERROR);
          } else {
            this.modalService.showAlert(
              "Senha alterada com sucesso",
              AlertTypes.SUCCESS
            );
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
