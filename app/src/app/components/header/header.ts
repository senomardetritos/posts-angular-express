import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { Logo } from "../logo/logo";
import { TokenService } from "../../services/token-service";
import { ActivationEnd, Router, RouterLink } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-header",
  imports: [Logo, RouterLink, ReactiveFormsModule],
  templateUrl: "./header.html",
  styleUrl: "./header.scss",
})
export class Header implements OnInit {
  private tokenService = inject(TokenService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  formSearch!: FormGroup;
  id = this.tokenService.id;
  name = "";
  token = "";
  photo_date = signal(Date.now());
  img_url = computed(() => {
    return `${environment.api_url}/user-photo/${
      this.tokenService.id
    }?date=${this.photo_date()}`;
  });

  public ngOnInit(): void {
    this.formSearch = this.formBuilder.group({
      search: ["", [Validators.required, Validators.minLength(6)]],
    });
    this.name = this.tokenService.name;
    this.token = this.tokenService.token;
    this.tokenService.loginEvent$.subscribe((res) => {
      this.name = res.data.name;
      this.token = res.data.token;
    });
    this.tokenService.logoutEvent$.subscribe(() => {
      this.name = "";
      this.token = "";
      this.photo_date.set(Date.now());
    });
    this.tokenService.photoUserEvent$.subscribe(() => {
      this.photo_date.set(Date.now());
    });
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        this.formSearch
          .get("search")
          ?.setValue(event.snapshot.params?.["search"]);
      }
    });
  }

  public logout(): void {
    this.tokenService.logout();
  }

  public onSubmit(): void {
    this.router.navigate([`/home/${this.formSearch.get("search")?.value}`]);
  }
}
