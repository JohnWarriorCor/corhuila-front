import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { EntidadExterna } from '../models/entidad-externa';
import { NormaTipo } from '../models/norma-tipo';
import { Norma } from '../models/norma';

@Injectable({
  providedIn: 'root',
})
export class NormaService {
  private url: string = `${environment.URL_BACKEND}/norma`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  userLogeado: String = this.authservice.user.username;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authservice: AuthService
  ) {}

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e: { status: number }): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  obtenerListadoNormas(): Observable<Norma[]> {
    return this.http
      .get<Norma[]>(`${this.url}/obtener-normas`, {
        headers: this.aggAutorizacionHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerEntidadesExternas(): Observable<EntidadExterna[]> {
    return this.http
      .get<EntidadExterna[]>(`${this.url}/obtener-entidades-externas`, {
        headers: this.aggAutorizacionHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerNormasTipo(codigo: number): Observable<NormaTipo[]> {
    return this.http.get<NormaTipo[]>(
      `${this.url}/obtener-normas-tipo/${codigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  registrarNorma(norma: Norma): Observable<number> {
    return this.http.post<number>(`${this.url}/registrar-norma`, norma, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  actualizarNorma(norma: Norma): Observable<number> {
    return this.http.put<number>(`${this.url}/actualizar-norma`, norma, {
      headers: this.aggAutorizacionHeader(),
    });
  }
}
