import { Component, OnInit, ViewChild, Inject } from '@angular/core';
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
import { CuerposColegiadosService } from '../../../services/cuerpos-colegiados.service';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/services/persona.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { NormaService } from '../../../services/norma.service';
import { EntidadExterna } from 'src/app/models/entidad-externa';
import { NormaTipo } from 'src/app/models/norma-tipo';
import { Norma } from 'src/app/models/norma';
import { saveAs } from 'file-saver';
import { NormogramaExcelService } from 'src/app/services/nomograma-excel.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NormaDeroga } from 'src/app/models/norma-deroga';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-norma',
  templateUrl: './norma.component.html',
  styleUrls: ['./norma.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class NormaComponent {
  listadoNorma: Norma[] = [];
  excel: boolean = false;

  dataSource = new MatTableDataSource<Norma>([]);
  displayedColumns: string[] = [
    'index',
    'nombreEntidad',
    'nombre',
    'fechaExpedicion',
    'fechaVigencia',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  dialogRef!: MatDialogRef<any>;

  title = 'angular-export-to-excel';

  dataForExcel: any[] = [];
  dataNorma: any[] = [];

  fechaActual = new Date();

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe,
    public normaService: NormaService,
    public normogramaExcelService: NormogramaExcelService
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerListadoNormas();
    }
  }

  exportToExcel() {
    this.listadoNorma = [];
    this.normaService.obtenerListadoNormas().subscribe((data) => {
      this.listadoNorma = data;
    });
    this.dataNorma.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row));
    });
    let fecha = this.datePipe.transform(Date.now(), 'dd-MM-yyyy h:mm a');
    let reportData = {
      title: 'Normograma CORHUILA ' + fecha,
      data: this.dataForExcel,
      headers: Object.keys(this.dataNorma[0]),
    };

    this.normogramaExcelService.exportExcel(reportData);
  }

  crearDatasource() {
    for (let index = 0; index < this.listadoNorma.length; index++) {
      let deroga = '';
      if (this.listadoNorma[index].deroga == 1) {
        deroga = 'SI';
      } else {
        deroga = 'NO';
      }
      if (this.listadoNorma[index].cuerpoColegiadoCodigo != 0) {
        this.dataNorma.push({
          ORIGEN: this.listadoNorma[index].entidad,
          'TIPO DE DOCUMENTO': this.listadoNorma[index].normaTipo,
          'No. NORMA': this.listadoNorma[index].numero,
          'FECHA DE EXPEDICIÓN': this.datePipe.transform(
            this.listadoNorma[index].fechaExpedicion,
            'dd-MM-yyyy'
          ),
          'FECHA VIGENCIA': this.datePipe.transform(
            this.listadoNorma[index].fechaVigencia,
            'dd-MM-yyyy'
          ),
          'ENTIDAD DE ORIGEN': this.listadoNorma[index].cuerpoColegiado,
          NOMBRE: this.listadoNorma[index].nombre,
          'MEDIO EN EL QUE SE ENCUENTRA': this.listadoNorma[index].medio,
          'UBICACIÓN DEL DOCUMENTO': this.listadoNorma[index].url,
          '¿DEROGA?': deroga,
          OBSERVACIÓN: this.listadoNorma[index].observacion,
        });
      }
      if (this.listadoNorma[index].rectoria != 0) {
        this.dataNorma.push({
          ORIGEN: this.listadoNorma[index].entidad,
          'TIPO DE DOCUMENTO': this.listadoNorma[index].normaTipo,
          'No. NORMA': this.listadoNorma[index].numero,
          'FECHA DE EXPEDICIÓN': this.datePipe.transform(
            this.listadoNorma[index].fechaExpedicion,
            'dd-MM-yyyy'
          ),
          'FECHA VIGENCIA': this.datePipe.transform(
            this.listadoNorma[index].fechaVigencia,
            'dd-MM-yyyy'
          ),
          'ENTIDAD DE ORIGEN': 'RECTORÍA',
          NOMBRE: this.listadoNorma[index].nombre,
          'MEDIO EN EL QUE SE ENCUENTRA': this.listadoNorma[index].medio,
          'UBICACIÓN DEL DOCUMENTO': this.listadoNorma[index].url,
          '¿DEROGA?': deroga,
          OBSERVACIÓN: this.listadoNorma[index].observacion,
        });
      }
      if (this.listadoNorma[index].entidadExternaCodigo != 0) {
        this.dataNorma.push({
          ORIGEN: this.listadoNorma[index].entidad,
          'TIPO DE DOCUMENTO': this.listadoNorma[index].normaTipo,
          'No. NORMA': this.listadoNorma[index].numero,
          'FECHA DE EXPEDICIÓN': this.datePipe.transform(
            this.listadoNorma[index].fechaExpedicion,
            'dd-MM-yyyy'
          ),
          'FECHA VIGENCIA': this.datePipe.transform(
            this.listadoNorma[index].fechaVigencia,
            'dd-MM-yyyy'
          ),
          'ENTIDAD DE ORIGEN': this.listadoNorma[index].entidadExterna,
          NOMBRE: this.listadoNorma[index].nombre,
          'MEDIO EN EL QUE SE ENCUENTRA': this.listadoNorma[index].medio,
          'UBICACIÓN DEL DOCUMENTO': this.listadoNorma[index].url,
          '¿DEROGA?': deroga,
          OBSERVACIÓN: this.listadoNorma[index].observacion,
        });
      }
    }
  }

  registrarFormulario(): void {
    this.dialogRef = this.dialog.open(ModalFormularioNorma, {
      width: '70%',
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  registrarFormularioDeroga(element: any): void {
    this.dialogRef = this.dialog.open(ModalFormularioDeroga, {
      width: '70%',
      disableClose: true,
      data: { norma: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  editarFormulario(element: any): void {
    this.dialogRef = this.dialog.open(ModalFormularioNorma, {
      width: '70%',
      disableClose: true,
      data: { sede: element },
    });
    this.dialogRef.afterClosed().subscribe(() => {
      this.onModalClosed();
    });
  }

  onModalClosed() {
    this.obtenerListadoNormas();
  }

  obtenerListadoNormas() {
    this.normaService.obtenerListadoNormas().subscribe((data) => {
      this.listadoNorma = data;
      this.dataSource = new MatTableDataSource<Norma>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
      this.crearDatasource();
    });
  }

  botonActivo(element: Norma): boolean {
    const fechaJson = new Date(element.fechaVigencia);
    return fechaJson <= this.fechaActual;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalEntidadExterna, {
      width: '60%',
    });
  }

  actualizarNorma(norma: Norma) {
    this.normaService.actualizarNorma(norma).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
          });
          this.obtenerListadoNormas();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarNorma(element: Norma) {
    this.editarFormulario(element);
  }

  eliminarNorma(element: Norma) {
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
        this.actualizarNorma(element);
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

//// MODALNORMA

@Component({
  selector: 'modal-formulario-norma',
  templateUrl: 'modal-formulario-norma.html',
  styleUrls: ['./norma.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ModalFormularioNorma {
  editar: boolean = false;
  editarDeroga: boolean = false;
  tipo: boolean = false;
  war: any;
  interna: boolean = false;
  externa: boolean = false;
  cuerpoColegiado: boolean = false;
  fechaActual = new Date();

  lsitadoNormaDeroga: NormaDeroga[] = [];
  listadoNorma: Norma[] = [];
  listadoCuerposColegiados: CuerposColegiados[] = [];
  listadoEntidadExterna: EntidadExterna[] = [];
  listadoNormaTipo: NormaTipo[] = [];
  persona: Persona[] = [];
  formularioDeroga!: FormGroup;

  formNorma!: FormGroup;

  fechaLimiteMinima!: any;
  fechaLimiteMinimaVigencia!: any;

  filteredOptions!: Observable<Norma[]>;
  myControl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<ModalFormularioNorma>,
    private formBuilder: FormBuilder,
    public cuerposColegiadosService: CuerposColegiadosService,
    public personaService: PersonaService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe,
    public normaService: NormaService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.fechaLimiteMinima = new Date();
    if (this.authService.validacionToken()) {
      this.obtenerCuerposColegiados();
      this.crearFormularioNorma();
      this.obtenerEntidadesExternas();
      if (JSON.stringify(data) !== 'null') {
        this.editarNorma(data.sede);
        console.log('Entra');
      } else {
        console.log('No entra');
      }
    }
  }

  private crearFormularioNorma(): void {
    this.formNorma = this.formBuilder.group({
      codigo: new FormControl(''),
      entidadCodigo: new FormControl('', Validators.required),
      rectoria: new FormControl(''),
      cuerpoColegiadoCodigo: new FormControl(''),
      entidadExternaCodigo: new FormControl(''),
      normaTipoCodigo: new FormControl('', Validators.required),
      numero: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      medioCodigo: new FormControl('', Validators.required),
      fechaExpedicion: new FormControl('', Validators.required),
      fechaVigencia: new FormControl(''),
      deroga: new FormControl('', Validators.required),
      observacion: new FormControl(''),
      estado: new FormControl(''),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  obtenerEntidadesExternas() {
    this.normaService.obtenerEntidadesExternas().subscribe((data) => {
      this.listadoEntidadExterna = data;
    });
  }

  obtenerNormasTipo(codigo: number) {
    this.normaService.obtenerNormasTipo(codigo).subscribe((data) => {
      this.listadoNormaTipo = data;
    });
  }

  entidadInterna() {
    this.obtenerNormasTipo(1);
    this.interna = true;
    this.externa = false;
    this.formNorma.get('entidadExternaCodigo')!.setValue(0);
  }

  entidadCuerpoColegiado() {
    this.cuerpoColegiado = true;
  }

  entidadRectoria() {
    this.cuerpoColegiado = false;
  }

  entidadExterna() {
    this.obtenerNormasTipo(2);
    this.interna = false;
    this.externa = true;
    this.cuerpoColegiado = false;
    this.formNorma.get('cuerpoColegiadoCodigo')!.setValue(0);
    this.formNorma.get('rectoria')!.setValue(0);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalEntidadExterna, {
      width: '60%',
    });
  }

  limiteVigencia() {
    this.fechaLimiteMinimaVigencia = new Date(
      this.formNorma.get('fechaExpedicion')!.value
    );
  }

  obtenerCuerposColegiados() {
    this.cuerposColegiadosService
      .obtenerListadoCuerposColegiados()
      .subscribe((data) => {
        this.listadoCuerposColegiados = data;
      });
  }

  generarNorma(): void {
    let norma: Norma = new Norma();
    norma.codigo = this.formNorma.get('codigo')!.value;
    norma.entidadCodigo = this.formNorma.get('entidadCodigo')!.value;
    norma.rectoria = this.formNorma.get('rectoria')!.value;
    norma.cuerpoColegiadoCodigo = this.formNorma.get(
      'cuerpoColegiadoCodigo'
    )!.value;
    norma.entidadExternaCodigo = this.formNorma.get(
      'entidadExternaCodigo'
    )!.value;
    norma.normaTipoCodigo = this.formNorma.get('normaTipoCodigo')!.value;
    norma.numero = this.formNorma.get('numero')!.value;
    norma.nombre = this.formNorma.get('nombre')!.value;
    norma.url = this.formNorma.get('url')!.value;
    norma.medioCodigo = this.formNorma.get('medioCodigo')!.value;
    norma.fechaExpedicion = this.formNorma.get('fechaExpedicion')!.value;
    norma.fechaVigencia = this.formNorma.get('fechaVigencia')!.value;
    norma.deroga = this.formNorma.get('deroga')!.value;
    norma.observacion = this.formNorma.get('observacion')!.value;
    norma.estado = this.formNorma.get('estado')!.value;
    console.log('save: ', norma);

    if (this.editar) {
      this.actualizarNorma(norma);
    } else {
      this.registraNorma(norma);
    }
  }

  registraNorma(norma: Norma) {
    this.normaService.registrarNorma(norma).subscribe(
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
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarNorma(norma: Norma) {
    this.normaService.actualizarNorma(norma).subscribe(
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

  editarNorma(element: Norma) {
    this.editar = true;
    this.obtenerNormasTipo(element.entidadCodigo);
    this.formNorma.get('codigo')!.setValue(element.codigo);
    this.formNorma.get('entidadCodigo')!.setValue('' + element.entidadCodigo);
    if (element.entidadCodigo == 1) {
      this.entidadInterna();
      if (element.rectoria == 0) {
        this.entidadCuerpoColegiado();
      }
    } else {
      this.entidadExterna();
    }
    this.formNorma
      .get('entidadExternaCodigo')!
      .setValue(element.entidadExternaCodigo);
    this.formNorma.get('rectoria')!.setValue('' + element.rectoria);
    this.formNorma
      .get('cuerpoColegiadoCodigo')!
      .setValue(element.cuerpoColegiadoCodigo);
    if (element.entidadCodigo == 2) {
      this.formNorma.get('normaTipoCodigo')!.setValue(element.normaTipoCodigo);
    } else {
      this.formNorma
        .get('normaTipoCodigo')!
        .setValue('' + element.normaTipoCodigo);
    }
    this.formNorma.get('numero')!.setValue(element.numero);
    this.formNorma.get('nombre')!.setValue(element.nombre);
    this.formNorma.get('url')!.setValue(element.url);
    this.formNorma.get('medioCodigo')!.setValue('' + element.medioCodigo);
    this.formNorma.get('fechaExpedicion')!.setValue(element.fechaExpedicion);
    this.formNorma.get('fechaVigencia')!.setValue(element.fechaVigencia);
    this.formNorma.get('deroga')!.setValue('' + element.deroga);
    this.formNorma.get('observacion')!.setValue(element.observacion);
    this.formNorma.get('estado')!.setValue(element.estado);
  }

  eliminarNorma(element: Norma) {}

  cancelar() {
    this.formNorma.reset();
    this.crearFormularioNorma();
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

//MODALDEROGA

@Component({
  selector: 'modal-formulario-deroga',
  templateUrl: 'modal-formulario-deroga.html',
  styleUrls: ['./norma.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
})
export class ModalFormularioDeroga {
  editar: boolean = false;
  fechaActual = new Date();

  lsitadoNormaDeroga: NormaDeroga[] = [];
  listadoNorma: Norma[] = [];
  formularioDeroga!: FormGroup;

  filteredOptions!: Observable<Norma[]>;
  myControl = new FormControl('');

  constructor(
    public dialogRef: MatDialogRef<ModalFormularioDeroga>,
    private formBuilder: FormBuilder,
    public cuerposColegiadosService: CuerposColegiadosService,
    public personaService: PersonaService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe,
    public normaService: NormaService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.crearFormularioDeroga();
    if (this.authService.validacionToken()) {
      this.obtenerListadoNormas();
      if (JSON.stringify(data) !== 'null') {
        this.obtenerListadoDeroga();
        console.log('Entra');
      } else {
        console.log('No entra');
      }
    }
  }

  private _filter(value: string): Norma[] {
    console.log(value);
    const filterValue = value.toLowerCase();

    return this.listadoNorma.filter((option) =>
      option.nombreCompleto.toLowerCase().includes(filterValue)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  obtenerListadoNormas() {
    this.normaService.obtenerNormasNoDerogadas().subscribe((data) => {
      this.listadoNorma = data;
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value || ''))
      );
    });
  }

  derogatTotal() {
    Swal.fire({
      icon: 'warning',
      title: 'Mensaje advertencia deroga total.',
      confirmButtonColor: '#006983',
      confirmButtonText: 'Listo',
    });
  }

  obtenerListadoDeroga() {
    this.normaService
      .obtenerNormaDerogada(this.data.norma.codigo)
      .subscribe((data) => {
        this.lsitadoNormaDeroga = data;
      });
  }

  private crearFormularioDeroga(): void {
    this.formularioDeroga = this.formBuilder.group({
      codigo: new FormControl(''),
      derogaTipoCodigo: new FormControl('', Validators.required),
      normaPadreCodigo: new FormControl('', Validators.required),
      normaHijoCodigo: new FormControl('', Validators.required),
      observacion: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  asignarNormaHijo(codigo: number) {
    this.formularioDeroga.get('normaHijoCodigo')!.setValue(codigo);
    this.formularioDeroga
      .get('normaPadreCodigo')!
      .setValue(this.data.norma.codigo);
    console.log('HIJO', this.formularioDeroga.get('normaHijoCodigo')!.value);
    console.log('PADRE', this.formularioDeroga.get('normaPadreCodigo')!.value);
  }

  preguntaCrear() {
    Swal.fire({
      title: '¿Está seguro de derogar esta norma?',
      text: 'La siguiente operación será irreversible',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c053',
      cancelButtonColor: '#ffc107',
      confirmButtonText: 'Si, estoy seguro',
      cancelButtonText: 'Cancelar opreación',
    }).then((result) => {
      if (result.isConfirmed) {
        this.generarNormaDeroga();
        Swal.fire({
          icon: 'success',
          title: 'Norma derogada.',
          confirmButtonColor: '#006983',
          confirmButtonText: 'Listo',
        });
      }
    });
  }

  preguntaEliminar(element: NormaDeroga) {
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
        this.actualizarDeroga(element);
        Swal.fire({
          icon: 'success',
          title: 'Elemento borrado.',
          confirmButtonColor: '#006983',
          confirmButtonText: 'Listo',
        });
      }
    });
  }

  generarNormaDeroga(): void {
    let normaDeroga: NormaDeroga = new NormaDeroga();
    normaDeroga.codigo = this.formularioDeroga.get('codigo')!.value;
    normaDeroga.derogaTipoCodigo =
      +this.formularioDeroga.get('derogaTipoCodigo')!.value;
    normaDeroga.normaPadreCodigo =
      this.formularioDeroga.get('normaPadreCodigo')!.value;
    normaDeroga.normaHijoCodigo =
      this.formularioDeroga.get('normaHijoCodigo')!.value;
    normaDeroga.observacion = this.formularioDeroga.get('observacion')!.value;
    normaDeroga.estado = this.formularioDeroga.get('estado')!.value;
    if (this.editar) {
      this.actualizarDeroga(normaDeroga);
    } else {
      this.registrarDeroga(normaDeroga);
    }
  }

  registrarDeroga(normaDeroga: NormaDeroga) {
    this.normaService.registrarNormaDeroga(normaDeroga).subscribe(
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

          if (this.formularioDeroga.get('derogaTipoCodigo')!.value == 1) {
            this.crearFormularioDeroga();
            let norma: Norma = new Norma();
            norma.codigo = normaDeroga.normaHijoCodigo;
            norma.fechaVigencia = new Date();
            this.normaService.suspenderNorma(norma).subscribe(
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
                    title: 'Norma derogada.',
                  });
                  this.obtenerListadoNormas();
                } else {
                  this.mensajeError();
                }
              },
              (err) => this.fError(err)
            );
          }
        } else {
          this.mensajeError();
        }
        this.cancelar();
        this.obtenerListadoDeroga();
        this.obtenerListadoNormas();
      },
      (err) => this.fError(err)
    );
  }

  actualizarDeroga(normaDeroga: NormaDeroga) {
    this.normaService.actualizarNormaDeroga(normaDeroga).subscribe(
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
          this.cancelar();
          this.obtenerListadoDeroga();
          this.obtenerListadoNormas();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  /* editarDerogaes(element: FuncionesCuerpoColegiado) {
    this.editarDeroga = true;
    this.formFunciones.get('codigo')!.setValue(element.codigo);
    this.formFunciones.get('nombre')!.setValue(element.nombre);
    this.formFunciones
      .get('cuerpoColegiado')!
      .setValue(element.cuerpoColegiado.codigo);
    this.formFunciones.get('estado')!.setValue(element.estado);
    console.log(element);
  } */
  /*
  eliminarDeroga(element: NormaDeroga) {
    element.estado = 0;
    this.actualizarDeroga(element);
  } */

  cancelar() {
    this.formularioDeroga.reset();
    this.editar = false;
    this.myControl.reset();
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

//// MODAL ENTIDAD EXTERNA

@Component({
  selector: 'modal-entidad-externa',
  templateUrl: 'modal-entidad-externa.html',
  styleUrls: ['./norma.component.css'],
})
export class ModalEntidadExterna implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalEntidadExterna>,
    public dialog: MatDialog,
    public cuerposColegiadosService: CuerposColegiadosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
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
      title: 'Se agregó con éxito.',
    });
  }
}
