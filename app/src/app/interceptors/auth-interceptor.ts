import { HttpInterceptorFn } from "@angular/common/http";
import { TokenService } from "../services/token-service";
import { inject } from "@angular/core";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  if (tokenService.isLogged()) {
    req = req.clone({
      setHeaders: {
        Authorization: "Bearer " + tokenService.token,
      },
    });
  }
  return next(req);
};
