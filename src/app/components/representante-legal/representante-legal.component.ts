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
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Pais } from 'src/app/models/pais';
import { UbicacionService } from 'src/app/services/ubicacion.service';
import { AuthService } from 'src/app/services/auth.service';
import { Departamento } from 'src/app/models/departamento';
import { Municipio } from '../../models/municipio';
import { InstitucionService } from 'src/app/services/institucion.service';
import { Institucion } from 'src/app/models/institucion';
import { CabecerasCentrosPoblados } from 'src/app/models/cabeceras-centros-poblados';
import { SedeTipo } from 'src/app/models/sede-tipo';
import { SedeService } from 'src/app/services/sede.service';
import { Sede } from 'src/app/models/sede';

@Component({
  selector: 'app-representante-legal',
  templateUrl: './representante-legal.component.html',
  styleUrls: ['./representante-legal.component.css'],
})
export class RepresentanteLegalComponent {
  editar: boolean = false;
  nameFile: string = 'Archivo: pdf';
  paises: Pais[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  paisLocal: Pais[] = [];
  listadoCcp: CabecerasCentrosPoblados[] = [];
  listadoInstitucion: Institucion[] = [];
  institucion: Institucion[] = [];
  listadoTipoSede: SedeTipo[] = [];
  listadoSede: Sede[] = [];

  formSede!: FormGroup;

  dataSource = new MatTableDataSource<Sede>([]);
  displayedColumns: string[] = [
    'index',
    'nit',
    'institucion',
    'sede',
    'ubicacion',
    'dirección',
    'telefono',
    'tipo',
    'fecha',
    'opciones',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  // Referencia al elemento div oculto
  @ViewChild('hiddenDiv') hiddenDiv!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    public ubicacionService: UbicacionService,
    public institucionService: InstitucionService,
    public sedeService: SedeService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerPaises();
      this.obtenerPaisLocal();
      this.crearFormSede();
      this.obtenerListadoSedes();
      this.obtenerInstitucion();
      this.obtenerListadoTiposSedes();
    }
  }

  private crearFormSede(): void {
    this.formSede = this.formBuilder.group({
      codigo: new FormControl(''),
      nit: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      pais: new FormControl('', Validators.required),
      departamento: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      ccp: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      tipo: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  // Función para mostrar el div oculto y desplazarse hacia él
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

  obtenerListadoSedes() {
    this.sedeService.obtenerListadoSedes().subscribe((data) => {
      this.listadoSede = data;
      this.dataSource = new MatTableDataSource<Sede>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  generarSede(): void {
    let sede: Sede = new Sede();
    sede.codigo = this.formSede.get('codigo')!.value;
    sede.nit = this.formSede.get('nit')!.value;
    sede.nombre = this.formSede.get('nombre')!.value;
    let ccp: CabecerasCentrosPoblados = new CabecerasCentrosPoblados();
    ccp.divipola = this.formSede.get('ccp')!.value;
    sede.ccp = ccp;
    sede.direccion = this.formSede.get('direccion')!.value;
    sede.telefono = this.formSede.get('telefono')!.value;
    let tipo: SedeTipo = new SedeTipo();
    tipo.codigo = this.formSede.get('tipo')!.value;
    sede.sedeTipo = tipo;
    sede.estado = this.formSede.get('estado')!.value;
    if (this.editar) {
      this.actualizarSede(sede);
    } else {
      this.registrarSede(sede);
    }
  }

  registrarSede(sede: Sede) {
    this.sedeService.registrarSede(sede).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.obtenerListadoSedes();
          this.cancelar();
          this.crearFormSede();
          this.obtenerListadoSedes();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarSede(sede: Sede) {
    this.sedeService.actualizarSede(sede).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
          });
          this.cancelar();
          this.obtenerListadoSedes();
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  editarSede(element: Sede) {
    this.showAndScrollToHiddenDiv();
    this.editar = true;
    this.formSede.get('codigo')!.setValue(element.codigo);
    this.formSede.get('nit')!.setValue(element.nit);
    this.formSede.get('nombre')!.setValue(element.nombre);
    this.formSede.get('pais')!.setValue(element.pais.codigo);
    this.obtenerDepartamentosPorPais(element.pais.codigo);
    this.formSede.get('departamento')!.setValue(element.departamento.divipola);
    this.obtenerMunicipiosPorDepartamento(element.departamento.divipola);
    this.formSede.get('municipio')!.setValue(element.municipio.divipola);
    this.obtenerCcpPorMunicipio(element.municipio.divipola);
    this.formSede.get('ccp')!.setValue(element.ccp.divipola);
    this.formSede.get('direccion')!.setValue(element.direccion);
    this.formSede.get('telefono')!.setValue(element.telefono);
    this.formSede.get('tipo')!.setValue(element.sedeTipo.codigo);
    this.formSede.get('estado')!.setValue(element.estado);
  }

  eliminarSede() {
    let sede: Sede = new Sede();
    sede.codigo = this.formSede.get('codigo')!.value;
    sede.nit = this.formSede.get('nit')!.value;
    sede.nombre = this.formSede.get('nombre')!.value;
    let ccp: CabecerasCentrosPoblados = new CabecerasCentrosPoblados();
    ccp.divipola = this.formSede.get('ccp')!.value;
    sede.ccp = ccp;
    sede.direccion = this.formSede.get('direccion')!.value;
    sede.telefono = this.formSede.get('telefono')!.value;
    let tipo: SedeTipo = new SedeTipo();
    tipo.codigo = this.formSede.get('tipo')!.value;
    sede.sedeTipo = tipo;
    sede.estado = 0;
    this.actualizarSede(sede);
  }

  cancelar() {
    this.formSede.reset();
    this.obtenerPaises();
    this.obtenerPaisLocal();
    this.crearFormSede();
    this.obtenerListadoSedes();
    this.editar = false;
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

  obtenerInstitucion() {
    this.institucionService.obtenerInstitucion().subscribe((data) => {
      this.institucion = data;
    });
  }

  obtenerListadoTiposSedes() {
    this.sedeService.obtenerListadoTiposSedes().subscribe((data) => {
      this.listadoTipoSede = data;
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
