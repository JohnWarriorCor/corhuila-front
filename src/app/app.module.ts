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
import { InstitucionComponent, ModalInstitucion, ModalFormularioInstitucion } from './components/institucion/institucion.component';
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
import { NormaGrupoComponent } from './components/marco-normativo/norma-grupo/norma-grupo.component';
import { NormaComponent, ModalEntidadExterna, ModalFormularioNorma } from './components/marco-normativo/norma/norma.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    NavbarComponent,
    DesarrolloComponent,
    InstitucionComponent,
    PersonaComponent,
    ModalInstitucion,
    ModalCuerpoColegiado,
    ModalEntidadExterna,
    ModalFormularioSede,
    ModalFormularioInstitucion,
    ModalFormularioPersona,
    ModalFormularioFacultad,
    ModalFormularioCuerpoColegiado,
    ModalFormularioIntegranteCuerpoColegiado,
    ModalFormularioRepresentanteLegal,
    ModalFormularioNorma,
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
    NormaComponent
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
    ModalInstitucion,
    ModalCuerpoColegiado,
    ModalEntidadExterna,
    ModalFormularioInstitucion,
    ModalFormularioSede,
    ModalFormularioPersona,
    ModalFormularioFacultad,
    ModalFormularioCuerpoColegiado,
    ModalFormularioIntegranteCuerpoColegiado,
    ModalFormularioRepresentanteLegal,
    ModalFormularioNorma,
  ],
  providers: [DatePipe, {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
