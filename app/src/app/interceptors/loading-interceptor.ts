/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ModalService } from "../services/modal-service";
import { finalize, Observable } from "rxjs";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private modalService = inject(ModalService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.headers.get("skip") === "loading") {
      return next.handle(req);
    }
    this.modalService.showLoading();
    return next
      .handle(req)
      .pipe(finalize(() => this.modalService.closeLoading()));
  }
}
