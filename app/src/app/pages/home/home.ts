import { Component, inject, OnInit } from "@angular/core";
import { PostService } from "../../services/post-service";
import { PostInterface } from "../../interfaces/posts-interface";
import { DatePipe } from "@angular/common";
import { HomePostagemFooter } from "./home-postagem-footer/home-postagem-footer";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { environment } from "../../../environments/environment";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-home",
  imports: [DatePipe, HomePostagemFooter, RouterLink, ReactiveFormsModule],
  templateUrl: "./home.html",
  styleUrl: "./home.scss",
})
export class Home implements OnInit {
  private postService = inject(PostService);
  private activatedRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  formSearch!: FormGroup;
  posts!: PostInterface[];
  search = "";
  img_url = `${environment.api_url}/user-photo/`;
  now = Date.now();

  public ngOnInit(): void {
    this.formSearch = this.formBuilder.group({
      search: ["", [Validators.required, Validators.minLength(6)]],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.activatedRoute.params.subscribe((param: any) => {
      if (param.search) {
        this.search = param.search;
        this.formSearch.get("search")?.setValue(param.search);
        this.postService.search(param.search).subscribe((res) => {
          if (res && res.data) {
            this.posts = res.data;
          } else {
            this.posts = [];
          }
        });
      } else {
        this.postService.lasts().subscribe((res) => {
          if (res && res.data) {
            this.posts = res.data;
          } else {
            this.posts = [];
          }
        });
      }
    });
  }

  public onSubmit(): void {
    this.router.navigate([`/home/${this.formSearch.get("search")?.value}`]);
  }
}
