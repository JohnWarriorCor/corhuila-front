import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { CineDetallado } from '../models/cine-detallado';
import { CineEspecifico } from '../models/cine-especifico';
import { CineAmplio } from '../models/cine-amplio';

@Injectable({
  providedIn: 'root',
})
export class ClasificacionCineService {
  private url: string = `${environment.URL_BACKEND}/cine`;
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

  obtenerListadoClasificacionCineAmplio(): Observable<CineAmplio[]> {
    return this.http
      .get<CineAmplio[]>(`${this.url}/obtener-clasificacion-cine-amplio`, {
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

  obtenerListadoClasificacionCineEspecifico(): Observable<CineEspecifico[]> {
    return this.http
      .get<CineEspecifico[]>(
        `${this.url}/obtener-clasificacion-cine-especifico`,
        {
          headers: this.aggAutorizacionHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerListadoClasificacionCineDetallado(): Observable<CineDetallado[]> {
    return this.http
      .get<CineDetallado[]>(
        `${this.url}/obtener-clasificacion-cine-detallado`,
        {
          headers: this.aggAutorizacionHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerListadoEspecificoAmplio(codigo: number): Observable<CineEspecifico[]> {
    return this.http
      .get<CineEspecifico[]>(
        `${this.url}/obtener-listado-cine-especifico-amplio/${codigo}`,
        {
          headers: this.aggAutorizacionHeader(),
        }
      )
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  obtenerListadoCineDetallado(codigo: number): Observable<CineDetallado[]> {
    return this.http
      .get<CineDetallado[]>(`${this.url}/obtener-listado-cine/${codigo}`, {
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

  registrarCineAmplio(cineAmplio: CineAmplio): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-cine-amplio`,
      cineAmplio,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  actualizarCineAmplio(cineAmplio: CineAmplio): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-cine-amplio`,
      cineAmplio,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  registrarCineEspecifico(cineEspecifico: CineEspecifico): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-cine-especifico`,
      cineEspecifico,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  actualizarCineEspecifico(cineEspecifico: CineEspecifico): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-cine-especifico`,
      cineEspecifico,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  registrarCineDetallado(cineDetallado: CineDetallado): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-cine-detallado`,
      cineDetallado,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  actualizarCineDetallado(cineDetallado: CineDetallado): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-cine-detallado`,
      cineDetallado,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }
}
