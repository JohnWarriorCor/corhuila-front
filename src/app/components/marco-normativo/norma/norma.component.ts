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
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { NormogramaExcelService } from 'src/app/services/nomograma-excel.service';
import { HttpClient } from '@angular/common/http';

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
    'entidad',
    'nombreEntidad',
    'tipo',
    'numero',
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

  normograma = [
    {
      'GRUPO OBJETIVO': 10011,
      'ORIGEN': 'A',
      'TIPO DE DOCUMENTO': 'Sales',
      'No. NORMA': 'Sales',
      'FECHA DE EXPEDICIÓN': 'Jan',
      'ENTIDAD DE ORIGEN': 2020,
      'NOMBRE': 132412,
      'MEDIO EN EL QUE SE ENCUENTRA': '55555',
      'UBICACIÓN DEL DOCUMENTO': 12,
      '¿DEROGA?': 35,
      'OBSERVACIÓN': 35,
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    public cuerposColegiadosService: CuerposColegiadosService,
    public personaService: PersonaService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe,
    public normaService: NormaService,
    public normogramaExcelService: NormogramaExcelService,
    private http: HttpClient
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerListadoNormas();
    }
  }

  exportToExcel() {
    this.dataNorma.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row));
    });
    let fecha = this.datePipe.transform(Date.now(), 'dd-MM-yyyy');
    let reportData = {
      title: 'Normograma CORHUILA ' + fecha,
      data: this.dataForExcel,
      headers: Object.keys(this.dataNorma[0]),
    };

    this.normogramaExcelService.exportExcel(reportData);
  }

  crearDatasource(){
    for (let index = 0; index < this.listadoNorma.length; index++) {
      this.dataNorma.push( {
        'GRUPO OBJETIVO': this.listadoNorma[index].codigo,
        'ORIGEN': this.listadoNorma[index].entidad,
        'TIPO DE DOCUMENTO': this.listadoNorma[index].normaTipo,
        'No. NORMA': this.listadoNorma[index].numero,
        'FECHA DE EXPEDICIÓN': this.listadoNorma[index].fechaExpedicion,
        'ENTIDAD DE ORIGEN': this.listadoNorma[index].cuerpoColegiado,
        'NOMBRE': this.listadoNorma[index].nombre,
        'MEDIO EN EL QUE SE ENCUENTRA': this.listadoNorma[index].medio,
        'UBICACIÓN DEL DOCUMENTO': this.listadoNorma[index].url,
        '¿DEROGA?': this.listadoNorma[index].deroga,
        'OBSERVACIÓN': this.listadoNorma[index].observacion,
      },)
    }
    console.log(this.dataNorma);
  }

  exportTableToExcel() {
    // Obtener la referencia de la tabla desde el DOM
    const table = document.getElementById('miTabla');

    // Crear una nueva instancia de Workbook de xlsx
    const workbook = XLSX.utils.table_to_book(table);

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Crear un Blob a partir del buffer de Excel
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Guardar el archivo utilizando FileSaver.js
    let fecha = this.datePipe.transform(Date.now(), 'dd-MM-yyyy');
    saveAs(blob, 'Normograma-CORHUILA-' + fecha + '.xlsx');
  }

  vistaExcel() {
    this.excel = !this.excel;
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

//// MODAL FORMULARIO

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
  editarFuncion: boolean = false;
  tipo: boolean = false;
  war: any;
  interna: boolean = false;
  externa: boolean = false;
  cuerpoColegiado: boolean = false;
  fechaActual = new Date();

  listadoNorma: Norma[] = [];
  listadoCuerposColegiados: CuerposColegiados[] = [];
  listadoEntidadExterna: EntidadExterna[] = [];
  listadoNormaTipo: NormaTipo[] = [];
  persona: Persona[] = [];

  formNorma!: FormGroup;

  fechaLimiteMinima!: any;
  fechaLimiteMinimaVigencia!: any;

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
      this.obtenerListadoNormas();
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

  obtenerListadoNormas() {
    this.normaService.obtenerListadoNormas().subscribe((data) => {
      this.listadoNorma = data;
    });
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
    this.formNorma.get('normaTipoCodigo')!.setValue(element.normaTipoCodigo);
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
