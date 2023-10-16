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
import { AuthService } from 'src/app/services/auth.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ClasificacionCineService } from '../../../services/clasificacion-cine.service';
import { CineDetallado } from 'src/app/models/cine-detallado';
import { CineEspecifico } from 'src/app/models/cine-especifico';
import { CineAmplio } from 'src/app/models/cine-amplio';

@Component({
  selector: 'app-detallado',
  templateUrl: './detallado.component.html',
  styleUrls: ['./detallado.component.css'],
})
export class DetalladoComponent {
  listadoCineDetallado: CineDetallado[] = [];

  dataSource = new MatTableDataSource<CineDetallado>([]);
  displayedColumns: string[] = [
    'index',
    'detallado',
    'especifico',
    'amplio',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  dialogRef!: MatDialogRef<any>;

  constructor(
    public clasificacionCineService: ClasificacionCineService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerListadoCineDetallado();
    }
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(ModalFormularioDetallado, {
      width: '70%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(ModalFormularioDetallado, {
      width: '70%',
      disableClose: true,
      data: { sede: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerListadoCineDetallado();
  }

  obtenerListadoCineDetallado() {
    this.clasificacionCineService
      .obtenerListadoClasificacionCineDetallado()
      .subscribe((data) => {
        this.listadoCineDetallado = data;
        this.dataSource = new MatTableDataSource<CineDetallado>(data);
        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
      });
  }

  actualizarDetallado(Detallado: CineDetallado) {
    this.clasificacionCineService.actualizarCineDetallado(Detallado).subscribe(
      (data) => {
        if (data > 0) {
          this.obtenerListadoCineDetallado();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarDetallado(element: CineDetallado) {
    this.editarFormulario(element);
  }

  eliminarDetallado(element: CineDetallado) {
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
        this.actualizarDetallado(element);
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
      this.router.navigate(['login']);
    } else {
      this.mensajeError();
    }
  }
}

//// MODAL FORMULARIO

@Component({
  selector: 'modal-formulario-detallado',
  templateUrl: './modal-formulario-detallado.html',
  styleUrls: ['./detallado.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ModalFormularioDetallado {
  editar: boolean = false;
  listadoCineAmplio: CineAmplio[] = [];
  listadoCineEspecifico: CineEspecifico[] = [];

  formularioDetallado!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalFormularioDetallado>,
    private formBuilder: FormBuilder,
    public clasificacionCineService: ClasificacionCineService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.crearFormularioDetallado();
      this.obtenerCampoAmplio();
      if (JSON.stringify(data) !== 'null') {
        this.editarDetallado(data.sede);
        console.log('Entra');
      } else {
        console.log('No entra');
      }
    }
  }

  private crearFormularioDetallado(): void {
    this.formularioDetallado = this.formBuilder.group({
      codigo: new FormControl(''),
      amplio: new FormControl('', Validators.required),
      especifico: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      cine: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
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

  generarDetallado(): void {
    let cineDetallado: CineDetallado = new CineDetallado();
    cineDetallado.codigo = this.formularioDetallado.get('codigo')!.value;
    cineDetallado.especificoCodigo =
      this.formularioDetallado.get('especifico')!.value;
    cineDetallado.nombre = this.formularioDetallado.get('nombre')!.value;
    cineDetallado.cine = this.formularioDetallado.get('cine')!.value;
    cineDetallado.estado = this.formularioDetallado.get('estado')!.value;
    if (this.editar) {
      this.actualizarDetallado(cineDetallado);
    } else {
      this.registrarDetallado(cineDetallado);
    }
  }

  registrarDetallado(element: CineDetallado) {
    this.clasificacionCineService.registrarCineDetallado(element).subscribe(
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
          this.crearFormularioDetallado();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarDetallado(element: CineDetallado) {
    this.clasificacionCineService.actualizarCineDetallado(element).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
          });
          this.dialogRef.close();
          this.cancelar();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarDetallado(element: CineDetallado) {
    this.editar = true;
    this.formularioDetallado.get('codigo')!.setValue(element.codigo);
    this.formularioDetallado.get('amplio')!.setValue(element.amplioCodigo);
    this.obtenerCampoEspecifico(element.amplioCodigo);
    this.formularioDetallado
      .get('especifico')!
      .setValue(element.especificoCodigo);
    this.formularioDetallado.get('nombre')!.setValue(element.nombre);
    this.formularioDetallado.get('cine')!.setValue(element.cine);
    this.formularioDetallado.get('estado')!.setValue(element.estado);
  }

  cancelar() {
    this.formularioDetallado.reset();
    this.crearFormularioDetallado();
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
