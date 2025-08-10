import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { Modal } from "../modal/modal";
import { LikeService } from "../../services/like-service";
import { TokenService } from "../../services/token-service";
import { LikeInterface } from "../../interfaces/like-interface";
import { environment } from "../../../environments/environment";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-postagem-likes",
  imports: [Modal, DatePipe, RouterLink],
  templateUrl: "./postagem-likes.html",
  styleUrl: "./postagem-likes.scss",
})
export class PostagemLikes implements OnInit {
  private likeService = inject(LikeService);
  private tokenService = inject(TokenService);

  id = input();
  list_likes = signal<LikeInterface[]>([]);
  likes = computed(() => this.list_likes().length);
  is_liked = computed(
    () =>
      this.list_likes().findIndex(
        (item) => item.user.email == this.tokenService.email
      ) !== -1
  );
  showLikes = signal(false);
  img_url = `${environment.api_url}/user-photo/`;
  now = Date.now();

  public ngOnInit(): void {
    this.likeService.list(this.id() as string).subscribe((res) => {
      if (res && res.data) {
        this.list_likes.update(() => res.data);
      } else {
        this.list_likes.update(() => []);
      }
    });
  }

  public changeLike(): void {
    this.setClickLike();
    this.likeService.change(this.id() as string).subscribe((res) => {
      if (res && res.data) {
        this.list_likes.update(() => res.data);
      } else {
        this.list_likes.update(() => []);
      }
    });
  }

  public setClickLike(): void {
    const index = this.list_likes().findIndex(
      (item) => item.user.email == this.tokenService.email
    );
    if (index === -1) {
      this.list_likes.update(() => [
        ...this.list_likes(),
        { user: this.tokenService.user } as LikeInterface,
      ]);
    } else {
      this.list_likes.update(() =>
        this.list_likes().filter(
          (item) => item.user.email !== this.tokenService.email
        )
      );
    }
  }

  public modalLikes(): void {
    this.showLikes.update((value) => !value);
  }
}
