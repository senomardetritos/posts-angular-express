import { inject } from "@angular/core";
import { TokenService } from "../services/token-service";
import { Router } from "@angular/router";

export const loggedGuard = () => {
  const tokeService = inject(TokenService);
  const router = inject(Router);

  if (tokeService.isLogged()) {
    router.navigate(["/home"]);
    return false;
  } else {
    return true;
  }
};
