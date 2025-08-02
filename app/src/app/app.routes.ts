import { Routes } from "@angular/router";
import { Login } from "./pages/login/login";
import { Home } from "./pages/home/home";
import { authGuard } from "./guard/auth-guard";
import { Register } from "./pages/register/register";
import { Profile } from "./pages/profile/profile";
import { FormPostagem } from "./pages/form-postagem/form-postagem";

export const routes: Routes = [
  { path: "", component: Login },
  { path: "register", component: Register },
  { path: "profile", component: Profile, canActivate: [authGuard] },
  { path: "home", component: Home, canActivate: [authGuard] },
  {
    path: "form-postagem",
    component: FormPostagem,
    canActivate: [authGuard],
  },
  {
    path: "form-postagem/:id",
    component: FormPostagem,
    canActivate: [authGuard],
  },
];
