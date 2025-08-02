import { inject } from "@angular/core";
import { TokenService } from "../services/token-service";
import { Router } from "@angular/router";

export const authGuard = () => {
  const tokeService = inject(TokenService);
  const router = inject(Router);

  if (tokeService.isLogged()) {
    return true;
  } else {
    router.navigate(["/"]);
    return false;
  }
};
