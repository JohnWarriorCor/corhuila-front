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
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/services/persona.service';
import { RepresentanteLegalService } from '../../services/representante-legal.service';
import { RepresentanteLegal } from 'src/app/models/representante-legal';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

@Component({
  selector: 'app-representante-legal',
  templateUrl: './representante-legal.component.html',
  styleUrls: ['./representante-legal.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class RepresentanteLegalComponent {
  listadoPersona: Persona[] = [];
  listadoRepresentanteLegal: RepresentanteLegal[] = [];
  fechaActual = new Date();

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

  dialogRef!: MatDialogRef<any>;
  claves!: string;

  constructor(
    public personaService: PersonaService,
    public representanteLegalService: RepresentanteLegalService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerListadoRepresentanteLegal();
      this.obtenerPersonas();
    }
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(ModalFormularioRepresentanteLegal, {
      width: '70%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(ModalFormularioRepresentanteLegal, {
      width: '70%',
      disableClose: true,
      data: { sede: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerListadoRepresentanteLegal();
  }

  obtenerPersonas() {
    this.personaService.obtenerPersonas().subscribe((data) => {
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

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  restaurar() {
    this.obtenerListadoRepresentanteLegal();
    this.claves = '';
  }

  botonActivo(element: RepresentanteLegal): boolean {
    const fechaJson = new Date(element.fechaFin);
    return fechaJson <= this.fechaActual;
  }

  actualizarRepresentantLegal(representantLegal: RepresentanteLegal) {
    this.representanteLegalService
      .actualizarRepresentanteLegal(representantLegal)
      .subscribe(
        (data) => {
          if (data > 0) {
            this.obtenerListadoRepresentanteLegal();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  editarRepresentantLegal(element: RepresentanteLegal) {
    this.editarFormulario(element);
  }

  eliminarRepresentantLegal(element: RepresentanteLegal) {
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
        this.actualizarRepresentantLegal(element);
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

//// MODAL

@Component({
  selector: 'modal-formulario-representante-legal',
  templateUrl: './modal-formulario-representante-legal.html',
  styleUrls: ['./representante-legal.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ModalFormularioRepresentanteLegal {
  editar: boolean = false;
  listadoPersona: Persona[] = [];
  listadoRepresentanteLegal: RepresentanteLegal[] = [];
  correo: string = '';

  formRepresentanteLegal!: FormGroup;

  fechaLimiteMinima!: any;
  fechaLimiteMinimaVigencia!: any;

  constructor(
    public dialogRef: MatDialogRef<ModalFormularioRepresentanteLegal>,
    private formBuilder: FormBuilder,
    public personaService: PersonaService,
    public representanteLegalService: RepresentanteLegalService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fechaLimiteMinima = new Date();
    if (this.authService.validacionToken()) {
      this.crearFormRepresentanteLegal();
      this.obtenerPersonas();
      if (JSON.stringify(data) !== 'null') {
        this.editarRepresentantLegal(data.sede);
      }
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  limiteVigencia() {
    this.fechaLimiteMinimaVigencia = new Date(
      this.formRepresentanteLegal.get('fechaInicio')!.value
    );
  }

  obtenerPersonas() {
    this.personaService.obtenerPersonas().subscribe((data) => {
      this.listadoPersona = data;
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
            this.dialogRef.close();
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
            this.dialogRef.close();
          } else {
            this.mensajeError();
          }
        },
        (err) => this.fError(err)
      );
  }

  editarRepresentantLegal(element: RepresentanteLegal) {
    this.editar = true;
    this.formRepresentanteLegal.get('codigo')!.setValue(element.codigo);
    this.formRepresentanteLegal
      .get('persona')!
      .setValue(element.persona.codigo);
    this.precargaCorreo(element.persona);
    this.formRepresentanteLegal.get('norma')!.setValue('' + element.norma);
    this.formRepresentanteLegal
      .get('fechaInicio')!
      .setValue(element.fechaInicio);
    this.formRepresentanteLegal.get('fechaFin')!.setValue(element.fechaFin);
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
