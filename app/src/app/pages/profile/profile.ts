import { Component, computed, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ProfileService } from "../../services/profile-service";
import { ModalService } from "../../services/modal-service";
import { AlertTypes } from "../../interfaces/modal-interface";
import { environment } from "../../../environments/environment";
import { TokenService } from "../../services/token-service";

@Component({
  selector: "app-profile",
  imports: [ReactiveFormsModule],
  templateUrl: "./profile.html",
  styleUrl: "./profile.scss",
})
export class Profile implements OnInit {
  private formBuilder = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private modalService = inject(ModalService);
  private tokenService = inject(TokenService);

  formProfile!: FormGroup;
  formPhoto!: FormGroup;
  formPassword!: FormGroup;
  photo_date = signal(Date.now());
  img_url = computed(() => {
    return `${environment.api_url}/user-photo/${
      this.tokenService.id
    }?date=${this.photo_date()}`;
  });

  public ngOnInit(): void {
    this.formProfile = this.formBuilder.group({
      name: ["", [Validators.required]],
    });
    this.formPhoto = this.formBuilder.group({
      photo: [null, [Validators.required]],
    });
    this.formPassword = this.formBuilder.group({
      actual_password: ["", [Validators.required, Validators.minLength(6)]],
      new_password: ["", [Validators.required, Validators.minLength(6)]],
    });
    this.profileService.getProfile().subscribe((res) => {
      if (res && res.data) {
        this.formProfile.get("name")?.setValue(res.data.name);
      } else {
        this.modalService.showAlert(
          "Erro ao carregar o perfil",
          AlertTypes.ERROR
        );
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

  public onSubmitPhoto(): void {
    this.formPhoto.markAllAsTouched();
    if (this.formPhoto.valid) {
      this.profileService.uploadPhoto(this.formPhoto.value).subscribe((res) => {
        if (res.error) {
          this.modalService.showAlert(res.error, AlertTypes.ERROR);
        } else {
          this.modalService.showAlert(
            "Foto alterada com sucesso",
            AlertTypes.SUCCESS
          );
        }
        this.getImage();
      });
    } else {
      this.modalService.showAlert(
        "Escolhar uma foto para fazer o upload",
        AlertTypes.ERROR
      );
    }
  }

  public getImage() {
    this.photo_date.set(Date.now());
    this.tokenService.photoUserEvent$.emit();
    return `${environment.api_url}/user-photo/${
      this.tokenService.id
    }?date=${this.photo_date()}`;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.formPhoto.patchValue({
        photo: event.target.files[0], // Update the form control value
      });
    } else {
      this.formPhoto.patchValue({
        photo: null,
      });
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
