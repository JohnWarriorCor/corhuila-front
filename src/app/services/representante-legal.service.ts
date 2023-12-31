import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { RepresentanteLegal } from './../models/representante-legal';

@Injectable({
  providedIn: 'root',
})
export class RepresentanteLegalService {
  private url: string = `${environment.URL_BACKEND}/representantelegal`;
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

  obtenerListadoRepresentanteLegal(): Observable<RepresentanteLegal[]> {
    return this.http
      .get<RepresentanteLegal[]>(
        `${this.url}/obtener-listado-representante-legal`,
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

  registrarRepresentanteLegal(
    representanteLegal: RepresentanteLegal
  ): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-representante-legal`,
      representanteLegal,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  actualizarRepresentanteLegal(
    representanteLegal: RepresentanteLegal
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-representante-legal`,
      representanteLegal,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }
}
