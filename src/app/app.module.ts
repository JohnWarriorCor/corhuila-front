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
import { InstitucionComponent, ModalInstitucion } from './components/institucion/institucion.component';
import { PersonaComponent } from './components/configuracion/persona/persona.component';
import { EstructuraComponent } from './components/inicio/estructura/estructura.component';
import { ConfiguracionComponent } from './components/inicio/configuracion/configuracion.component';
import { SedeComponent } from './components/sede/sede.component';
import { FacultadComponent } from './components/facultad/facultad.component';
import { OrganizacionInternaComponent } from './components/inicio/organizacion-interna/organizacion-interna.component';
import { CuerposColegiadosComponent, ModalCuerpoColegiado } from './components/cuerpos-colegiados/cuerpos-colegiados.component';
import { RepresentanteLegalComponent } from './components/representante-legal/representante-legal.component';
import { AreaAcademiAdmiComponent } from './components/area-academi-admi/area-academi-admi.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { IntegranteCuerpoColegiadoComponent } from './components/integrante-cuerpo-colegiado/integrante-cuerpo-colegiado.component';
import { NgxPrintModule } from 'ngx-print';
import { NormaGrupoComponent } from './components/marco-normativo/norma-grupo/norma-grupo.component';
import { NormaComponent, ModalEntidadExterna } from './components/marco-normativo/norma/norma.component';

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
    ModalEntidadExterna
  ],
  providers: [DatePipe, {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
