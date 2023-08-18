import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Sede } from '../models/sede';
import { SedeTipo } from '../models/sede-tipo';

@Injectable({
  providedIn: 'root',
})
export class SedeService {
  private url: string = `${environment.URL_BACKEND}/sede`;
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

  obtenerListadoTiposSedes(): Observable<SedeTipo[]> {
    return this.http
      .get<SedeTipo[]>(`${this.url}/obtener-listado-tipo-sedes`, {
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

  obtenerListadoSedes(): Observable<Sede[]> {
    return this.http
      .get<Sede[]>(`${this.url}/obtener-listado-sedes`, {
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

  registrarSede(sede: Sede): Observable<number> {
    return this.http.post<number>(`${this.url}/registrar-sede`, sede, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  actualizarSede(sede: Sede): Observable<number> {
    return this.http.put<number>(`${this.url}/actualizar-sede`, sede, {
      headers: this.aggAutorizacionHeader(),
    });
  }
}
