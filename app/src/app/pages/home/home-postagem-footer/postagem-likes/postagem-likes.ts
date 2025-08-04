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

  private likeService = inject(LikeService);
  private tokenService = inject(TokenService);

  public ngOnInit(): void {
    this.likeService.list(this.id() as string).subscribe((res) => {
      if (res && res.data) {
        this.list_likes.update(() => res.data);
      }
    });
  }

  public changeLike(): void {
    const data = {
      date: new Date(),
    };
    this.likeService
      .change(this.id() as string, data as LikeInterface)
      .subscribe((res) => {
        if (res && res.data) {
          this.list_likes.update(() => res.data);
        }
      });
  }

  public modalLikes(): void {
    this.showLikes.update((value) => !value);
  }
}
