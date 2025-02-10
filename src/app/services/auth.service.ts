import { Injectable , inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { appsettings } from '../settings/app.settings';
import { Login } from '../interfaces/Login';
import { Usuario } from '../interfaces/Usuario';
import { ResponseAcceso } from '../interfaces/ResponseAcceso';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private baseUrl: string = appsettings.apiUrl;
  private router = inject(Router);

  constructor() { }

  registrarse(objeto: Usuario): Observable<Usuario> {
       return this.http.post<Usuario>(`${this.baseUrl}Registrarse`, objeto)
  }

  login(correo: string, contrasena: string): Observable<ResponseAcceso> {
    return this.http.post<ResponseAcceso>(`${this.baseUrl}Login`, { correo, contrasena })
  }
  validarToken(token: string): Observable<ResponseAcceso> {
    return this.http.get<ResponseAcceso>(`${this.baseUrl}ValidarToken?token=${token}`)
}
}