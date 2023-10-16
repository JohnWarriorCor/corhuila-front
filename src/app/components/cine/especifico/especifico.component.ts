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
import { CineEspecifico } from 'src/app/models/cine-especifico';
import { CineAmplio } from 'src/app/models/cine-amplio';

@Component({
  selector: 'app-especifico',
  templateUrl: './especifico.component.html',
  styleUrls: ['./especifico.component.css'],
})
export class EspecificoComponent {
  listadoCineEspecifico: CineEspecifico[] = [];

  dataSource = new MatTableDataSource<CineEspecifico>([]);
  displayedColumns: string[] = ['index', 'especifico', 'amplio', 'opciones'];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  dialogRef!: MatDialogRef<any>;

  constructor(
    private formBuilder: FormBuilder,
    public clasificacionCineService: ClasificacionCineService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerListadoCineEspecifico();
    }
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(ModalFormularioEspecifico, {
      width: '70%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(ModalFormularioEspecifico, {
      width: '70%',
      disableClose: true,
      data: { sede: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerListadoCineEspecifico();
  }

  obtenerListadoCineEspecifico() {
    this.clasificacionCineService
      .obtenerListadoClasificacionCineEspecifico()
      .subscribe((data) => {
        this.listadoCineEspecifico = data;
        this.dataSource = new MatTableDataSource<CineEspecifico>(data);
        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
      });
  }

  actualizarEspecifico(Especifico: CineEspecifico) {
    this.clasificacionCineService
      .actualizarCineEspecifico(Especifico)
      .subscribe(
        (data) => {
          if (data > 0) {
            this.obtenerListadoCineEspecifico();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  editarEspecifico(element: CineEspecifico) {
    this.editarFormulario(element);
  }

  eliminarEspecifico(element: CineEspecifico) {
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
        this.actualizarEspecifico(element);
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
  selector: 'modal-formulario-especifico',
  templateUrl: './modal-formulario-especifico.html',
  styleUrls: ['./especifico.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ModalFormularioEspecifico {
  editar: boolean = false;
  listadoCineAmplio: CineAmplio[] = [];

  formularioEspecifico!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalFormularioEspecifico>,
    private formBuilder: FormBuilder,
    public clasificacionCineService: ClasificacionCineService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.crearFormularioEspecifico();
      this.obtenerCampoAmplio();
      if (JSON.stringify(data) !== 'null') {
        this.editarEspecifico(data.sede);
        console.log('Entra');
      } else {
        console.log('No entra');
      }
    }
  }

  private crearFormularioEspecifico(): void {
    this.formularioEspecifico = this.formBuilder.group({
      codigo: new FormControl(''),
      amplio: new FormControl('', Validators.required),
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

  generarEspecifico(): void {
    let cineEspecifico: CineEspecifico = new CineEspecifico();
    cineEspecifico.codigo = this.formularioEspecifico.get('codigo')!.value;
    cineEspecifico.amplioCodigo =
      this.formularioEspecifico.get('amplio')!.value;
    cineEspecifico.nombre = this.formularioEspecifico.get('nombre')!.value;
    cineEspecifico.cine = this.formularioEspecifico.get('cine')!.value;
    cineEspecifico.estado = this.formularioEspecifico.get('estado')!.value;
    if (this.editar) {
      this.actualizarEspecifico(cineEspecifico);
    } else {
      this.registrarEspecifico(cineEspecifico);
    }
  }

  registrarEspecifico(element: CineEspecifico) {
    this.clasificacionCineService.registrarCineEspecifico(element).subscribe(
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
          this.crearFormularioEspecifico();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarEspecifico(element: CineEspecifico) {
    this.clasificacionCineService.actualizarCineEspecifico(element).subscribe(
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

  editarEspecifico(element: CineEspecifico) {
    this.editar = true;
    this.formularioEspecifico.get('codigo')!.setValue(element.codigo);
    this.formularioEspecifico.get('amplio')!.setValue(element.amplioCodigo);
    this.formularioEspecifico.get('nombre')!.setValue(element.nombre);
    this.formularioEspecifico.get('cine')!.setValue(element.cine);
    this.formularioEspecifico.get('estado')!.setValue(element.estado);
  }

  cancelar() {
    this.formularioEspecifico.reset();
    this.crearFormularioEspecifico();
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
