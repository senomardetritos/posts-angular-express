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
import { ListUser } from "../../components/right/list-user/list-user";
import { UserInterface } from "../../interfaces/users-interface";
import { TokenService } from "../../services/token-service";

@Component({
  selector: "app-search-user",
  imports: [ReactiveFormsModule, FriendHeader, ListUser],
  templateUrl: "./search-user.html",
  styleUrl: "./search-user.scss",
})
export class SearchUser implements OnInit {
  private formBuilder = inject(FormBuilder);
  private friendService = inject(FriendService);
  private tokenService = inject(TokenService);

  formSearch!: FormGroup;
  friends!: FriendInterface[];
  following!: UserInterface[];
  followers!: UserInterface[];
  showFollowing = true;

  public ngOnInit(): void {
    this.formSearch = this.formBuilder.group({
      search: ["", [Validators.required]],
    });
    this.friendService.get(this.tokenService.id).subscribe((res) => {
      if (res && res.data && res.data.following && res.data.followers) {
        this.following = res.data.following;
        this.followers = res.data.followers;
      } else {
        this.following = [];
        this.followers = [];
      }
    });
  }

  public onSubmit(): void {
    if (this.formSearch.valid) {
      this.friendService
        .search(this.formSearch.get("search")?.value)
        .subscribe((res) => {
          this.friends = res.data;
        });
    } else {
      this.friends = [];
    }
  }

  public clearSearch(): void {
    this.formSearch.get("search")?.setValue("");
    this.friends = [];
  }

  public changeShowFollowing(show: boolean): void {
    this.showFollowing = show;
  }
}
