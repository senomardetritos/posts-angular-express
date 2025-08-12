import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
  LoginInterface,
  LoginResponseInterface,
} from "../interfaces/users-interface";
import { Observable, tap } from "rxjs";
import { TokenService } from "./token-service";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  /**
   * Realiza o login do usuário enviando credenciais para o endpoint de autenticação
   * e processa a resposta para gerenciar a sessão do usuário.
   **/
  public login(data: LoginInterface): Observable<LoginResponseInterface> {
    // Envia requisição POST para o endpoint /login com as credenciais
    return this.http
      .post<LoginResponseInterface>(`${environment.api_url}/login`, data)
      .pipe(
        // Processa a resposta usando operadores RxJS pipe/tap:
        tap((res) => {
          // Em caso de sucesso (res.data existe)
          if (res.data) {
            // Armazena os tokens de autenticação via TokenService
            this.tokenService.login(res);
          } else {
            // Limpa a sessão existente passando um objeto vazio para TokenService
            this.tokenService.logout();
          }
        })
      );
  }
}
