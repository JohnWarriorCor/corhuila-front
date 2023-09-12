import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { TipoIdentificacion } from '../models/tipo-identificacion';
import { SexoBilogico } from '../models/sexo-bilogico';
import { GrupoSanguineo } from '../models/grupo-sanguineo';
import { EstadoCivil } from '../models/estado-civil';
import { ComunidadNegra } from '../models/comunidad-negra';
import { DiscapacidadTipo } from '../models/discapacidad-tipo';
import { Estrato } from '../models/estrato';
import { GrupoEtnico } from '../models/grupo-etnico';
import { PersonaDiscapacidad } from '../models/persona-discapacidad';
import { PuebloIndigena } from '../models/pueblo-indigena';
import { TalentoExepcional } from '../models/talento-exepcional';
import { Persona } from '../models/persona';

@Injectable({
  providedIn: 'root',
})
export class PersonaService {
  private url: string = `${environment.URL_BACKEND}/persona`;
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

  obtenerPersonas(): Observable<Persona[]> {
    return this.http
      .get<Persona[]>(`${this.url}/obtener-personas`, {
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

  obtenerPersonaIdentificacion(id: string): Observable<Persona[]> {
    return this.http
      .get<Persona[]>(`${this.url}/obtener-persona-identificacion/${id}`, {
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

  obtenerTipoId(): Observable<TipoIdentificacion[]> {
    return this.http
      .get<TipoIdentificacion[]>(`${this.url}/obtener-tipo-id`, {
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

  obtenerGenero(): Observable<SexoBilogico[]> {
    return this.http
      .get<SexoBilogico[]>(`${this.url}/obtener-sexo-biologico`, {
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

  obtenerRh(): Observable<GrupoSanguineo[]> {
    return this.http
      .get<GrupoSanguineo[]>(`${this.url}/obtener-grupo-sanguineo`, {
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

  obtenerEstadoCivil(): Observable<EstadoCivil[]> {
    return this.http
      .get<EstadoCivil[]>(`${this.url}/obtener-estado-civil`, {
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

  obtenerComunidadesNegras(): Observable<ComunidadNegra[]> {
    return this.http
      .get<ComunidadNegra[]>(`${this.url}/obtener-comunidades-negras`, {
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

  obtenerTiposDiscapacidades(): Observable<DiscapacidadTipo[]> {
    return this.http
      .get<DiscapacidadTipo[]>(`${this.url}/obtener-tipos-discapacidades`, {
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

  obtenerEstratos(): Observable<Estrato[]> {
    return this.http
      .get<Estrato[]>(`${this.url}/obtener-estratos`, {
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

  obtenerGruposEtnicos(): Observable<GrupoEtnico[]> {
    return this.http
      .get<GrupoEtnico[]>(`${this.url}/obtener-grupos-etnicos`, {
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

  obtenerPersonaDiscapacidades(): Observable<PersonaDiscapacidad[]> {
    return this.http
      .get<PersonaDiscapacidad[]>(`${this.url}/obtener-personas-discapacidad`, {
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

  obtenerPueblosIndigenas(): Observable<PuebloIndigena[]> {
    return this.http
      .get<PuebloIndigena[]>(`${this.url}/obtener-pueblos-indigenas`, {
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

  obtenerTalentosExcepcionales(): Observable<TalentoExepcional[]> {
    return this.http
      .get<TalentoExepcional[]>(`${this.url}/obtener-talentos-excepcionales`, {
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

  registrarPersona(persona: Persona): Observable<number> {
    return this.http.post<number>(`${this.url}/registrar-persona`, persona, {
      headers: this.aggAutorizacionHeader(),
    });
  }

  actualizarPersona(persona: Persona): Observable<number> {
    return this.http.put<number>(`${this.url}/actualizar-persona`, persona, {
      headers: this.aggAutorizacionHeader(),
    });
  }
}
