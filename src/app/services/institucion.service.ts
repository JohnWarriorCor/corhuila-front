import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { CaracterAcademico } from '../models/caracter-academico';
import { NaturalezaJuridica } from '../models/naturaleza-juridica';
import { Sector } from '../models/sector';
import { Institucion } from '../models/institucion';

@Injectable({
  providedIn: 'root',
})
export class InstitucionService {
  private url: string = `${environment.URL_BACKEND}/institucion`;
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

  obtenerListadoCaracterAcademico(): Observable<CaracterAcademico[]> {
    return this.http
      .get<CaracterAcademico[]>(
        `${this.url}/obtener-listado-caracter-academico`,
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

  obtenerListadoNaturalezaJuridica(): Observable<NaturalezaJuridica[]> {
    return this.http
      .get<NaturalezaJuridica[]>(
        `${this.url}/obtener-listado-naturaleza-juridica`,
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

  obtenerListadoSector(): Observable<Sector[]> {
    return this.http
      .get<Sector[]>(`${this.url}/obtener-listado-sector`, {
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

  obtenerListadoInstitucion(): Observable<Institucion[]> {
    return this.http
      .get<Institucion[]>(`${this.url}/obtener-listado-institucion`, {
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

  obtenerInstitucion(): Observable<Institucion[]> {
    return this.http
      .get<Institucion[]>(`${this.url}/obtener-institucion`, {
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

  registrarInstitucion(institucion: Institucion): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-institucion`,
      institucion,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarInstitucion(institucion: Institucion): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-institucion`,
      institucion,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
