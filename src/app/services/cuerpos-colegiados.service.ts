import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { CuerposColegiados } from '../models/cuerpos-colegiados';
import { FuncionesCuerpoColegiado } from '../models/funciones-cuerpo-colegiado';
import { IntegranteCuerpoColegiado } from '../models/integrante-cuerpo-colegiado';

@Injectable({
  providedIn: 'root',
})
export class CuerposColegiadosService {
  private url: string = `${environment.URL_BACKEND}/cuerpocolegiado`;
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

  obtenerListadoCuerposColegiados(): Observable<CuerposColegiados[]> {
    return this.http
      .get<CuerposColegiados[]>(
        `${this.url}/obtener-listado-cuerpos-colegiados`,
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

  obtenerCuerpoColegiadoCodigoDisponibilidad(): Observable<CuerposColegiados[]> {
    return this.http
      .get<CuerposColegiados[]>(
        `${this.url}/obtener-cuerpos-colegiados-disponibilidad`,
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

  obtenerListadoFuncionesCuerpoColegiado(
    codigo: number
  ): Observable<FuncionesCuerpoColegiado[]> {
    return this.http
      .get<FuncionesCuerpoColegiado[]>(
        `${this.url}/obtener-listado-funciones/${codigo}`,
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

  obtenerListadoIntegrantesCuerpoColegiado(): Observable<
    IntegranteCuerpoColegiado[]
  > {
    return this.http
      .get<IntegranteCuerpoColegiado[]>(
        `${this.url}/obtener-listado-integrantes-cuerpo-colegiado`,
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

  obtenerListadoIntegrantesCuerpoColegiadoCodigo(
    codigo: number
  ): Observable<IntegranteCuerpoColegiado[]> {
    return this.http
      .get<IntegranteCuerpoColegiado[]>(
        `${this.url}/obtener-listado-integrantes/${codigo}`,
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

  registrarCuerposColegiados(
    cuerposColegiados: CuerposColegiados
  ): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-cuerpos-colegiados`,
      cuerposColegiados,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  actualizarCuerposColegiados(
    cuerposColegiados: CuerposColegiados
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-cuerpos-colegiados`,
      cuerposColegiados,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  registrarFuncionesCuerpoColegiado(
    cuerposColegiados: FuncionesCuerpoColegiado
  ): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-funciones-cuerpo-colegiado`,
      cuerposColegiados,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  actualizarFuncionesCuerpoColegiado(
    cuerposColegiados: FuncionesCuerpoColegiado
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-funciones-cuerpo-colegiado`,
      cuerposColegiados,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  registrarIntegrante(
    integranteCuerpoColegiado: IntegranteCuerpoColegiado
  ): Observable<number> {
    return this.http.post<number>(
      `${this.url}/registrar-integrante`,
      integranteCuerpoColegiado,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }

  actualizarIntegrante(
    integranteCuerpoColegiado: IntegranteCuerpoColegiado
  ): Observable<number> {
    return this.http.put<number>(
      `${this.url}/actualizar-integrante`,
      integranteCuerpoColegiado,
      {
        headers: this.aggAutorizacionHeader(),
      }
    );
  }
}
