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
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { CabecerasCentrosPoblados } from 'src/app/models/cabeceras-centros-poblados';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/services/persona.service';
import { RepresentanteLegalService } from '../../services/representante-legal.service';
import { RepresentanteLegal } from 'src/app/models/representante-legal';

@Component({
  selector: 'app-representante-legal',
  templateUrl: './representante-legal.component.html',
  styleUrls: ['./representante-legal.component.css'],
})
export class RepresentanteLegalComponent {
  editar: boolean = false;
  listadoPersona: Persona[] = [];
  listadoRepresentanteLegal: RepresentanteLegal[] = [];
  correo: string = '';

  formRepresentanteLegal!: FormGroup;

  fechaLimiteMinima!: any;
  fechaLimiteMinimaVigencia!: any;

  dataSource = new MatTableDataSource<RepresentanteLegal>([]);
  displayedColumns: string[] = [
    'index',
    'persona',
    'correo',
    'norma',
    'fechaInicio',
    'fechaFin',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  // Referencia al elemento div oculto
  @ViewChild('hiddenDiv') hiddenDiv!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    public personaService: PersonaService,
    public representanteLegalService: RepresentanteLegalService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    this.fechaLimiteMinima = new Date();
    if (this.authService.validacionToken()) {
      this.crearFormRepresentanteLegal();
      this.obtenerListadoRepresentanteLegal();
      this.obtenerPersonas();
    }
  }

  private crearFormRepresentanteLegal(): void {
    this.formRepresentanteLegal = this.formBuilder.group({
      codigo: new FormControl(''),
      persona: new FormControl('', Validators.required),
      norma: new FormControl('', Validators.required),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl('', Validators.required),
      justificacion: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  // Función para mostrar el div oculto y desplazarse hacia él
  showAndScrollToHiddenDiv() {
    this.hiddenDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  /*  openDialog(element: any): void {
    const dialogRef = this.dialog.open(ModalInstitucion, {
      width: '60%',
      data: { institucion: element },
    });
  }
 */

  limiteVigencia() {
    this.fechaLimiteMinimaVigencia = new Date(
      this.formRepresentanteLegal.get('fechaInicio')!.value
    );
  }

  obtenerPersonas() {
    this.personaService.obtenerPersonas().subscribe((data) => {
      console.log(data);
      this.listadoPersona = data;
    });
  }

  obtenerListadoRepresentanteLegal() {
    this.representanteLegalService
      .obtenerListadoRepresentanteLegal()
      .subscribe((data) => {
        this.listadoRepresentanteLegal = data;
        this.dataSource = new MatTableDataSource<RepresentanteLegal>(data);
        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
      });
  }

  precargaCorreo(element: Persona) {
    this.correo = element.correo;
  }

  generarRepresentantLegal(): void {
    let representanteLegal: RepresentanteLegal = new RepresentanteLegal();
    representanteLegal.codigo =
      this.formRepresentanteLegal.get('codigo')!.value;
    let persona: Persona = new Persona();
    persona.codigo = this.formRepresentanteLegal.get('persona')!.value;
    representanteLegal.persona = persona;
    representanteLegal.norma = this.formRepresentanteLegal.get('norma')!.value;
    representanteLegal.fechaInicio =
      this.formRepresentanteLegal.get('fechaInicio')!.value;
    representanteLegal.fechaFin =
      this.formRepresentanteLegal.get('fechaFin')!.value;
    representanteLegal.justificacion =
      this.formRepresentanteLegal.get('justificacion')!.value;
    representanteLegal.estado =
      this.formRepresentanteLegal.get('estado')!.value;
    if (this.editar) {
      this.actualizarRepresentantLegal(representanteLegal);
    } else {
      this.registrarRepresentantLegal(representanteLegal);
    }
  }

  registrarRepresentantLegal(representantLegal: RepresentanteLegal) {
    this.representanteLegalService
      .registrarRepresentanteLegal(representantLegal)
      .subscribe(
        (data) => {
          if (data > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Registrado',
              text: '¡Operación exitosa!',
              showConfirmButton: false,
              timer: 2500,
            });
            this.obtenerListadoRepresentanteLegal();
            this.cancelar();
            this.crearFormRepresentanteLegal();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  actualizarRepresentantLegal(representantLegal: RepresentanteLegal) {
    this.representanteLegalService
      .actualizarRepresentanteLegal(representantLegal)
      .subscribe(
        (data) => {
          if (data > 0) {
            Swal.fire({
              icon: 'success',
              title: 'Actualizado',
              text: '¡Operación exitosa!',
              showConfirmButton: false,
            });
            this.cancelar();
            this.obtenerListadoRepresentanteLegal();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  editarRepresentantLegal(element: RepresentanteLegal) {
    this.showAndScrollToHiddenDiv();
    this.editar = true;
    this.formRepresentanteLegal.get('codigo')!.setValue(element.codigo);
    this.formRepresentanteLegal
      .get('persona')!
      .setValue(element.persona.codigo);
    this.precargaCorreo(element.persona);
    this.formRepresentanteLegal.get('norma')!.setValue('' + element.norma);
    let fechaInicio = new Date(element.fechaInicio + ' 0:00:00');
    this.formRepresentanteLegal.get('fechaInicio')!.setValue(fechaInicio);
    let fechaFin = new Date(element.fechaFin + ' 0:00:00');
    this.formRepresentanteLegal.get('fechaFin')!.setValue(fechaFin);
    this.formRepresentanteLegal
      .get('justificacion')!
      .setValue(element.justificacion);
    this.formRepresentanteLegal.get('estado')!.setValue(element.estado);
  }

  eliminarRepresentantLegal() {
    let representanteLegal: RepresentanteLegal = new RepresentanteLegal();
    representanteLegal.codigo =
      this.formRepresentanteLegal.get('codigo')!.value;
    let persona: Persona = new Persona();
    persona.codigo = this.formRepresentanteLegal.get('persona')!.value;
    representanteLegal.persona = persona;
    representanteLegal.norma = this.formRepresentanteLegal.get('norma')!.value;
    representanteLegal.fechaInicio =
      this.formRepresentanteLegal.get('fechaInicio')!.value;
    representanteLegal.fechaFin =
      this.formRepresentanteLegal.get('fechaFin')!.value;
    representanteLegal.justificacion =
      this.formRepresentanteLegal.get('justificacion')!.value;
    representanteLegal.estado =
      this.formRepresentanteLegal.get('estado')!.value;
    representanteLegal.estado = 0;
    this.actualizarRepresentantLegal(representanteLegal);
  }

  cancelar() {
    this.formRepresentanteLegal.reset();
    this.crearFormRepresentanteLegal();
    this.obtenerListadoRepresentanteLegal();
    this.editar = false;
    this.correo = '';
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

//// MODAL

/* @Component({
  selector: 'modal-institucion',
  templateUrl: '../institucion/modal-institucion.html',
  styleUrls: ['./RepresentantLegal.component.css'],
})
export class ModalInstitucion implements OnInit {
  paises: Pais[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  paisLocal: Pais[] = [];
  listadoCaracterAcademico: CaracterAcademico[] = [];
  listadoNaturalezaJuridica: NaturalezaJuridica[] = [];
  listadoSector: Sector[] = [];
  listadoCcp: CabecerasCentrosPoblados[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalInstitucion>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ubicacionService: UbicacionService,
    public institucionService: InstitucionService
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
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
 */
