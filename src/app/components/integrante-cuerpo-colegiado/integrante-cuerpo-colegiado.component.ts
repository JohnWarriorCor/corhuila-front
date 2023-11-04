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
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import { CuerposColegiados } from 'src/app/models/cuerpos-colegiados';
import { CuerposColegiadosService } from '../../services/cuerpos-colegiados.service';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/services/persona.service';
import { IntegranteCuerpoColegiado } from 'src/app/models/integrante-cuerpo-colegiado';
import { UsuarioTipo } from 'src/app/models/usuario-tipo';
import { MiembroTipo } from 'src/app/models/miembro-tipo';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-integrante-cuerpo-colegiado',
  templateUrl: './integrante-cuerpo-colegiado.component.html',
  styleUrls: ['./integrante-cuerpo-colegiado.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class IntegranteCuerpoColegiadoComponent {
  listadoCuerposColegiados: CuerposColegiados[] = [];
  listadoIntegrantesCuerpoColegiado: IntegranteCuerpoColegiado[] = [];
  fechaActual = new Date();

  dataSource = new MatTableDataSource<IntegranteCuerpoColegiado>([]);
  displayedColumns: string[] = [
    'index',
    'id',
    'nombre',
    'cc',
    'fechaInicio',
    'fechaFin',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  dialogRef!: MatDialogRef<any>;

  cuerpoColegiado!: string;
  claves!: string;

  constructor(
    private formBuilder: FormBuilder,
    public cuerposColegiadosService: CuerposColegiadosService,
    public personaService: PersonaService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerCuerposColegiados();
      this.obtenerIntegrantesCuerpoColegiado();
    }
  }

  restaurar() {
    this.obtenerIntegrantesCuerpoColegiado();
    this.cuerpoColegiado = '';
    this.claves = '';
  }

  obtenerIntegrantesCuerpoColegiado() {
    this.cuerposColegiadosService
      .obtenerListadoIntegrantesCuerpoColegiado()
      .subscribe((data) => {
        this.listadoIntegrantesCuerpoColegiado = data;
        console.log(data);
        this.dataSource = new MatTableDataSource<IntegranteCuerpoColegiado>(
          data
        );
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

  botonActivo(element: IntegranteCuerpoColegiado): boolean {
    if (element.fechaFin == null) {
      return false;
    } else {
      const fechaJson = new Date(element.fechaFin);
      return fechaJson <= this.fechaActual;
    }
  }

  obtenerCuerposColegiados() {
    this.cuerposColegiadosService
      .obtenerListadoCuerposColegiados()
      .subscribe((data) => {
        this.listadoCuerposColegiados = data;
      });
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(
      ModalFormularioIntegranteCuerpoColegiado,
      {
        width: '70%',
        disableClose: true,
      }
    );
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(
      ModalFormularioIntegranteCuerpoColegiado,
      {
        width: '70%',
        disableClose: true,
        data: { sede: element },
      }
    );
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerIntegrantesCuerpoColegiado();
  }

  actualizarIntegrante(integrante: IntegranteCuerpoColegiado) {
    this.cuerposColegiadosService.actualizarIntegrante(integrante).subscribe(
      (data) => {
        if (data > 0) {
          this.obtenerIntegrantesCuerpoColegiado();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarIntegrante(element: IntegranteCuerpoColegiado) {
    this.editarFormulario(element);
  }

  desvincularIntegrante(element: IntegranteCuerpoColegiado) {
    Swal.fire({
      title: '¿Está seguro de desvincular este integrante?',
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
        (element.fechaFin = new Date()), this.actualizarIntegrante(element);
        Swal.fire({
          icon: 'success',
          title: 'Integrante desvinculado.',
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
  selector: 'modal-formulario-integrante-cuerpo-colegiado',
  templateUrl: 'modal-formulario-integrante-cuerpo-colegiado.html',
  styleUrls: ['./integrante-cuerpo-colegiado.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ModalFormularioIntegranteCuerpoColegiado {
  editar: boolean = false;
  editarFuncion: boolean = false;
  tipo: boolean = false;
  war: any;

  listadoCuerposColegiados: CuerposColegiados[] = [];
  listadoIntegrantesCuerpoColegiado: IntegranteCuerpoColegiado[] = [];
  persona: Persona[] = [];

  formIntegrante!: FormGroup;
  fechaLimiteMinima!: any;
  fechaLimiteMinimaVigencia!: any;

  constructor(
    public dialogRef: MatDialogRef<ModalFormularioIntegranteCuerpoColegiado>,
    private formBuilder: FormBuilder,
    public cuerposColegiadosService: CuerposColegiadosService,
    public personaService: PersonaService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fechaLimiteMinima = new Date().toISOString().split('T')[0];
    if (this.authService.validacionToken()) {
      this.obtenerCuerposColegiados();
      this.obtenerCuerposColegiadosDisponibilidad();
      this.obtenerIntegrantesCuerpoColegiado();
      this.crearFormularioIntegrante();
      if (JSON.stringify(data) !== 'null') {
        this.editarIntegrante(data.sede);
        console.log('Entra');
      } else {
        console.log('No entra');
      }
    }
  }
  private crearFormularioIntegrante(): void {
    this.formIntegrante = this.formBuilder.group({
      codigo: new FormControl(''),
      cuerpoColegiado: new FormControl('', Validators.required),
      personaCodigo: new FormControl(''),
      personaIdentificacion: new FormControl('', Validators.required),
      personaNombre: new FormControl('', Validators.required),
      codigoNorma: new FormControl('', Validators.required),
      usuarioTipo: new FormControl(''),
      miembroTipo: new FormControl(''),
      fechaInicio: new FormControl('', Validators.required),
      fechaFin: new FormControl(''),
      observacion: new FormControl(''),
      estado: new FormControl(''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  activarTipoMiembro(element: string) {
    if (element.toUpperCase() === 'ASAMBLEA GENERAL') {
      this.tipo = true;
    } else {
      this.tipo = false;
    }
  }

  limiteVigencia() {
    this.fechaLimiteMinimaVigencia = new Date(
      this.formIntegrante.get('fechaInicio')!.value
    )
      .toISOString()
      .split('T')[0];
  }

  obtenerIntegrantesCuerpoColegiado() {
    this.cuerposColegiadosService
      .obtenerListadoIntegrantesCuerpoColegiado()
      .subscribe((data) => {
        this.listadoIntegrantesCuerpoColegiado = data;
      });
  }

  obtenerCuerposColegiados() {
    this.cuerposColegiadosService
      .obtenerListadoCuerposColegiados()
      .subscribe((data) => {
        //this.listadoCuerposColegiados = data;
      });
  }

  obtenerCuerposColegiadosDisponibilidad() {
    this.cuerposColegiadosService
      .obtenerCuerpoColegiadoCodigoDisponibilidad()
      .subscribe((data) => {
        this.listadoCuerposColegiados = data;
        console.log(data);
      });
  }

  buscarPersona() {
    this.personaService
      .obtenerPersonaIdentificacion(
        this.formIntegrante.get('personaIdentificacion')!.value
      )
      .subscribe((data) => {
        if (JSON.stringify(data) != '[]') {
          this.persona = data;
          console.log(this.persona);
          this.formIntegrante
            .get('personaNombre')!
            .setValue(data[0].nombre + ' ' + data[0].apellido);
          this.formIntegrante.get('personaCodigo')!.setValue(data[0].codigo);
        } else {
          Swal.fire({
            icon: 'warning',
            title:
              'Ninguna persona coincide con el número de documento digitado. Intente nuevamente. Gracias.',
            confirmButtonColor: '#006983',
            confirmButtonText: 'Listo',
          });
        }
      });
  }

  generarIntegrante(): void {
    let integrante: IntegranteCuerpoColegiado = new IntegranteCuerpoColegiado();
    integrante.codigo = this.formIntegrante.get('codigo')!.value;
    let cuerpoColegiado: CuerposColegiados = new CuerposColegiados();
    cuerpoColegiado.codigo = this.formIntegrante.get('cuerpoColegiado')!.value;
    integrante.cuerpoColegiado = cuerpoColegiado;
    integrante.personaCodigo = this.formIntegrante.get('personaCodigo')!.value;
    integrante.codigoNorma = this.formIntegrante.get('codigoNorma')!.value;
    let usuarioTipo: UsuarioTipo = new UsuarioTipo();
    usuarioTipo.codigo = this.formIntegrante.get('usuarioTipo')!.value;
    integrante.usuarioTipo = usuarioTipo;
    let miebroTipo: MiembroTipo = new MiembroTipo();
    miebroTipo.codigo = this.formIntegrante.get('miembroTipo')!.value;
    integrante.miembroTipo = miebroTipo;
    integrante.fechaInicio = this.formIntegrante.get('fechaInicio')!.value;
    integrante.fechaFin = this.formIntegrante.get('fechaFin')!.value;
    integrante.observacion = this.formIntegrante.get('observacion')!.value;
    integrante.estado = this.formIntegrante.get('estado')!.value;
    if (this.editar) {
      this.actualizarIntegrante(integrante);
    } else {
      this.registraIntegrante(integrante);
    }
  }

  registraIntegrante(integrante: IntegranteCuerpoColegiado) {
    this.cuerposColegiadosService.registrarIntegrante(integrante).subscribe(
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
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarIntegrante(integrante: IntegranteCuerpoColegiado) {
    this.cuerposColegiadosService.actualizarIntegrante(integrante).subscribe(
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

  editarIntegrante(element: IntegranteCuerpoColegiado) {
    this.activarTipoMiembro(element.cuerpoColegiado.nombre);
    this.editar = true;
    this.formIntegrante.get('codigo')!.setValue(element.codigo);
    this.formIntegrante
      .get('cuerpoColegiado')!
      .setValue(element.cuerpoColegiado.codigo);
    this.formIntegrante.get('personaCodigo')!.setValue(element.personaCodigo);
    this.formIntegrante
      .get('personaIdentificacion')!
      .setValue(element.personaIdentificacion);
    this.formIntegrante
      .get('personaNombre')!
      .setValue(element.personaNombre + ' ' + element.personaApellido);
    this.formIntegrante.get('codigoNorma')!.setValue('' + element.codigoNorma);
    this.formIntegrante
      .get('usuarioTipo')!
      .setValue('' + element.usuarioTipo.codigo);
    this.formIntegrante
      .get('miembroTipo')!
      .setValue('' + element.miembroTipo.codigo);
    this.formIntegrante.get('fechaInicio')!.setValue(element.fechaInicio);
    this.formIntegrante.get('fechaFin')!.setValue(element.fechaFin);
    this.formIntegrante.get('observacion')!.setValue(element.observacion);
    this.formIntegrante.get('estado')!.setValue(element.estado);
  }

  desvincularIntegrante() {
    let integrante: IntegranteCuerpoColegiado = new IntegranteCuerpoColegiado();
    integrante.codigo = this.formIntegrante.get('codigo')!.value;
    let cuerpoColegiado: CuerposColegiados = new CuerposColegiados();
    cuerpoColegiado.codigo = this.formIntegrante.get('cuerpoColegiado')!.value;
    integrante.cuerpoColegiado = cuerpoColegiado;
    integrante.personaCodigo = this.formIntegrante.get('personaCodigo')!.value;
    integrante.codigoNorma = this.formIntegrante.get('codigoNorma')!.value;
    let usuarioTipo: UsuarioTipo = new UsuarioTipo();
    usuarioTipo.codigo = this.formIntegrante.get('usuarioTipo')!.value;
    integrante.usuarioTipo = usuarioTipo;
    let miebroTipo: MiembroTipo = new MiembroTipo();
    miebroTipo.codigo = this.formIntegrante.get('miembroTipo')!.value;
    integrante.miembroTipo = miebroTipo;
    integrante.fechaInicio = this.formIntegrante.get('fechaInicio')!.value;
    integrante.fechaFin = new Date();
    integrante.observacion = this.formIntegrante.get('observacion')!.value;
    integrante.estado = 0;
    this.actualizarIntegrante(integrante);
  }

  cancelar() {
    this.formIntegrante.reset();
    this.crearFormularioIntegrante();
    this.obtenerIntegrantesCuerpoColegiado();
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
