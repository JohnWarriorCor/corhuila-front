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
import { Pais } from 'src/app/models/pais';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { AuthService } from 'src/app/services/auth.service';
import { Departamento } from 'src/app/models/departamento';
import { Municipio } from '../../models/municipio';
import { InstitucionService } from 'src/app/services/institucion.service';
import { Institucion } from 'src/app/models/institucion';
import { CabecerasCentrosPoblados } from 'src/app/models/cabeceras-centros-poblados';
import { SedeTipo } from 'src/app/models/sede-tipo';
import { SedeService } from 'src/app/services/sede.service';
import { Sede } from 'src/app/models/sede';
import { Facultad } from 'src/app/models/facultad';
import { FacultadService } from 'src/app/services/facultad.service';

@Component({
  selector: 'app-facultad',
  templateUrl: './facultad.component.html',
  styleUrls: ['./facultad.component.css'],
})
export class FacultadComponent {
  editar: boolean = false;
  nameFile: string = 'Archivo: pdf';
  paises: Pais[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  paisLocal: Pais[] = [];
  listadoCcp: CabecerasCentrosPoblados[] = [];
  listadoInstitucion: Institucion[] = [];
  institucion: Institucion[] = [];
  listadoTipoSede: SedeTipo[] = [];
  listadoSede: Sede[] = [];
  listadoFacultad: Facultad[] = [];

  formSede!: FormGroup;

  dataSource = new MatTableDataSource<Facultad>([]);
  displayedColumns: string[] = [
    'index',
    'sede',
    'nombre',
    'decano',
    'correo',
    'telefono',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  // Referencia al elemento div oculto
  @ViewChild('hiddenDiv') hiddenDiv!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    public ubicacionService: UbicacionService,
    public institucionService: InstitucionService,
    public sedeService: SedeService,
    public facultadServcice: FacultadService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerPaises();
      this.obtenerPaisLocal();
      this.crearFormFacultad();
      this.obtenerListadoSedes();
      this.obtenerInstitucion();
      this.obtenerListadoTiposSedes();
      this.obtenerListadoFacultades();
    }
  }

  private crearFormFacultad(): void {
    this.formSede = this.formBuilder.group({
      codigo: new FormControl(''),
      sede: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      decano: new FormControl('', Validators.required),
      correo: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
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

  obtenerListadoFacultades() {
    this.facultadServcice.obtenerListadoFacultades().subscribe((data) => {
      this.listadoFacultad = data;
      this.dataSource = new MatTableDataSource<Facultad>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  obtenerListadoSedes() {
    this.sedeService.obtenerListadoSedes().subscribe((data) => {
      this.listadoSede = data;
    });
  }

  generarFacultad(): void {
    let facultad: Facultad = new Facultad();
    facultad.nombre = this.formSede.get('nombre')!.value;
    let sede: Sede = new Sede();
    sede.codigo = this.formSede.get('sede')!.value;
    facultad.sede = sede;
    facultad.decano = this.formSede.get('decano')!.value;
    facultad.correo = this.formSede.get('correo')!.value;
    facultad.telefono = this.formSede.get('telefono')!.value;
    facultad.estado = this.formSede.get('estado')!.value;
    if (this.editar) {
      this.actualizarFacultad(facultad);
    } else {
      this.registrarFacultad(facultad);
    }
  }

  registrarFacultad(facultad: Facultad) {
    this.facultadServcice.registrarFacultad(facultad).subscribe(
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
          this.crearFormFacultad();
          this.obtenerListadoFacultades();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarFacultad(facultad: Facultad) {
    this.facultadServcice.actualizarFacultad(facultad).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
          });
          this.cancelar();
          this.obtenerListadoFacultades();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarFacultad(element: Facultad) {
    this.showAndScrollToHiddenDiv();
    this.editar = true;
    this.formSede.get('codigo')!.setValue(element.codigo);
    this.formSede.get('sede')!.setValue(element.sede.codigo);
    this.formSede.get('nombre')!.setValue(element.nombre);
    this.formSede.get('decano')!.setValue(element.decano);
    this.formSede.get('correo')!.setValue(element.correo);
    this.formSede.get('telefono')!.setValue(element.telefono);
    this.formSede.get('estado')!.setValue(element.estado);
  }

  eliminarFacultad() {
    let facultad: Facultad = new Facultad();
    facultad.codigo = this.formSede.get('codigo')!.value;
    facultad.nombre = this.formSede.get('nombre')!.value;
    let sede: Sede = new Sede();
    sede.codigo = this.formSede.get('sede')!.value;
    facultad.sede = sede;
    facultad.decano = this.formSede.get('decano')!.value;
    facultad.correo = this.formSede.get('correo')!.value;
    facultad.telefono = this.formSede.get('telefono')!.value;
    facultad.estado = 0;
    this.actualizarFacultad(facultad);
  }

  cancelar() {
    this.formSede.reset();
    this.obtenerPaises();
    this.obtenerPaisLocal();
    this.crearFormFacultad();
    this.obtenerListadoSedes();
    this.editar = false;
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

  obtenerInstitucion() {
    this.institucionService.obtenerInstitucion().subscribe((data) => {
      this.institucion = data;
    });
  }

  obtenerListadoTiposSedes() {
    this.sedeService.obtenerListadoTiposSedes().subscribe((data) => {
      this.listadoTipoSede = data;
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
      confirmButtonColor: '#006983',
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
  styleUrls: ['./sede.component.css'],
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
