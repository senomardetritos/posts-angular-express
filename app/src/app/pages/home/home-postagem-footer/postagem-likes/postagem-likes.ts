import { Component, computed, input, OnInit, signal } from "@angular/core";
import { LikeService } from "../../../../services/like-service";
import { TokenService } from "../../../../services/token-service";
import { LikeInterface } from "../../../../interfaces/like-interface";
import { Modal } from "../../../../components/modal/modal";

@Component({
  selector: "app-postagem-likes",
  imports: [Modal],
  templateUrl: "./postagem-likes.html",
  styleUrl: "./postagem-likes.scss",
})
export class PostagemLikes implements OnInit {
  id = input();
  list_likes = signal<LikeInterface[]>([]);
  likes = computed(() => this.list_likes().length);
  is_liked = computed(
    () =>
      this.list_likes().findIndex(
        (item) => item.user == this.tokenService.email
      ) !== -1
  );
  showLikes = signal(false);

  constructor(
    private likeService: LikeService,
    private tokenService: TokenService
  ) {}

  public ngOnInit(): void {
    this.likeService.list(this.id() as string).subscribe((res) => {
      if (res && res.data) {
        this.list_likes.update((value) => res.data);
      }
    });
  }

  public changeLike(): void {
    const data: any = {
      date: new Date(),
    };
    this.likeService.change(this.id() as string, data).subscribe((res) => {
      if (res && res.data) {
        this.list_likes.update((value) => res.data);
      }
    });
  }

  public modalLikes(): void {
    this.showLikes.update((value) => !value);
  }
}
