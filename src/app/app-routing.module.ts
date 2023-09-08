import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { DesarrolloComponent } from './components/desarrollo/desarrollo.component';
import { InstitucionComponent } from './components/institucion/institucion.component';
import { PersonaComponent } from './components/configuracion/persona/persona.component';
import { EstructuraComponent } from './components/inicio/estructura/estructura.component';
import { ConfiguracionComponent } from './components/inicio/configuracion/configuracion.component';
import { SedeComponent } from './components/sede/sede.component';
import { FacultadComponent } from './components/facultad/facultad.component';
import { OrganizacionInternaComponent } from './components/inicio/organizacion-interna/organizacion-interna.component';
import { CuerposColegiadosComponent } from './components/cuerpos-colegiados/cuerpos-colegiados.component';
import { RepresentanteLegalComponent } from './components/representante-legal/representante-legal.component';
import { IntegranteCuerpoColegiadoComponent } from './components/integrante-cuerpo-colegiado/integrante-cuerpo-colegiado.component';

const routes: Routes = [
  //COMPONENTES DEL SISTEMA
  { path: 'login', component: LoginComponent },

  { path: 'inicio', component: InicioComponent },
  { path: 'estructura', component: EstructuraComponent },
  { path: 'configuracion', component: ConfiguracionComponent },
  { path: 'organizacion-interna', component: OrganizacionInternaComponent },

  { path: 'institucion', component: InstitucionComponent },
  { path: 'sede', component: SedeComponent },
  { path: 'facultad', component: FacultadComponent },

  { path: 'cuerpos-colegiados', component: CuerposColegiadosComponent },
  { path: 'integrantes-cuerpos-colegiados', component: IntegranteCuerpoColegiadoComponent },

  { path: 'representante-legal', component: RepresentanteLegalComponent },

  { path: 'persona', component: PersonaComponent },

  { path: 'desarrollo', component: DesarrolloComponent },

  //REDIRECCIONAMIENTO COMOPONENTE POR DEFECTO PARA RUTAS INEXISTENTES EN EL NAVEGADOR
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: '**', pathMatch: 'full', redirectTo: '/login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
