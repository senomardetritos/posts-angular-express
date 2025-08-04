import { Component, input } from "@angular/core";
import { PostagemLikes } from "./postagem-likes/postagem-likes";
import { PostagemComments } from "./postagem-comments/postagem-comments";

@Component({
  selector: "app-home-postagem-footer",
  imports: [PostagemLikes, PostagemComments],
  templateUrl: "./home-postagem-footer.html",
  styleUrl: "./home-postagem-footer.scss",
})
export class HomePostagemFooter {
  id = input();
}
