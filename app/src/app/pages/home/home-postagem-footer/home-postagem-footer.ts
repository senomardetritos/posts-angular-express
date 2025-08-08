import { Component, input } from "@angular/core";
import { PostagemLikes } from "../../../components/postagem-likes/postagem-likes";
import { PostagemComments } from "../../../components/postagem-comments/postagem-comments";

@Component({
  selector: "app-home-postagem-footer",
  imports: [PostagemLikes, PostagemComments],
  templateUrl: "./home-postagem-footer.html",
  styleUrl: "./home-postagem-footer.scss",
})
export class HomePostagemFooter {
  id = input();
}
