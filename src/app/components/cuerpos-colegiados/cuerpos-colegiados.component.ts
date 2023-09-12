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
import { DatePipe } from '@angular/common';
import { CuerposColegiados } from 'src/app/models/cuerpos-colegiados';
import { CuerposColegiadosService } from '../../services/cuerpos-colegiados.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FuncionesCuerpoColegiado } from 'src/app/models/funciones-cuerpo-colegiado';
import { IntegranteCuerpoColegiado } from 'src/app/models/integrante-cuerpo-colegiado';

export interface Libros {
  fieldArray: Array<any>;
  key$?: string;
}

@Component({
  selector: 'app-cuerpos-colegiados',
  templateUrl: './cuerpos-colegiados.component.html',
  styleUrls: ['./cuerpos-colegiados.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class CuerposColegiadosComponent {
  editar: boolean = false;
  editarFuncion: boolean = false;
  war: any;

  listadoCuerposColegiados: CuerposColegiados[] = [];
  listadoFuncionesCuerpoColegiado: FuncionesCuerpoColegiado[] = [];

  formCuerposColegiados!: FormGroup;
  formFunciones!: FormGroup;

  newAttribute: any = {};
  libro: Libros = {
    fieldArray: [],
  };

  dataSource = new MatTableDataSource<CuerposColegiados>([]);
  displayedColumns: string[] = [
    'index',
    'nombre',
    'norma',
    'fecha',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  // Referencia al elemento div oculto
  @ViewChild('hiddenDiv') hiddenDiv!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    public cuerposColegiadosService: CuerposColegiadosService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerCuerposColegiados();
      this.crearCuerposColegiados();
      this.crearFormularioFunciones();
    }
  }

  private crearCuerposColegiados(): void {
    this.formCuerposColegiados = this.formBuilder.group({
      codigo: new FormControl(''),
      nombre: new FormControl('', Validators.required),
      nombreCorto: new FormControl('', Validators.required),
      numeroNorma: new FormControl('', Validators.required),
      nombreNorma: new FormControl('', Validators.required),
      fechaNorma: new FormControl('', Validators.required),
      fechaCreacion: new FormControl(''),
      cantidadMiembros: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  private crearFormularioFunciones(): void {
    this.formFunciones = this.formBuilder.group({
      codigo: new FormControl(''),
      cuerpoColegiado: new FormControl(''),
      nombre: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  addFieldValue() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'Función agregada.',
    });
    this.libro.fieldArray.push(this.newAttribute);
    this.newAttribute = {};
  }

  deleteFieldValue(index: any) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'warning',
      title: 'Función borrada.',
    });
    this.libro.fieldArray.splice(index, 1);
  }

  // Función para desplazarse a una seccion
  showAndScrollToHiddenDiv() {
    this.hiddenDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  openDialog(element: any): void {
    const dialogRef = this.dialog.open(ModalCuerpoColegiado, {
      width: '60%',
      data: { cuerpoColegiado: element },
    });
  }

  obtenerListadoFunciones(codigo: number) {
    this.cuerposColegiadosService
      .obtenerListadoFuncionesCuerpoColegiado(codigo)
      .subscribe((data) => {
        this.listadoFuncionesCuerpoColegiado = data;
      });
  }

  obtenerCuerposColegiados() {
    this.cuerposColegiadosService
      .obtenerListadoCuerposColegiados()
      .subscribe((data) => {
        this.listadoCuerposColegiados = data;
        this.dataSource = new MatTableDataSource<CuerposColegiados>(data);
        this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
      });
  }

  generarCuerpoColegiado(): void {
    let cuerpoColegiado: CuerposColegiados = new CuerposColegiados();
    cuerpoColegiado.codigo = this.formCuerposColegiados.get('codigo')!.value;
    cuerpoColegiado.nombre = this.formCuerposColegiados.get('nombre')!.value;
    cuerpoColegiado.nombreCorto =
      this.formCuerposColegiados.get('nombreCorto')!.value;
    cuerpoColegiado.numeroNorma =
      this.formCuerposColegiados.get('numeroNorma')!.value;
    cuerpoColegiado.nombreNorma =
      this.formCuerposColegiados.get('nombreNorma')!.value;
    cuerpoColegiado.fechaNorma =
      this.formCuerposColegiados.get('fechaNorma')!.value;
    cuerpoColegiado.fechaCreacion =
      this.formCuerposColegiados.get('fechaCreacion')!.value;
    cuerpoColegiado.cantidadMiembros =
      this.formCuerposColegiados.get('cantidadMiembros')!.value;
    cuerpoColegiado.estado = this.formCuerposColegiados.get('estado')!.value;
    if (this.editar) {
      this.actualizarCuerpoColegiado(cuerpoColegiado);
    } else {
      this.registrarCuerpoColegiado(cuerpoColegiado);
    }
  }

  registrarCuerpoColegiado(cuerpoColegiado: CuerposColegiados) {
    this.cuerposColegiadosService
      .registrarCuerposColegiados(cuerpoColegiado)
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
            this.obtenerCuerposColegiados();
            this.cancelar();
            this.cancelarFunciones();
            this.crearCuerposColegiados();
            this.crearFormularioFunciones();
            this.listadoFuncionesCuerpoColegiado = [];
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  actualizarCuerpoColegiado(cuerpoColegiado: CuerposColegiados) {
    this.cuerposColegiadosService
      .actualizarCuerposColegiados(cuerpoColegiado)
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
            this.obtenerCuerposColegiados();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  editarCuerpoColegiado(element: CuerposColegiados) {
    this.showAndScrollToHiddenDiv();
    this.editar = true;
    this.obtenerListadoFunciones(element.codigo);
    this.formCuerposColegiados.get('codigo')!.setValue(element.codigo);
    this.formCuerposColegiados.get('nombre')!.setValue(element.nombre);
    this.formCuerposColegiados
      .get('nombreCorto')!
      .setValue(element.nombreCorto);
    this.formCuerposColegiados
      .get('numeroNorma')!
      .setValue(element.numeroNorma);
    this.formCuerposColegiados
      .get('nombreNorma')!
      .setValue(element.nombreNorma);
    let fechaNorma = new Date(element.fechaNorma + ' 0:00:00');
    this.formCuerposColegiados.get('fechaNorma')!.setValue(fechaNorma);
    this.formCuerposColegiados
      .get('fechaCreacion')!
      .setValue(element.fechaCreacion);
    this.formCuerposColegiados
      .get('cantidadMiembros')!
      .setValue(element.cantidadMiembros);
    this.formCuerposColegiados.get('estado')!.setValue(element.estado);
  }

  eliminarCuerpoColegiado() {
    let cuerposColegiados: CuerposColegiados = new CuerposColegiados();
    cuerposColegiados.codigo = this.formCuerposColegiados.get('codigo')!.value;
    cuerposColegiados.nombre = this.formCuerposColegiados.get('nombre')!.value;
    cuerposColegiados.nombreCorto =
      this.formCuerposColegiados.get('nombreCorto')!.value;
    cuerposColegiados.numeroNorma =
      this.formCuerposColegiados.get('numeroNorma')!.value;
    cuerposColegiados.nombreNorma =
      this.formCuerposColegiados.get('nombreNorma')!.value;
    cuerposColegiados.fechaNorma =
      this.formCuerposColegiados.get('fechaNorma')!.value;
    cuerposColegiados.fechaCreacion =
      this.formCuerposColegiados.get('fechaCreacion')!.value;
    cuerposColegiados.cantidadMiembros =
      this.formCuerposColegiados.get('cantidadMiembros')!.value;
    cuerposColegiados.estado = 0;
    this.actualizarCuerpoColegiado(cuerposColegiados);
  }

  cancelar() {
    this.formCuerposColegiados.reset();
    this.formFunciones.reset();
    this.listadoFuncionesCuerpoColegiado = [];
    this.crearCuerposColegiados();
    this.crearFormularioFunciones();
    this.obtenerCuerposColegiados();
    this.editar = false;
  }

  generarFunciones(): void {
    let funcionesCuerpoColegiado: FuncionesCuerpoColegiado =
      new FuncionesCuerpoColegiado();
    funcionesCuerpoColegiado.codigo = this.formFunciones.get('codigo')!.value;
    let cuerpoColegiado: CuerposColegiados = new CuerposColegiados();
    funcionesCuerpoColegiado.cuerpoColegiado = cuerpoColegiado;
    funcionesCuerpoColegiado.nombre = this.formFunciones.get('nombre')!.value;
    if (this.editar) {
      cuerpoColegiado.codigo = this.formCuerposColegiados.get('codigo')!.value;
    } else {
      cuerpoColegiado.codigo = this.listadoCuerposColegiados.length + 1;
    }
    if (this.editarFuncion) {
      this.actualizarFunciones(funcionesCuerpoColegiado);
    } else {
      this.registrarFunciones(funcionesCuerpoColegiado);
    }
  }

  registrarFunciones(funcionesCuerpoColegiado: FuncionesCuerpoColegiado) {
    this.cuerposColegiadosService
      .registrarFuncionesCuerpoColegiado(funcionesCuerpoColegiado)
      .subscribe(
        (data) => {
          if (data > 0) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: 'success',
              title: 'Operación exitosa.',
            });
            let codigo: number = 0;
            if (this.editar) {
              codigo = this.formCuerposColegiados.get('codigo')!.value;
            } else {
              codigo = this.listadoCuerposColegiados.length + 1;
            }
            this.obtenerListadoFunciones(codigo);
            this.cancelarFunciones();
            this.crearFormularioFunciones();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  actualizarFunciones(funcionesCuerpoColegiado: FuncionesCuerpoColegiado) {
    this.cuerposColegiadosService
      .actualizarFuncionesCuerpoColegiado(funcionesCuerpoColegiado)
      .subscribe(
        (data) => {
          if (data > 0) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });

            Toast.fire({
              icon: 'success',
              title: 'Operación exitosa.',
            });
            this.cancelarFunciones();
            this.obtenerCuerposColegiados();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  editarFunciones(element: FuncionesCuerpoColegiado) {
    this.showAndScrollToHiddenDiv();
    this.editarFuncion = true;
    this.formFunciones.get('codigo')!.setValue(element.codigo);
    this.formFunciones.get('nombre')!.setValue(element.nombre);
    this.formFunciones
      .get('cuerpoColegiado')!
      .setValue(element.cuerpoColegiado.codigo);
    this.formFunciones.get('estado')!.setValue(element.estado);
  }

  eliminarFunciones() {
    let funcionesCuerpoColegiado: FuncionesCuerpoColegiado =
      new FuncionesCuerpoColegiado();
    funcionesCuerpoColegiado.codigo = this.formFunciones.get('codigo')!.value;
    let cuerpoColegiado: CuerposColegiados = new CuerposColegiados();
    cuerpoColegiado.codigo = this.formFunciones.get('cuerpoColegiado')!.value;
    funcionesCuerpoColegiado.cuerpoColegiado = cuerpoColegiado;
    funcionesCuerpoColegiado.nombre = this.formFunciones.get('nombre')!.value;
    funcionesCuerpoColegiado.estado = 0;
    this.actualizarFunciones(funcionesCuerpoColegiado);
  }

  cancelarFunciones() {
    this.formFunciones.reset();
    this.editarFuncion = false;
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

@Component({
  selector: 'modal-cuerpo-colegiado',
  templateUrl: 'modal-cuerpo-colegiado.html',
  styleUrls: ['./cuerpos-colegiados.component.css'],
})
export class ModalCuerpoColegiado implements OnInit {
  listadoFuncionesCuerpoColegiado: FuncionesCuerpoColegiado[] = [];
  listadoIntegrantes: IntegranteCuerpoColegiado[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalCuerpoColegiado>,
    public dialog: MatDialog,
    public cuerposColegiadosService: CuerposColegiadosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.cuerposColegiadosService
      .obtenerListadoFuncionesCuerpoColegiado(data.cuerpoColegiado.codigo)
      .subscribe((data) => {
        this.listadoFuncionesCuerpoColegiado = data;
      });
    this.cuerposColegiadosService
      .obtenerListadoIntegrantesCuerpoColegiadoCodigo(data.cuerpoColegiado.codigo)
      .subscribe((data) => {
        this.listadoIntegrantes = data;
        console.log(this.listadoIntegrantes);
      });
  }

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
