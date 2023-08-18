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

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
})
export class PersonaComponent {
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

  formPersona!: FormGroup;

  dataSource = new MatTableDataSource<Pais>([]);
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
}
