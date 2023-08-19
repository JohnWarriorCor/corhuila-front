import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Pais } from 'src/app/models/pais';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { AuthService } from 'src/app/services/auth.service';
import { Departamento } from 'src/app/models/departamento';
import { Municipio } from 'src/app/models/municipio';
import { TipoIdentificacion } from 'src/app/models/tipo-identificacion';
import { PersonaService } from 'src/app/services/persona.service';
import { SexoBilogico } from 'src/app/models/sexo-bilogico';
import { GrupoSanguineo } from 'src/app/models/grupo-sanguineo';
import { EstadoCivil } from '../../../models/estado-civil';
import { GrupoEtnico } from '../../../models/grupo-etnico';
import { ComunidadNegra } from '../../../models/comunidad-negra';
import { Estrato } from '../../../models/estrato';
import { DiscapacidadTipo } from '../../../models/discapacidad-tipo';
import { PersonaDiscapacidad } from '../../../models/persona-discapacidad';
import { PuebloIndigena } from '../../../models/pueblo-indigena';
import { TalentoExepcional } from '../../../models/talento-exepcional';
import { CabecerasCentrosPoblados } from 'src/app/models/cabeceras-centros-poblados';
import { Persona } from 'src/app/models/persona';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
})
export class PersonaComponent {
  editar: boolean = false;
  nameFile: string = 'Archivo: pdf';
  paises: Pais[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  paisLocal: Pais[] = [];
  tipoIndentificacion: TipoIdentificacion[] = [];
  generos: SexoBilogico[] = [];
  gruposSanguineos: GrupoSanguineo[] = [];
  estadosCivil: EstadoCivil[] = [];
  grupoEtnico: GrupoEtnico[] = [];
  comunidadNegra: ComunidadNegra[] = [];
  estrato: Estrato[] = [];
  discapacidadTipo: DiscapacidadTipo[] = [];
  personaDiscapacidad: PersonaDiscapacidad[] = [];
  puebloIndigena: PuebloIndigena[] = [];
  talentoExepcional: TalentoExepcional[] = [];
  listadoCcp: CabecerasCentrosPoblados[] = [];
  listadoPerosna: Persona[] = [];
  listadoMunicipios: Municipio[] = [];

  formPersona!: FormGroup;

  dataSource = new MatTableDataSource<Persona>([]);
  displayedColumns: string[] = [
    'index',
    'nit',
    'ies',
    'padre',
    'nombre',
    'creacion',
    'existencia',
    'estado',
    'pdf',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    public ubicacionService: UbicacionService,
    public personaService: PersonaService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerPaises();
      this.obtenerPaisLocal();
      this.obtenerTipoId();
      this.obtenerGenero();
      this.obtenerRh();
      this.obtenerEstadoCivil();
      this.obtenerComunidadesNegras();
      this.obtenerTiposDiscapacidades();
      this.obtenerEstratos();
      this.obtenerGruposEtnicos();
      this.obtenerPersonaDiscapacidades();
      this.obtenerPueblosIndigenas();
      this.obtenerTalentosExcepcionales();
      this.crearFormPersona();
      this.obtenerPersonas();
      this.obtenerMunicipios();
    }
  }

  private crearFormPersona(): void {
    this.formPersona = this.formBuilder.group({
      //DATOS PERSONALES
      codigo: new FormControl(''),
      identificacion: new FormControl('', Validators.required),
      identificacionTipo: new FormControl('', Validators.required),
      fechaExpedicion: new FormControl('', Validators.required),
      lugarExpedicion: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      apellido: new FormControl('', Validators.required),
      sexo: new FormControl('', Validators.required),
      fechaNacimiento: new FormControl('', Validators.required),
      grupoSanguineo: new FormControl('', Validators.required),
      estadoCivil: new FormControl('', Validators.required),
      //DATOS DE CONTACTO
      pais: new FormControl('', Validators.required),
      departamento: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      ccp: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      barrio: new FormControl('', Validators.required),
      estrato: new FormControl('', Validators.required),
      telefonoMovil: new FormControl('', Validators.required),
      telefonoFijo: new FormControl('', Validators.required),
      correoPersonal: new FormControl('', Validators.required),
      //DATOS CARACTERIZACION
      grupoEtnico: new FormControl('', Validators.required),
      puebloIndigena: new FormControl(''),
      comunidadNegra: new FormControl(''),
      personaDiscapacidad: new FormControl('', Validators.required),
      discapacidadTipo: new FormControl(''),
      talentoExepcional: new FormControl('', Validators.required),
      //FAMILIAR DE CONTACTO
      nombreFamiliar: new FormControl('', Validators.required),
      telefonoFamiliar: new FormControl('', Validators.required),
      residenciaFamiliar: new FormControl(''),
      direccionFamiliar: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  generarPersona(): void {
    let persona: Persona = new Persona();
    persona.codigo = this.formPersona.get('codigo')!.value;
    persona.identificacion = this.formPersona.get('identificacion')!.value;
    let tipoId: TipoIdentificacion = new TipoIdentificacion();
    tipoId.codigo = this.formPersona.get('identificacionTipo')!.value;
    persona.tipoId = tipoId;
    persona.fechaExpedicion = this.formPersona.get('fechaExpedicion')!.value;
    persona.lugarExpedicion = this.formPersona.get('lugarExpedicion')!.value;
    persona.nombre = this.formPersona.get('nombre')!.value;
    persona.apellido = this.formPersona.get('apellido')!.value;
    let genero: SexoBilogico = new SexoBilogico();
    genero.codigo = this.formPersona.get('sexo')!.value;
    persona.sexoBiologico = genero;
    persona.fechaNacimiento = this.formPersona.get('fechaNacimiento')!.value;
    let grupo: GrupoSanguineo = new GrupoSanguineo();
    grupo.codigo = this.formPersona.get('grupoSanguineo')!.value;
    persona.grupoSanguineo = grupo;
    let estadoCivil: EstadoCivil = new EstadoCivil();
    estadoCivil.codigo = this.formPersona.get('estadoCivil')!.value;
    persona.estadoCivil = estadoCivil;
    //DATOS DE CONTACTO
    persona.paisResidencia = this.formPersona.get('pais')!.value;
    persona.departamentoResidencia =
      this.formPersona.get('departamento')!.value;
    persona.municipioResidencia = this.formPersona.get('municipio')!.value;
    persona.lugarResidencia = this.formPersona.get('ccp')!.value;
    persona.direccion = this.formPersona.get('direccion')!.value;
    persona.barrio = this.formPersona.get('barrio')!.value;
    let estrato: Estrato = new Estrato();
    estrato.codigo = this.formPersona.get('estrato')!.value;
    persona.estrato = estrato;
    persona.fijo = this.formPersona.get('telefonoMovil')!.value;
    persona.movil = this.formPersona.get('telefonoFijo')!.value;
    persona.correo = this.formPersona.get('correoPersonal')!.value;
    //DATOS CARACTERIZACION
    let grupoEtnico: GrupoEtnico = new GrupoEtnico();
    grupoEtnico.codigo = this.formPersona.get('grupoEtnico')!.value;
    persona.grupoEtnico = grupoEtnico;
    let puebloIndigena: PuebloIndigena = new PuebloIndigena();
    puebloIndigena.codigo = this.formPersona.get('puebloIndigena')!.value;
    persona.puebloIndigena = puebloIndigena;
    let comunidadNegra: ComunidadNegra = new ComunidadNegra();
    comunidadNegra.codigo = this.formPersona.get('comunidadNegra')!.value;
    persona.comunidadNegra = comunidadNegra;
    let personaDiscapacidad: PersonaDiscapacidad = new PersonaDiscapacidad();
    personaDiscapacidad.codigo = this.formPersona.get(
      'personaDiscapacidad'
    )!.value;
    persona.personaDiscapacidad = personaDiscapacidad;
    let discapacidadTipo: DiscapacidadTipo = new DiscapacidadTipo();
    discapacidadTipo.codigo = this.formPersona.get('discapacidadTipo')!.value;
    persona.discapacidadTipo = discapacidadTipo;
    let talentoExepcional: TalentoExepcional = new TalentoExepcional();
    talentoExepcional.codigo = this.formPersona.get('talentoExepcional')!.value;
    persona.talentoExepcional = talentoExepcional;
    //FAMILIAR DE CONTACTO
    persona.familiarNombre = this.formPersona.get('nombreFamiliar')!.value;
    persona.familiarTelefono = this.formPersona.get('telefonoFamiliar')!.value;
    persona.familiarLugarResidencia =
      this.formPersona.get('residenciaFamiliar')!.value;
    persona.familiarDireccion =
      this.formPersona.get('direccionFamiliar')!.value;

    //CONDICIONAL
    if (this.formPersona.get('grupoEtnico')!.value === 0) {
      puebloIndigena.codigo = 0;
      persona.puebloIndigena = puebloIndigena;
      comunidadNegra.codigo = 0;
      persona.comunidadNegra = comunidadNegra;
    }

    if (this.formPersona.get('grupoEtnico')!.value === 1) {
      comunidadNegra.codigo = 0;
      persona.comunidadNegra = comunidadNegra;
    }

    if (this.formPersona.get('grupoEtnico')!.value === 2) {
      puebloIndigena.codigo = 0;
      persona.puebloIndigena = puebloIndigena;
    }

    if (this.formPersona.get('personaDiscapacidad')!.value === 2) {
      discapacidadTipo.codigo = 0;
      persona.discapacidadTipo = discapacidadTipo;
    }

    persona.estado = this.formPersona.get('estado')!.value;
    if (this.editar) {
      this.actualizarPersona(persona);
    } else {
      this.registrarPersona(persona);
    }
  }

  registrarPersona(persona: Persona) {
    this.personaService.registrarPersona(persona).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.obtenerPersonas();
          this.cancelar();
          this.crearFormPersona();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarPersona(persona: Persona) {
    this.personaService.actualizarPersona(persona).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
          });
          this.cancelar();
          this.obtenerPersonas();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarPersona(element: Persona) {
    //this.showAndScrollToHiddenDiv();
    this.editar = true;
    this.formPersona.get('codigo')!.setValue(element.codigo);
    this.formPersona.get('identificacion')!.setValue(element.identificacion);
    this.formPersona.get('identificacionTipo')!.setValue(element.tipoId.codigo);
    this.formPersona.get('fechaExpedicion')!.setValue(element.fechaExpedicion);
    this.formPersona.get('lugarExpedicion')!.setValue(element.lugarExpedicion);
    this.formPersona.get('nombre')!.setValue(element.nombre);
    this.formPersona.get('apellido')!.setValue(element.apellido);
    this.formPersona.get('sexo')!.setValue(element.sexoBiologico.codigo);
    this.formPersona.get('fechaNacimiento')!.setValue(element.fechaNacimiento);
    this.formPersona
      .get('grupoSanguineo')!
      .setValue(element.grupoSanguineo.codigo);
    this.formPersona.get('estadoCivil')!.setValue(element.estadoCivil.codigo);
    this.formPersona.get('pais')!.setValue(element.paisResidencia);
    this.obtenerDepartamentosPorPais(element.paisResidencia);
    this.formPersona
      .get('departamento')!
      .setValue(element.departamentoResidencia);
    this.obtenerMunicipiosPorDepartamento(element.departamentoResidencia);
    this.formPersona.get('municipio')!.setValue(element.municipioResidencia);
    this.obtenerCcpPorMunicipio(element.municipioResidencia);
    this.formPersona.get('ccp')!.setValue(element.lugarResidencia);
    this.formPersona.get('direccion')!.setValue(element.direccion);
    this.formPersona.get('barrio')!.setValue(element.barrio);
    this.formPersona.get('estrato')!.setValue(element.estrato.codigo);
    this.formPersona.get('telefonoMovil')!.setValue(element.fijo);
    this.formPersona.get('telefonoFijo')!.setValue(element.movil);
    this.formPersona.get('correoPersonal')!.setValue(element.correo);
    this.formPersona.get('grupoEtnico')!.setValue(element.grupoEtnico.codigo);
    this.formPersona
      .get('puebloIndigena')!
      .setValue(element.puebloIndigena.codigo);
    this.formPersona
      .get('comunidadNegra')!
      .setValue(element.comunidadNegra.codigo);
    this.formPersona
      .get('personaDiscapacidad')!
      .setValue(element.personaDiscapacidad.codigo);
    this.formPersona
      .get('discapacidadTipo')!
      .setValue(element.discapacidadTipo.codigo);
    this.formPersona
      .get('talentoExepcional')!
      .setValue(element.talentoExepcional.codigo);
    this.formPersona.get('nombreFamiliar')!.setValue(element.familiarNombre);
    this.formPersona
      .get('telefonoFamiliar')!
      .setValue(element.familiarTelefono);
    this.formPersona
      .get('residenciaFamiliar')!
      .setValue(element.familiarLugarResidencia);
    this.formPersona
      .get('direccionFamiliar')!
      .setValue(element.familiarDireccion);
    this.formPersona.get('estado')!.setValue(element.estado);
  }

  eliminarPersona() {
    let persona: Persona = new Persona();
    persona.codigo = this.formPersona.get('codigo')!.value;
    persona.identificacion = this.formPersona.get('identificacion')!.value;
    let tipoId: TipoIdentificacion = new TipoIdentificacion();
    tipoId.codigo = this.formPersona.get('identificacionTipo')!.value;
    persona.tipoId = tipoId;
    persona.fechaExpedicion = this.formPersona.get('fechaExpedicion')!.value;
    persona.lugarExpedicion = this.formPersona.get('lugarExpedicion')!.value;
    persona.nombre = this.formPersona.get('nombre')!.value;
    persona.apellido = this.formPersona.get('apellido')!.value;
    let genero: SexoBilogico = new SexoBilogico();
    genero.codigo = this.formPersona.get('sexo')!.value;
    persona.sexoBiologico = genero;
    persona.fechaNacimiento = this.formPersona.get('fechaNacimiento')!.value;
    let grupo: GrupoSanguineo = new GrupoSanguineo();
    grupo.codigo = this.formPersona.get('grupoSanguineo')!.value;
    persona.grupoSanguineo = grupo;
    let estadoCivil: EstadoCivil = new EstadoCivil();
    estadoCivil.codigo = this.formPersona.get('estadoCivil')!.value;
    persona.estadoCivil = estadoCivil;
    //DATOS DE CONTACTO
    persona.paisResidencia = this.formPersona.get('pais')!.value;
    persona.departamentoResidencia =
      this.formPersona.get('departamento')!.value;
    persona.municipioResidencia = this.formPersona.get('municipio')!.value;
    persona.lugarResidencia = this.formPersona.get('ccp')!.value;
    persona.direccion = this.formPersona.get('direccion')!.value;
    persona.barrio = this.formPersona.get('barrio')!.value;
    let estrato: Estrato = new Estrato();
    estrato.codigo = this.formPersona.get('estrato')!.value;
    persona.estrato = estrato;
    persona.fijo = this.formPersona.get('telefonoMovil')!.value;
    persona.movil = this.formPersona.get('telefonoFijo')!.value;
    persona.correo = this.formPersona.get('correoPersonal')!.value;
    //DATOS CARACTERIZACION
    let grupoEtnico: GrupoEtnico = new GrupoEtnico();
    grupoEtnico.codigo = this.formPersona.get('grupoEtnico')!.value;
    persona.grupoEtnico = grupoEtnico;
    let puebloIndigena: PuebloIndigena = new PuebloIndigena();
    puebloIndigena.codigo = this.formPersona.get('puebloIndigena')!.value;
    persona.puebloIndigena = puebloIndigena;
    let comunidadNegra: ComunidadNegra = new ComunidadNegra();
    comunidadNegra.codigo = this.formPersona.get('comunidadNegra')!.value;
    persona.comunidadNegra = comunidadNegra;
    let personaDiscapacidad: PersonaDiscapacidad = new PersonaDiscapacidad();
    personaDiscapacidad.codigo = this.formPersona.get(
      'personaDiscapacidad'
    )!.value;
    persona.personaDiscapacidad = personaDiscapacidad;
    let discapacidadTipo: DiscapacidadTipo = new DiscapacidadTipo();
    discapacidadTipo.codigo = this.formPersona.get('discapacidadTipo')!.value;
    persona.discapacidadTipo = discapacidadTipo;
    let talentoExepcional: TalentoExepcional = new TalentoExepcional();
    talentoExepcional.codigo = this.formPersona.get('talentoExepcional')!.value;
    persona.talentoExepcional = talentoExepcional;
    //FAMILIAR DE CONTACTO
    persona.familiarNombre = this.formPersona.get('nombreFamiliar')!.value;
    persona.familiarTelefono = this.formPersona.get('telefonoFamiliar')!.value;
    persona.familiarLugarResidencia =
      this.formPersona.get('residenciaFamiliar')!.value;
    persona.familiarDireccion =
      this.formPersona.get('direccionFamiliar')!.value;
    persona.estado = 0;
    this.actualizarPersona(persona);
  }

  cancelar() {
    this.formPersona.reset();
    this.obtenerPaises();
    this.obtenerPaisLocal();
    this.crearFormPersona();
    this.editar = false;
  }

  obtenerPersonas() {
    this.personaService.obtenerPersonas().subscribe((data) => {
      console.log(data);
      this.listadoPerosna = data;
      this.dataSource = new MatTableDataSource<Persona>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  obtenerGenero() {
    this.personaService.obtenerGenero().subscribe((data) => {
      this.generos = data;
    });
  }

  obtenerTipoId() {
    this.personaService.obtenerTipoId().subscribe((data) => {
      this.tipoIndentificacion = data;
    });
  }

  obtenerPaises() {
    this.ubicacionService.obtenerPaises().subscribe((data) => {
      this.paises = data;
    });
  }

  obtenerPaisLocal() {
    this.ubicacionService.obtenerPaisLocal().subscribe((data) => {
      this.paisLocal = data;
    });
  }

  obtenerDepartamentosPorPais(codigo: number) {
    this.municipios = [];
    this.ubicacionService
      .obtenerDepartamentosPorPais(codigo)
      .subscribe((data) => {
        this.departamentos = data;
      });
  }

  obtenerMunicipiosPorDepartamento(codigo: string) {
    this.listadoCcp = [];
    this.ubicacionService
      .obtenerMunicipiosPorDepartamento(codigo)
      .subscribe((data) => {
        this.municipios = data;
      });
  }

  obtenerCcpPorMunicipio(codigo: string) {
    this.ubicacionService.obtenerCcpPorMunicipio(codigo).subscribe((data) => {
      this.listadoCcp = data;
    });
  }

  obtenerRh() {
    this.personaService.obtenerRh().subscribe((data) => {
      this.gruposSanguineos = data;
    });
  }

  obtenerEstadoCivil() {
    this.personaService.obtenerEstadoCivil().subscribe((data) => {
      this.estadosCivil = data;
    });
  }

  obtenerComunidadesNegras() {
    this.personaService.obtenerComunidadesNegras().subscribe((data) => {
      this.comunidadNegra = data;
    });
  }

  obtenerTiposDiscapacidades() {
    this.personaService.obtenerTiposDiscapacidades().subscribe((data) => {
      this.discapacidadTipo = data;
    });
  }

  obtenerEstratos() {
    this.personaService.obtenerEstratos().subscribe((data) => {
      this.estrato = data;
    });
  }

  obtenerGruposEtnicos() {
    this.personaService.obtenerGruposEtnicos().subscribe((data) => {
      this.grupoEtnico = data;
    });
  }

  obtenerPersonaDiscapacidades() {
    this.personaService.obtenerPersonaDiscapacidades().subscribe((data) => {
      this.personaDiscapacidad = data;
    });
  }

  obtenerPueblosIndigenas() {
    this.personaService.obtenerPueblosIndigenas().subscribe((data) => {
      this.puebloIndigena = data;
    });
  }

  obtenerTalentosExcepcionales() {
    this.personaService.obtenerTalentosExcepcionales().subscribe((data) => {
      this.talentoExepcional = data;
    });
  }

  obtenerMunicipios() {
    this.ubicacionService.obtenerMunicipios().subscribe((data) => {
      this.listadoMunicipios = data;
    });
  }

  mensajeSuccses() {
    Swal.fire({
      icon: 'success',
      title: 'Proceso realizado',
      text: '¡Operación exitosa!',
      showConfirmButton: false,
      timer: 2500,
    });
  }

  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo completar el proceso.',
      showConfirmButton: true,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#8f141b',
    });
  }

  fError(er: any): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      this.authService.logout();
      this.router.navigate(['login']);
    } else {
      this.mensajeError();
    }
  }
}
