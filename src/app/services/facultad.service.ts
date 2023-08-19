import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Sede } from '../models/sede';
import { SedeTipo } from '../models/sede-tipo';
import { Facultad } from '../models/facultad';

@Injectable({
  providedIn: 'root',
})
export class FacultadService {
  private url: string = `${environment.URL_BACKEND}/facultad`;
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

  obtenerListadoFacultades(): Observable<Facultad[]> {
    return this.http
      .get<Facultad[]>(`${this.url}/obtener-listado-facultades`, {
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

  registrarFacultad(facultad: Facultad): Observable<number> {
    return this.http.post<number>(`${this.url}/registrar-facultad`, facultad, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  actualizarFacultad(facultad: Facultad): Observable<number> {
    return this.http.put<number>(`${this.url}/actualizar-facultad`, facultad, {
      headers: this.aggAutorizacionHeader(),
    });
  }
}
