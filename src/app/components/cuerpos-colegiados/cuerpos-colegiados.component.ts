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

@Component({
  selector: 'app-cuerpos-colegiados',
  templateUrl: './cuerpos-colegiados.component.html',
  styleUrls: ['./cuerpos-colegiados.component.css'],
})
export class CuerposColegiadosComponent {
  editar: boolean = false;

  listadoCuerposColegiados: CuerposColegiados[] = [];

  formCuerposColegiados!: FormGroup;

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

  // Función para desplazarse a una seccion
  showAndScrollToHiddenDiv() {
    this.hiddenDiv.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  /*  openDialog(element: any): void {
    const dialogRef = this.dialog.open(ModalInstitucion, {
      width: '60%',
      data: { institucion: element },
    });
  }
 */

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
            this.crearCuerposColegiados();
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
    cuerposColegiados.nombre = this.formCuerposColegiados.get('codigo')!.value;
    cuerposColegiados.nombreCorto =
      this.formCuerposColegiados.get('codigo')!.value;
    cuerposColegiados.numeroNorma =
      this.formCuerposColegiados.get('codigo')!.value;
    cuerposColegiados.nombreNorma =
      this.formCuerposColegiados.get('codigo')!.value;
    cuerposColegiados.fechaNorma =
      this.formCuerposColegiados.get('codigo')!.value;
    cuerposColegiados.fechaCreacion =
      this.formCuerposColegiados.get('codigo')!.value;
    cuerposColegiados.cantidadMiembros =
      this.formCuerposColegiados.get('codigo')!.value;
    cuerposColegiados.estado = 0;
    this.actualizarCuerpoColegiado(cuerposColegiados);
  }

  cancelar() {
    this.formCuerposColegiados.reset();
    this.crearCuerposColegiados();
    this.obtenerCuerposColegiados();
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

//// MODAL

/* @Component({
  selector: 'modal-institucion',
  templateUrl: '../institucion/modal-institucion.html',
  styleUrls: ['./sede.component.css'],
})
export class ModalInstitucion implements OnInit {
  paises: Pais[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  paisLocal: Pais[] = [];
  listadoCaracterAcademico: CaracterAcademico[] = [];
  listadoNaturalezaJuridica: NaturalezaJuridica[] = [];
  listadoSector: Sector[] = [];
  listadoCcp: CabecerasCentrosPoblados[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalInstitucion>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public ubicacionService: UbicacionService,
    public institucionService: InstitucionService
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  obtenerListadoCaracterAcademico() {
    this.institucionService
      .obtenerListadoCaracterAcademico()
      .subscribe((data) => {
        this.listadoCaracterAcademico = data;
      });
  }

  obtenerListadoNaturalezaJuridica() {
    this.institucionService
      .obtenerListadoNaturalezaJuridica()
      .subscribe((data) => {
        this.listadoNaturalezaJuridica = data;
      });
  }

  obtenerListadoSector() {
    this.institucionService.obtenerListadoSector().subscribe((data) => {
      this.listadoSector = data;
    });
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

}
 */
