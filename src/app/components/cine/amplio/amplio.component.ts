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
import { CineAmplio } from 'src/app/models/cine-amplio';

@Component({
  selector: 'app-amplio',
  templateUrl: './amplio.component.html',
  styleUrls: ['./amplio.component.css'],
})
export class AmplioComponent {
  listadoCineAmplio: CineAmplio[] = [];

  dataSource = new MatTableDataSource<CineAmplio>([]);
  displayedColumns: string[] = ['index', 'amplio', 'opciones'];
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
      this.obtenerListadoCampoAmplio();
    }
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(ModalFormularioAmplio, {
      width: '70%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(ModalFormularioAmplio, {
      width: '70%',
      disableClose: true,
      data: { sede: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerListadoCampoAmplio();
  }

  obtenerListadoCampoAmplio() {
    this.clasificacionCineService
      .obtenerListadoClasificacionCineAmplio()
      .subscribe((data) => {
        this.listadoCineAmplio = data;
        this.dataSource = new MatTableDataSource<CineAmplio>(data);
        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
      });
  }

  actualizarAmplio(amplio: CineAmplio) {
    this.clasificacionCineService.actualizarCineAmplio(amplio).subscribe(
      (data) => {
        if (data > 0) {
          this.obtenerListadoCampoAmplio();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarAmplio(element: CineAmplio) {
    this.editarFormulario(element);
  }

  eliminarAmplio(element: CineAmplio) {
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
        this.actualizarAmplio(element);
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
  selector: 'modal-formulario-amplio',
  templateUrl: './modal-formulario-amplio.html',
  styleUrls: ['./amplio.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ModalFormularioAmplio {
  editar: boolean = false;
  listadoCineAmplio: CineAmplio[] = [];

  formularioAmplio!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalFormularioAmplio>,
    private formBuilder: FormBuilder,
    public clasificacionCineService: ClasificacionCineService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.crearFormularioAmplio();
      if (JSON.stringify(data) !== 'null') {
        this.editarAmplio(data.sede);
        console.log('Entra');
      } else {
        console.log('No entra');
      }
    }
  }

  private crearFormularioAmplio(): void {
    this.formularioAmplio = this.formBuilder.group({
      codigo: new FormControl(''),
      nombre: new FormControl('', Validators.required),
      cine: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  generarAmplio(): void {
    let cineAmplio: CineAmplio = new CineAmplio();
    cineAmplio.codigo = this.formularioAmplio.get('codigo')!.value;
    cineAmplio.nombre = this.formularioAmplio.get('nombre')!.value;
    cineAmplio.cine = this.formularioAmplio.get('cine')!.value;
    cineAmplio.estado = this.formularioAmplio.get('estado')!.value;
    if (this.editar) {
      this.actualizarAmplio(cineAmplio);
    } else {
      this.registrarAmplio(cineAmplio);
    }
  }

  registrarAmplio(amplio: CineAmplio) {
    this.clasificacionCineService.registrarCineAmplio(amplio).subscribe(
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
          this.crearFormularioAmplio();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarAmplio(amplio: CineAmplio) {
    this.clasificacionCineService.actualizarCineAmplio(amplio).subscribe(
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

  editarAmplio(element: CineAmplio) {
    this.editar = true;
    this.formularioAmplio.get('codigo')!.setValue(element.codigo);
    this.formularioAmplio.get('nombre')!.setValue(element.nombre);
    this.formularioAmplio.get('cine')!.setValue(element.cine);
    this.formularioAmplio.get('estado')!.setValue(element.estado);
  }

  cancelar() {
    this.formularioAmplio.reset();
    this.crearFormularioAmplio();
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
