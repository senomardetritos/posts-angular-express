import { Component, inject, OnInit } from "@angular/core";
import { FriendInterface } from "../../interfaces/friend-interface";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FriendService } from "../../services/friend-service";
import { FriendHeader } from "../../components/friend-header/friend-header";

@Component({
  selector: "app-search-user",
  imports: [ReactiveFormsModule, FriendHeader],
  templateUrl: "./search-user.html",
  styleUrl: "./search-user.scss",
})
export class SearchUser implements OnInit {
  private formBuilder = inject(FormBuilder);
  private friendService = inject(FriendService);

  formSearch!: FormGroup;
  friends!: FriendInterface[];

  public ngOnInit(): void {
    this.formSearch = this.formBuilder.group({
      search: ["", [Validators.required]],
    });
  }

  public onSubmit(): void {
    if (this.formSearch.valid) {
      this.friendService
        .search(this.formSearch.get("search")?.value)
        .subscribe((res) => {
          this.friends = res.data;
        });
    }
  }
}
