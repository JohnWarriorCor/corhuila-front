import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Pais } from 'src/app/models/pais';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { AuthService } from 'src/app/services/auth.service';
import { Departamento } from 'src/app/models/departamento';
import { Municipio } from '../../models/municipio';
import { InstitucionService } from 'src/app/services/institucion.service';
import { CaracterAcademico } from 'src/app/models/caracter-academico';
import { NaturalezaJuridica } from 'src/app/models/naturaleza-juridica';
import { Sector } from 'src/app/models/sector';
import { Institucion } from 'src/app/models/institucion';
import { CabecerasCentrosPoblados } from 'src/app/models/cabeceras-centros-poblados';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NgxPrintDirective } from 'ngx-print';
import { HttpClient } from '@angular/common/http';
import { InstitucionPdfService } from '../../services/institucion-pdf.service';
import { NivelFormacion } from 'src/app/models/nivel-formacion';
import { ProgramaService } from '../../services/programa.service';
import { AreaConocimiento } from 'src/app/models/area-conocimiento';
import { Nbc } from 'src/app/models/nbc';
import { NormaService } from 'src/app/services/norma.service';
import { Norma } from 'src/app/models/norma';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Sede } from 'src/app/models/sede';
import { Facultad } from 'src/app/models/facultad';
import { SedeService } from '../../services/sede.service';
import { FacultadService } from 'src/app/services/facultad.service';
import { Programa } from 'src/app/models/programa';
import { CineDetallado } from '../../models/cine-detallado';
import { ClasificacionCineService } from 'src/app/services/clasificacion-cine.service';
import { CineAmplio } from 'src/app/models/cine-amplio';
import { CineEspecifico } from 'src/app/models/cine-especifico';
import { ProgramaPdfService } from '../../services/programa-pdf.service';

@Component({
  selector: 'app-programa',
  templateUrl: './programa.component.html',
  styleUrls: ['./programa.component.css'],
})
export class ProgramaComponent {
  dataSource = new MatTableDataSource<Programa>([]);
  displayedColumns: string[] = [
    'index',
    'snies',
    'nombre',
    'academico',
    'formacion',
    'modalidad',
    'fechaCreacion',
    'fechaSnies',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  dialogRef!: MatDialogRef<any>;

  constructor(
    public ubicacionService: UbicacionService,
    public programaService: ProgramaService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerListadoProgramas();
    }
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(ModalFormularioPrograma, {
      width: '70%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(ModalFormularioPrograma, {
      width: '70%',
      disableClose: true,
      data: { programa: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerListadoProgramas();
  }

  openDialog(element: any): void {
    const dialogRef = this.dialog.open(ModalVistaPrograma, {
      width: '70%',
      data: { programa: element },
    });
  }

  obtenerListadoProgramas() {
    this.programaService.obtenerListadoProgramas().subscribe((data) => {
      this.dataSource = new MatTableDataSource<Programa>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  actualizarPrograma(porgrama: Programa) {
    this.programaService.actualizarPrograma(porgrama).subscribe(
      (data) => {
        if (data > 0) {
          this.obtenerListadoProgramas();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  eliminarPrograma(element: Programa) {
    Swal.fire({
      title: '¿Está seguro de eliminar este elemento?',
      text: 'La siguiente operación será irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c053',
      cancelButtonColor: '#ffc107',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar opreación',
    }).then((result) => {
      if (result.isConfirmed) {
        element.estado = 0;
        this.actualizarPrograma(element);
        Swal.fire({
          icon: 'success',
          title: 'Elemento borrado.',
          confirmButtonColor: '#006983',
          confirmButtonText: 'Listo',
        });
      }
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
    } else {
      this.mensajeError();
    }
  }
}

//// MODAL FORMULARIO

@Component({
  selector: 'modal-formulario-institucion',
  templateUrl: 'modal-formulario-programa.html',
  styleUrls: ['./programa.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ModalFormularioPrograma {
  editar: boolean = false;
  listadoNivelFormacion: NivelFormacion[] = [];
  listadoAreaConocimiento: AreaConocimiento[] = [];
  listadoNbc: Nbc[] = [];
  listadoSede: Sede[] = [];
  listadoFacultad: Facultad[] = [];
  listadoCineAmplio: CineAmplio[] = [];
  listadoCineEspecifico: CineEspecifico[] = [];
  listadoCineDetallado: CineDetallado[] = [];

  listadoInstitucion: Institucion[] = [];

  formularioPrograma!: FormGroup;

  listadoNorma: Norma[] = [];
  filteredOptions!: Observable<Norma[]>;
  myControl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<ModalFormularioPrograma>,
    private formBuilder: FormBuilder,
    public institucionService: InstitucionService,
    public programaService: ProgramaService,
    public normaService: NormaService,
    public sedeService: SedeService,
    public facultadService: FacultadService,
    public clasificacionCineService: ClasificacionCineService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.crearFormularioPrograma();
      this.obtenerListadoAreaConocimiento();
      this.obtenerListadoNormas();
      this.obtenerSedes();
      this.obtenerCampoAmplio();
      if (JSON.stringify(data) !== 'null') {
        this.editarPorgrama(data.programa);
        console.log('Entra');
      } else {
        console.log('No entra');
      }
    }
  }

  obtenerNivelFormacion(nivelAcademicoCodigo: number) {
    this.listadoNivelFormacion = [];
    this.programaService
      .obtenerListadoNivelFormacion(nivelAcademicoCodigo)
      .subscribe((data) => {
        this.listadoNivelFormacion = data;
      });
  }

  obtenerListadoAreaConocimiento() {
    this.programaService.obtenerListadoAreaConocimiento().subscribe((data) => {
      this.listadoAreaConocimiento = data;
    });
  }

  obtenerListadoNbc(codigo: number) {
    this.listadoNbc = [];
    this.programaService.obtenerListadoNbc(codigo).subscribe((data) => {
      this.listadoNbc = data;
    });
  }

  obtenerSedes() {
    this.sedeService.obtenerListadoSedes().subscribe((data) => {
      this.listadoSede = data;
    });
  }

  obtenerCampoAmplio() {
    this.clasificacionCineService
      .obtenerListadoClasificacionCineAmplio()
      .subscribe((data) => {
        this.listadoCineAmplio = data;
      });
  }

  obtenerCampoEspecifico(codigo: number) {
    this.listadoCineEspecifico = [];
    this.clasificacionCineService
      .obtenerListadoEspecificoAmplio(codigo)
      .subscribe((data) => {
        this.listadoCineEspecifico = data;
      });
  }

  obtenerCampoDetallado(codigo: number) {
    this.listadoCineDetallado = [];
    this.clasificacionCineService
      .obtenerListadoDetalladoEspecifico(codigo)
      .subscribe((data) => {
        this.listadoCineDetallado = data;
      });
  }

  obtenerFacultades(codigo: number) {
    this.listadoFacultad = [];
    this.facultadService
      .obtenerListadoFacultadSede(codigo)
      .subscribe((data) => {
        this.listadoFacultad = data;
      });
  }

  private _filter(value: string): Norma[] {
    console.log(value);
    const filterValue = value.toLowerCase();

    return this.listadoNorma.filter((option) =>
      option.nombreCompleto.toLowerCase().includes(filterValue)
    );
  }

  asignarNormaHijo(codigo: number, fecha: Date) {
    this.formularioPrograma.get('norma')!.setValue(codigo);
    this.formularioPrograma.get('fechaCreacion')!.setValue(fecha);
  }

  obtenerListadoNormas() {
    this.normaService.obtenerNormasNoDerogadas().subscribe((data) => {
      this.listadoNorma = data;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    });
  }

  private crearFormularioPrograma(): void {
    this.formularioPrograma = this.formBuilder.group({
      codigo: new FormControl(''),
      snies: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      titulo: new FormControl('', Validators.required),
      nivelAcademico: new FormControl('', Validators.required),
      nivelFormacion: new FormControl('', Validators.required),
      ciclos: new FormControl('', Validators.required),
      modalidad: new FormControl('', Validators.required),
      areaConocimiento: new FormControl('', Validators.required),
      nbc: new FormControl('', Validators.required),
      sede: new FormControl('', Validators.required),
      facultad: new FormControl('', Validators.required),
      creditos: new FormControl('', Validators.required),
      tipoDuracion: new FormControl('', Validators.required),
      duracion: new FormControl('', Validators.required),
      tipoAdmision: new FormControl('', Validators.required),
      cupo: new FormControl('', Validators.required),
      web: new FormControl('', Validators.required),
      norma: new FormControl('', Validators.required),
      fechaCreacion: new FormControl('', Validators.required),
      fechaSnies: new FormControl('', Validators.required),
      convenio: new FormControl('', Validators.required),
      cineAmplio: new FormControl('', Validators.required),
      cineEspecifico: new FormControl('', Validators.required),
      cineDetallado: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  generarPrograma(): void {
    let programa: Programa = new Programa();
    programa.codigo = this.formularioPrograma.get('codigo')!.value;
    programa.snies = +this.formularioPrograma.get('snies')!.value;
    programa.nombre = this.formularioPrograma.get('nombre')!.value;
    programa.titulo = this.formularioPrograma.get('titulo')!.value;
    programa.nivelAcademicoCodigo =
      +this.formularioPrograma.get('nivelAcademico')!.value;
    programa.nivelFormacionCodigo =
      +this.formularioPrograma.get('nivelFormacion')!.value;
    programa.ciclosCodigo = +this.formularioPrograma.get('ciclos')!.value;
    programa.modalidadCodigo = +this.formularioPrograma.get('modalidad')!.value;
    programa.areaConocimientoCodigo =
      +this.formularioPrograma.get('areaConocimiento')!.value;
    programa.nbcCodigo = this.formularioPrograma.get('nbc')!.value;
    let facultad: Facultad = new Facultad();
    facultad.codigo = this.formularioPrograma.get('facultad')!.value;
    programa.facultad = facultad;
    programa.creditos = this.formularioPrograma.get('creditos')!.value;
    programa.tipoDuracionCodigo =
      +this.formularioPrograma.get('tipoDuracion')!.value;
    programa.duracion = this.formularioPrograma.get('duracion')!.value;
    programa.tipoAdmisionCodigo =
      +this.formularioPrograma.get('tipoAdmision')!.value;
    programa.cupos = this.formularioPrograma.get('cupo')!.value;
    programa.sitioWeb = this.formularioPrograma.get('web')!.value;
    programa.normaCodigo = this.formularioPrograma.get('norma')!.value;
    programa.fechaCreacion =
      this.formularioPrograma.get('fechaCreacion')!.value;
    programa.fechaRegistroSnies =
      this.formularioPrograma.get('fechaSnies')!.value;
    programa.convenio = +this.formularioPrograma.get('convenio')!.value;
    let cineDetallado: CineDetallado = new CineDetallado();
    cineDetallado.codigo = this.formularioPrograma.get('cineDetallado')!.value;
    programa.campoDetallado = cineDetallado;
    programa.estado = this.formularioPrograma.get('estado')!.value;
    if (this.editar) {
      this.actualizarPrograma(programa);
    } else {
      this.registrarPrograma(programa);
    }
  }

  registrarPrograma(programa: Programa) {
    this.programaService.registrarPrograma(programa).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.cancelar();
          this.dialogRef.close();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarPrograma(programa: Programa) {
    this.programaService.actualizarPrograma(programa).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.cancelar();
          this.dialogRef.close();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarPorgrama(element: Programa) {
    this.editar = true;
    this.formularioPrograma.get('codigo')!.setValue(element.codigo);
    this.formularioPrograma.get('snies')!.setValue(element.snies);
    this.formularioPrograma.get('nombre')!.setValue(element.nombre);
    this.formularioPrograma.get('titulo')!.setValue(element.titulo);
    this.formularioPrograma
      .get('nivelAcademico')!
      .setValue('' + element.nivelAcademicoCodigo);
    this.obtenerNivelFormacion(element.nivelAcademicoCodigo);
    this.formularioPrograma
      .get('nivelFormacion')!
      .setValue(element.nivelFormacionCodigo);
    this.formularioPrograma.get('ciclos')!.setValue('' + element.ciclosCodigo);
    this.formularioPrograma
      .get('modalidad')!
      .setValue('' + element.modalidadCodigo);
    this.formularioPrograma
      .get('areaConocimiento')!
      .setValue(element.areaConocimientoCodigo);
    this.formularioPrograma.get('nbc')!.setValue(element.nbcCodigo);
    this.formularioPrograma.get('sede')!.setValue(element.facultad.sede.codigo);
    this.obtenerFacultades(element.facultad.sede.codigo);
    this.formularioPrograma.get('facultad')!.setValue(element.facultad.codigo);
    this.formularioPrograma.get('creditos')!.setValue(element.creditos);
    this.formularioPrograma
      .get('tipoDuracion')!
      .setValue('' + element.tipoDuracionCodigo);
    this.formularioPrograma.get('duracion')!.setValue(element.duracion);
    this.formularioPrograma
      .get('tipoAdmision')!
      .setValue('' + element.tipoAdmisionCodigo);
    this.formularioPrograma.get('cupo')!.setValue(element.cupos);
    this.formularioPrograma.get('web')!.setValue(element.sitioWeb);
    this.formularioPrograma.get('norma')!.setValue(element.normaCodigo);
    this.formularioPrograma
      .get('fechaCreacion')!
      .setValue(element.fechaCreacion);
    this.formularioPrograma
      .get('fechaSnies')!
      .setValue(element.fechaRegistroSnies);
    this.formularioPrograma.get('convenio')!.setValue('' + element.convenio);
    this.formularioPrograma
      .get('cineAmplio')!
      .setValue(element.campoDetallado.amplioCodigo);
    this.obtenerCampoEspecifico(element.campoDetallado.amplioCodigo);
    this.formularioPrograma
      .get('cineEspecifico')!
      .setValue(element.campoDetallado.especificoCodigo);
    this.obtenerCampoDetallado(element.campoDetallado.especificoCodigo);
    this.formularioPrograma
      .get('cineDetallado')!
      .setValue(element.campoDetallado.codigo);
    this.formularioPrograma.get('estado')!.setValue(element.estado);
  }

  cancelar() {
    this.formularioPrograma.reset();
    this.editar = false;
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

//// MODAL REPORTE

@Component({
  selector: 'modal-institucion',
  templateUrl: 'modal-vista-programa.html',
  styleUrls: ['./programa.component.css'],
})
export class ModalVistaPrograma implements OnInit {
  paises: Pais[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  paisLocal: Pais[] = [];
  listadoCaracterAcademico: CaracterAcademico[] = [];
  listadoNaturalezaJuridica: NaturalezaJuridica[] = [];
  listadoSector: Sector[] = [];
  listadoCcp: CabecerasCentrosPoblados[] = [];
  listadoInstitucion: Institucion[] = [];
  aniosPasados: any;

  @ViewChild('printSection', { static: false }) printSection!: ElementRef;
  @ViewChild(NgxPrintDirective, { static: false })
  printDirective!: NgxPrintDirective;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ModalVistaPrograma>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ubicacionService: UbicacionService,
    public institucionService: InstitucionService,
    public programaPdfService: ProgramaPdfService
  ) {
    this.obtenerListadoInstitucion();
    this.calcularAniosPasados();
  }

  ngOnInit() {}

  generarPdf() {
    this.programaPdfService.export(this.data.programa, this.listadoInstitucion);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  calcularAniosPasados() {
    console.log(this.data.programa.fechaRegistroSnies);

    const fechaDada = new Date(this.data.programa.fechaRegistroSnies);
    const fechaActual = new Date();

    const diferenciaEnMilisegundos =
      fechaActual.getTime() - fechaDada.getTime();
    this.aniosPasados = Math.floor(
      diferenciaEnMilisegundos / (1000 * 60 * 60 * 24 * 365.25)
    );
  }

  obtenerListadoInstitucion() {
    this.institucionService.obtenerListadoInstitucion().subscribe((data) => {
      if (JSON.stringify(data) != '[]') {
        this.listadoInstitucion = data;
      }
    });
  }

  obtenerListadoCaracterAcademico() {
    this.institucionService
      .obtenerListadoCaracterAcademico()
      .subscribe((data) => {
        this.listadoCaracterAcademico = data;
      });
  }

  obtenerListadoNaturalezaJuridica() {
    this.institucionService
      .obtenerListadoNaturalezaJuridica()
      .subscribe((data) => {
        this.listadoNaturalezaJuridica = data;
      });
  }

  obtenerListadoSector() {
    this.institucionService.obtenerListadoSector().subscribe((data) => {
      this.listadoSector = data;
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
        console.log(this.departamentos);
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
}
