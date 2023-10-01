import { Component, ViewChild, Inject } from '@angular/core';
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
import { MatSelectionList } from '@angular/material/list';
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
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
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

  formFacultad!: FormGroup;

  dataSource = new MatTableDataSource<Facultad>([]);
  displayedColumns: string[] = [
    'index',
    'nombre',
    'sede',
    'decano',
    'correo',
    'telefono',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild('allSelected', { static: false }) allSelected!: MatSelectionList;
  dialogRef!: MatDialogRef<any>;

  sedes = new FormControl('');

  constructor(
    public ubicacionService: UbicacionService,
    public institucionService: InstitucionService,
    public sedeService: SedeService,
    public facultadServcice: FacultadService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerListadoFacultades();
    }
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(ModalFormularioFacultad, {
      width: '70%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(ModalFormularioFacultad, {
      width: '70%',
      disableClose: true,
      data: { sede: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerListadoFacultades();
  }

  obtenerListadoFacultades() {
    this.facultadServcice.obtenerListadoFacultades().subscribe((data) => {
      this.listadoFacultad = data;
      this.dataSource = new MatTableDataSource<Facultad>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  actualizarFacultad(facultad: Facultad) {
    this.facultadServcice.actualizarFacultad(facultad).subscribe(
      (data) => {
        if (data > 0) {
          this.obtenerListadoFacultades();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarFacultad(element: Facultad) {
    this.editarFormulario(element);
  }

  eliminarFacultad(element: Facultad) {
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
        this.actualizarFacultad(element);
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

@Component({
  selector: 'modal-formulario-facultad',
  templateUrl: '../facultad/modal-formulario-facultad.html',
  styleUrls: ['./facultad.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ModalFormularioFacultad {
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

  formFacultad!: FormGroup;

  sedes = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<ModalFormularioFacultad>,
    private formBuilder: FormBuilder,
    public ubicacionService: UbicacionService,
    public institucionService: InstitucionService,
    public sedeService: SedeService,
    public facultadServcice: FacultadService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerPaises();
      this.obtenerPaisLocal();
      this.crearFormFacultad();
      this.obtenerListadoSedes();
      this.obtenerInstitucion();
      this.obtenerListadoTiposSedes();
      this.obtenerListadoFacultades();
      if (JSON.stringify(data) !== 'null') {
        this.editarFacultad(data.sede);
        console.log('Entra');
      } else {
        console.log('No entra');
      }
    }
  }

  private crearFormFacultad(): void {
    this.formFacultad = this.formBuilder.group({
      codigo: new FormControl(''),
      sede: new FormControl(''),
      nombre: new FormControl('', Validators.required),
      decano: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, Validators.email]),
      telefono: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  obtenerListadoFacultades() {
    this.facultadServcice.obtenerListadoFacultades().subscribe((data) => {
      this.listadoFacultad = data;
    });
  }

  obtenerListadoSedes() {
    this.sedeService.obtenerListadoSedes().subscribe((data) => {
      this.listadoSede = data;
    });
  }

  generarFacultad(): void {
    console.log(
      JSON.stringify(this.sedes.value!.length),
      +JSON.stringify(this.sedes.value!.length) == 0
    );
    if (+JSON.stringify(this.sedes.value!.length) === 0) {
      console.log('Entra individual');
      let facultad: Facultad = new Facultad();
      facultad.codigo = this.formFacultad.get('codigo')!.value;
      facultad.nombre = this.formFacultad.get('nombre')!.value;
      let sede: Sede = new Sede();
      sede.codigo = this.formFacultad.get('sede')!.value;
      facultad.sede = sede;
      facultad.decano = this.formFacultad.get('decano')!.value;
      facultad.correo = this.formFacultad.get('correo')!.value;
      facultad.telefono = this.formFacultad.get('telefono')!.value;
      facultad.estado = this.formFacultad.get('estado')!.value;
      this.actualizarFacultad(facultad);
    } else {
      for (let index = 0; index < this.sedes.value!.length; index++) {
        let facultad: Facultad = new Facultad();
        facultad.nombre = this.formFacultad.get('nombre')!.value;
        let sede: Sede = new Sede();
        sede.codigo = +this.sedes.value![index];
        facultad.sede = sede;
        facultad.decano = this.formFacultad.get('decano')!.value;
        facultad.correo = this.formFacultad.get('correo')!.value;
        facultad.telefono = this.formFacultad.get('telefono')!.value;
        facultad.estado = this.formFacultad.get('estado')!.value;
        if (this.editar) {
          this.actualizarFacultad(facultad);
        } else {
          this.registrarFacultad(facultad);
        }
      }
      this.sedes.reset();
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
          this.dialogRef.close();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarFacultad(facultad: Facultad) {
    console.log(facultad);
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
          this.dialogRef.close();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarFacultad(element: Facultad) {
    this.editar = true;
    this.formFacultad.get('codigo')!.setValue(element.codigo);
    this.formFacultad.get('sede')!.setValue(element.sede.codigo);
    this.formFacultad.get('nombre')!.setValue(element.nombre);
    this.formFacultad.get('decano')!.setValue(element.decano);
    this.formFacultad.get('correo')!.setValue(element.correo);
    this.formFacultad.get('telefono')!.setValue(element.telefono);
    this.formFacultad.get('estado')!.setValue(element.estado);
  }

  eliminarFacultad() {
    let facultad: Facultad = new Facultad();
    facultad.codigo = this.formFacultad.get('codigo')!.value;
    facultad.nombre = this.formFacultad.get('nombre')!.value;
    let sede: Sede = new Sede();
    sede.codigo = this.formFacultad.get('sede')!.value;
    facultad.sede = sede;
    facultad.decano = this.formFacultad.get('decano')!.value;
    facultad.correo = this.formFacultad.get('correo')!.value;
    facultad.telefono = this.formFacultad.get('telefono')!.value;
    facultad.estado = 0;
    this.actualizarFacultad(facultad);
  }

  cancelar() {
    this.formFacultad.reset();
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
