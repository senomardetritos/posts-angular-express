import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { LikeService } from "../../../../services/like-service";
import { TokenService } from "../../../../services/token-service";
import { LikeInterface } from "../../../../interfaces/like-interface";
import { Modal } from "../../../../components/modal/modal";
import { DatePipe } from "@angular/common";
import { environment } from "../../../../../environments/environment";

@Component({
  selector: "app-postagem-likes",
  imports: [Modal, DatePipe],
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
      }
    });
  }

  public changeLike(): void {
    this.setClickLike();
    this.likeService.change(this.id() as string).subscribe((res) => {
      if (res && res.data) {
        this.list_likes.update(() => res.data);
      }
    });
  }

  public modalLikes(): void {
    this.showLikes.update((value) => !value);
  }

  private setClickLike(): void {
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
}
