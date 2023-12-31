import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { MaterialModules } from './material.modules';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { DesarrolloComponent } from './components/desarrollo/desarrollo.component';
import { InstitucionComponent, ModalVistaInstitucion, ModalFormularioInstitucion } from './components/institucion/institucion.component';
import { PersonaComponent, ModalFormularioPersona } from './components/configuracion/persona/persona.component';
import { EstructuraComponent } from './components/inicio/estructura/estructura.component';
import { ConfiguracionComponent } from './components/inicio/configuracion/configuracion.component';
import { SedeComponent, ModalFormularioSede } from './components/sede/sede.component';
import { FacultadComponent, ModalFormularioFacultad } from './components/facultad/facultad.component';
import { OrganizacionInternaComponent } from './components/inicio/organizacion-interna/organizacion-interna.component';
import { CuerposColegiadosComponent, ModalCuerpoColegiado, ModalFormularioCuerpoColegiado } from './components/cuerpos-colegiados/cuerpos-colegiados.component';
import { RepresentanteLegalComponent, ModalFormularioRepresentanteLegal } from './components/representante-legal/representante-legal.component';
import { AreaAcademiAdmiComponent } from './components/area-academi-admi/area-academi-admi.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { IntegranteCuerpoColegiadoComponent, ModalFormularioIntegranteCuerpoColegiado } from './components/integrante-cuerpo-colegiado/integrante-cuerpo-colegiado.component';
import { NgxPrintModule } from 'ngx-print';
import { NormaGrupoComponent, ModalFormularioNormaGrupo, ModalFormularioGrupo } from './components/marco-normativo/norma-grupo/norma-grupo.component';
import { NormaComponent, ModalVistaNorma, ModalFormularioNorma, ModalFormularioDeroga } from './components/marco-normativo/norma/norma.component';
import { CineComponent } from './components/cine/cine.component';
import { AmplioComponent, ModalFormularioAmplio } from './components/cine/amplio/amplio.component';
import { EspecificoComponent, ModalFormularioEspecifico} from './components/cine/especifico/especifico.component';
import { DetalladoComponent, ModalFormularioDetallado} from './components/cine/detallado/detallado.component';
import { ProgramaComponent, ModalFormularioPrograma, ModalVistaPrograma } from './components/programa/programa.component';
import { FiltroCampoAmplioPipe } from './pipes/filtro-campo-amplio.pipe';
import { FiltroCampoEspecificoPipe } from './pipes/filtro-campo-especifico.pipe';
import { FiltroCampoDetalladoPipe } from './pipes/filtro-campo-detallado.pipe';
import { FiltroGeneralPipe } from './pipes/filtro-general.pipe';
import { FiltroEntidadPipe } from './pipes/filtro-entidad.pipe';
import { FiltroCuerpoColegiadoPipe } from './pipes/filtro-cuerpo-colegiado.pipe';
import { FiltroNormaTipoPipe } from './pipes/filtro-norma-tipo.pipe';
import { FiltroEntidadExternaPipe } from './pipes/filtro-entidad-externa.pipe';
import { FiltroMedioPipe } from './pipes/filtro-medio.pipe';
import { FiltroDerogaPipe } from './pipes/filtro-deroga.pipe';
import { FiltroEntidadInternaPipe } from './pipes/filtro-entidad-interna.pipe';
import { FiltroEstadoSniesPipe } from './pipes/filtro-estado-snies.pipe';
import { FiltroNivelFormacionPipe } from './pipes/filtro-nivel-formacion.pipe';
import { FiltroNivelAcademicoPipe } from './pipes/filtro-nivel-academico.pipe';
import { FiltroModalidadPipe } from './pipes/filtro-modalidad.pipe';
import { FiltroAreaConocimientoPipe } from './pipes/filtro-area-conocimiento.pipe';
import { FiltroSedePipe } from './pipes/filtro-sede.pipe';
import { FiltroSexoBiologicoPipe } from './pipes/filtro-sexo-biologico.pipe';
import { FiltroEstratoPipe } from './pipes/filtro-estrato.pipe';
import { FiltroMunicipioPipe } from './pipes/filtro-municipio.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    NavbarComponent,
    DesarrolloComponent,
    InstitucionComponent,
    PersonaComponent,
    ModalVistaInstitucion,
    ModalCuerpoColegiado,
    ModalVistaNorma,
    ModalFormularioSede,
    ModalFormularioInstitucion,
    ModalFormularioPersona,
    ModalFormularioFacultad,
    ModalFormularioCuerpoColegiado,
    ModalFormularioIntegranteCuerpoColegiado,
    ModalFormularioRepresentanteLegal,
    ModalFormularioNorma,
    ModalFormularioNormaGrupo,
    ModalFormularioGrupo,
    ModalFormularioDeroga,
    ModalFormularioAmplio,
    ModalFormularioEspecifico,
    ModalFormularioDetallado,
    ModalFormularioPrograma,
    ModalVistaPrograma,
    EstructuraComponent,
    ConfiguracionComponent,
    SedeComponent,
    FacultadComponent,
    OrganizacionInternaComponent,
    CuerposColegiadosComponent,
    RepresentanteLegalComponent,
    AreaAcademiAdmiComponent,
    IntegranteCuerpoColegiadoComponent,
    NormaGrupoComponent,
    NormaComponent,
    CineComponent,
    AmplioComponent,
    EspecificoComponent,
    DetalladoComponent,
    ProgramaComponent,
    FiltroCampoAmplioPipe,
    FiltroCampoEspecificoPipe,
    FiltroCampoDetalladoPipe,
    FiltroGeneralPipe,
    FiltroEntidadPipe,
    FiltroCuerpoColegiadoPipe,
    FiltroNormaTipoPipe,
    FiltroEntidadExternaPipe,
    FiltroMedioPipe,
    FiltroDerogaPipe,
    FiltroEntidadInternaPipe,
    FiltroEstadoSniesPipe,
    FiltroNivelFormacionPipe,
    FiltroNivelAcademicoPipe,
    FiltroModalidadPipe,
    FiltroAreaConocimientoPipe,
    FiltroSedePipe,
    FiltroSexoBiologicoPipe,
    FiltroEstratoPipe,
    FiltroMunicipioPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModules,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPrintModule
  ],
  entryComponents: [
    ModalVistaInstitucion,
    ModalCuerpoColegiado,
    ModalVistaNorma,
    ModalFormularioInstitucion,
    ModalFormularioSede,
    ModalFormularioPersona,
    ModalFormularioFacultad,
    ModalFormularioCuerpoColegiado,
    ModalFormularioIntegranteCuerpoColegiado,
    ModalFormularioRepresentanteLegal,
    ModalFormularioNorma,
    ModalFormularioNormaGrupo,
    ModalFormularioGrupo,
    ModalFormularioDeroga,
    ModalFormularioAmplio,
    ModalFormularioEspecifico,
    ModalFormularioDetallado,
    ModalFormularioPrograma,
    ModalVistaPrograma
  ],
  providers: [DatePipe, {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
