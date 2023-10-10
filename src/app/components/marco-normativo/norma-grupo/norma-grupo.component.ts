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
import { InstitucionService } from 'src/app/services/institucion.service';
import { Institucion } from 'src/app/models/institucion';
import { CabecerasCentrosPoblados } from 'src/app/models/cabeceras-centros-poblados';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { SedeTipo } from 'src/app/models/sede-tipo';
import { MatSort } from '@angular/material/sort';
import { SedeService } from 'src/app/services/sede.service';
import { Sede } from 'src/app/models/sede';
import { NormaGrupo } from 'src/app/models/norma-grupo';
import { NormaService } from '../../../services/norma.service';
import { Norma } from 'src/app/models/norma';
import { NormaClasificada } from 'src/app/models/norma-clasificada';

@Component({
  selector: 'app-norma-grupo',
  templateUrl: './norma-grupo.component.html',
  styleUrls: ['./norma-grupo.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class NormaGrupoComponent {
  dataSource = new MatTableDataSource<NormaGrupo>([]);
  displayedColumns: string[] = ['index', 'grupo', 'cantidad', 'opciones'];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  dialogRef!: MatDialogRef<any>;

  constructor(
    public normaService: NormaService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerNormaGruposAgrupados();
    }
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(ModalFormularioGrupo, {
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(ModalFormularioNormaGrupo, {
      width: '70%',
      disableClose: true,
      data: { grupo: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerNormaGruposAgrupados();
  }

  obtenerNormaGruposAgrupados() {
    this.normaService.obtenerNormaGruposAgrupados().subscribe((data) => {
      this.dataSource = new MatTableDataSource<NormaGrupo>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
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
  selector: 'modal-formulario-norma-grupo',
  templateUrl: './modal-formulario-norma-grupo.html',
  styleUrls: ['./norma-grupo.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ModalFormularioNormaGrupo {
  listadoNormaGrupo: NormaGrupo[] = [];
  listadoNormaClasificada: NormaClasificada[] = [];
  listadoNormaSinClasificar: Norma[] = [];
  grupo: number = 0;

  //MAT TABLE SIN CLASIFICAR
  dataSourceGeneral = new MatTableDataSource<Norma>([]);
  displayedColumnsGeneral: string[] = ['index', 'entidad', 'norma', 'opciones'];
  @ViewChild('MatPaginatorGeneral') paginatorGeneral!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortGeneral!: MatSort;

  //MAT TABLE CLASIFICADA
  dataSourceClasificado = new MatTableDataSource<NormaClasificada>([]);
  displayedColumnsClasificado: string[] = [
    'index',
    'entidad',
    'norma',
    'opciones',
  ];
  @ViewChild('MatPaginatorClasificado') paginatorClasificado!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sortClasificado!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<ModalFormularioNormaGrupo>,
    public normaService: NormaService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerNormaGrupos();
      if (JSON.stringify(data) !== 'null') {
        this.grupo = data.grupo.codigo;
        this.obtenerNormaClasificada(this.grupo);
        this.obtenerNormaSinClasificar(this.grupo);
        console.log('Entra');
      } else {
        console.log('No entra');
      }
    }
  }

  obtenerNormaGrupos() {
    this.normaService.obtenerNormaGrupos().subscribe((data) => {
      this.listadoNormaGrupo = data;
      console.log('Grupo', this.listadoNormaGrupo);
    });
  }

  obtenerNormaSinClasificar(codigo: number) {
    this.normaService.obtenerNormaSinClasificar(codigo).subscribe((data) => {
      this.listadoNormaSinClasificar = data;
      console.log('SinClasificar', this.listadoNormaSinClasificar);
      this.dataSourceGeneral = new MatTableDataSource<Norma>(data);
      this.paginatorGeneral.firstPage();
      this.dataSourceGeneral.paginator = this.paginatorGeneral;
    });
  }

  obtenerNormaClasificada(codigo: number) {
    this.normaService.obtenerNormaClasificada(codigo).subscribe((data) => {
      this.listadoNormaClasificada = data;
      console.log('Clasificada', this.listadoNormaClasificada);
      this.dataSourceClasificado = new MatTableDataSource<NormaClasificada>(
        data
      );
      this.paginatorClasificado.firstPage();
      this.dataSourceClasificado.paginator = this.paginatorClasificado;
    });
  }

  filtrarGeneral(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGeneral.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceGeneral.paginator) {
      this.dataSourceGeneral.paginator.firstPage();
    }
  }

  filtrarCalsificado(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceClasificado.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceClasificado.paginator) {
      this.dataSourceClasificado.paginator.firstPage();
    }
  }

  adicionar(element: Norma) {
    let normaClasificada: NormaClasificada = new NormaClasificada();
    let norma: Norma = new Norma();
    norma.codigo = element.codigo;
    normaClasificada.norma = norma;
    let normaGrupo: NormaGrupo = new NormaGrupo();
    normaGrupo.codigo = this.grupo;
    normaClasificada.normaGrupo = normaGrupo;
    Swal.fire({
      title: '¿Está seguro de adicionar este elemento?',
      text: 'La siguiente operación será irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c053',
      cancelButtonColor: '#ffc107',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar opreación',
    }).then((result) => {
      if (result.isConfirmed) {
        this.normaService.registrarNormaClasificada(normaClasificada).subscribe(
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
                title: 'Elemento agregado',
              });
              this.obtenerNormaClasificada(this.grupo);
              this.obtenerNormaSinClasificar(this.grupo);
            } else {
              this.mensajeError();
            }
          },
          (err) => this.fError(err)
        );
      }
    });
  }

  eliminar(element: NormaClasificada) {
    let normaClasificada: NormaClasificada = new NormaClasificada();
    normaClasificada.codigo = element.codigo;
    let norma: Norma = new Norma();
    norma.codigo = element.norma.codigo;
    normaClasificada.norma = norma;
    let normaGrupo: NormaGrupo = new NormaGrupo();
    normaGrupo.codigo = this.grupo;
    normaClasificada.normaGrupo = normaGrupo;
    normaClasificada.estado = 0;
    Swal.fire({
      title: '¿Está seguro de quitar este elemento?',
      text: 'La siguiente operación será irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c053',
      cancelButtonColor: '#ffc107',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar opreación',
    }).then((result) => {
      if (result.isConfirmed) {
        this.normaService
          .actualizarNormaClasificada(normaClasificada)
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
                  title: 'Elemento removido',
                });
                this.obtenerNormaClasificada(this.grupo);
                this.obtenerNormaSinClasificar(this.grupo);
              } else {
                this.mensajeError();
              }
            },
            (err) => this.fError(err)
          );
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

//// MODAL CREACION GRUPO

@Component({
  selector: 'modal-formulario-grupol',
  templateUrl: './modal-formulario-grupo.html',
  styleUrls: ['./norma-grupo.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ModalFormularioGrupo {
  editar: boolean = false;

  formularioGrupo!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalFormularioGrupo>,
    private formBuilder: FormBuilder,
    public normaService: NormaService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.authService.validacionToken()) {
      this.crearformularioGrupo();
      if (JSON.stringify(data) !== 'null') {
        this.editarRepresentantLegal(data.sede);
        console.log('Entra');
      } else {
        console.log('No entra');
      }
    }
  }

  private crearformularioGrupo(): void {
    this.formularioGrupo = this.formBuilder.group({
      codigo: new FormControl(''),
      nombre: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  generarGrupo(): void {
    let normaGrupo: NormaGrupo = new NormaGrupo();
    normaGrupo.codigo = this.formularioGrupo.get('codigo')!.value;
    normaGrupo.nombre = this.formularioGrupo.get('nombre')!.value;
    normaGrupo.estado = this.formularioGrupo.get('estado')!.value;
    if (this.editar) {
      this.actualizarGrupo(normaGrupo);
    } else {
      this.registrarGrupo(normaGrupo);
    }
  }

  registrarGrupo(normaGrupo: NormaGrupo) {
    this.normaService.registrarNormaGrupo(normaGrupo).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.dialogRef.close();
          this.cancelar();
          this.crearformularioGrupo();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarGrupo(normaGrupo: NormaGrupo) {
    this.normaService.actualizarNormaGrupo(normaGrupo).subscribe(
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

  editarRepresentantLegal(element: NormaGrupo) {
    this.editar = true;
    this.formularioGrupo.get('codigo')!.setValue(element.codigo);
    this.formularioGrupo.get('nombre')!.setValue(element.nombre);
    this.formularioGrupo.get('estado')!.setValue(element.estado);
  }

  cancelar() {
    this.formularioGrupo.reset();
    this.crearformularioGrupo();
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
