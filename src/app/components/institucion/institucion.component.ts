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
import { CaracterAcademico } from 'src/app/models/caracter-academico';
import { NaturalezaJuridica } from 'src/app/models/naturaleza-juridica';
import { Sector } from 'src/app/models/sector';
import { Institucion } from 'src/app/models/institucion';

@Component({
  selector: 'app-institucion',
  templateUrl: './institucion.component.html',
  styleUrls: ['./institucion.component.css'],
})
export class InstitucionComponent {
  editar: boolean = false;
  nameFile: string = 'Archivo: pdf';
  paises: Pais[] = [];
  departamentos: Departamento[] = [];
  municipios: Municipio[] = [];
  paisLocal: Pais[] = [];
  listadoCaracterAcademico: CaracterAcademico[] = [];
  listadoNaturalezaJuridica: NaturalezaJuridica[] = [];
  listadoSector: Sector[] = [];
  listadoInstitucion: Institucion[] = [];

  formInstitucion!: FormGroup;

  dataSource = new MatTableDataSource<Institucion>([]);
  displayedColumns: string[] = [
    'index',
    'nit',
    'ies',
    'iespadre',
    'nombre',
    'municipio',
    'naturaleza',
    'sector',
    'caracter',
    'norma',
    'fechanorma',
    'estado',
  ];
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private formBuilder: FormBuilder,
    public ubicacionService: UbicacionService,
    public institucionService: InstitucionService,
    public dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {
    if (this.authService.validacionToken()) {
      this.obtenerPaises();
      this.obtenerPaisLocal();
      this.obtenerListadoCaracterAcademico();
      this.obtenerListadoNaturalezaJuridica();
      this.obtenerListadoSector();
      this.crearFormInstitucion();
      this.obtenerListadoInstitucion();
    }
  }

  private crearFormInstitucion(): void {
    this.formInstitucion = this.formBuilder.group({
      codigo: new FormControl(''),
      nit: new FormControl('', Validators.required),
      ies: new FormControl('', Validators.required),
      iesPadre: new FormControl('', Validators.required),
      naturaleza: new FormControl('', Validators.required),
      sector: new FormControl('', Validators.required),
      caracter: new FormControl('', Validators.required),
      nombre: new FormControl('', Validators.required),
      pais: new FormControl('', Validators.required),
      departamento: new FormControl('', Validators.required),
      municipio: new FormControl('', Validators.required),
      direccion: new FormControl('', Validators.required),
      telefono: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      norma: new FormControl('', Validators.required),
      fechaNorma: new FormControl('', Validators.required),
      estado: new FormControl(''),
    });
  }

  obtenerListadoInstitucion() {
    this.institucionService.obtenerListadoInstitucion().subscribe((data) => {
      this.listadoInstitucion = data;
      console.log(this.listadoInstitucion);
      this.dataSource = new MatTableDataSource<Institucion>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }

  generarInstitucion(): void {
    let institucion: Institucion = new Institucion();
    institucion.nit = this.formInstitucion.get('nit')!.value;
    institucion.ies = this.formInstitucion.get('ies')!.value;
    institucion.iesPadre = this.formInstitucion.get('iesPadre')!.value;
    let naturalezaJuridica: NaturalezaJuridica = new NaturalezaJuridica();
    naturalezaJuridica.codigo = this.formInstitucion.get('naturaleza')!.value;
    institucion.naturaleza = naturalezaJuridica;
    let sector: Sector = new Sector();
    sector.codigo = this.formInstitucion.get('sector')!.value;
    institucion.sector = sector;
    let caracterAcademico: CaracterAcademico = new CaracterAcademico();
    caracterAcademico.codigo = this.formInstitucion.get('caracter')!.value;
    institucion.caracter = caracterAcademico;
    institucion.nombre = this.formInstitucion.get('nombre')!.value;
    let pais: Pais = new Pais();
    pais.codigo = this.formInstitucion.get('pais')!.value;
    institucion.pais = pais;
    let departamento: Departamento = new Departamento();
    departamento.divipola = this.formInstitucion.get('departamento')!.value;
    institucion.departamento = departamento;
    let municipio: Municipio = new Municipio();
    municipio.divipola = this.formInstitucion.get('municipio')!.value;
    institucion.municipio = municipio;
    institucion.direccion = this.formInstitucion.get('direccion')!.value;
    institucion.telefono = this.formInstitucion.get('telefono')!.value;
    institucion.url = this.formInstitucion.get('url')!.value;
    institucion.norma = this.formInstitucion.get('norma')!.value;
    institucion.fechaNorma = this.formInstitucion.get('fechaNorma')!.value;

    if (this.editar) {
      this.actualizarInstitucion(institucion);
    } else {
      this.registrarInstitucio(institucion);
    }
  }

  registrarInstitucio(institucion: Institucion) {
    this.institucionService.registrarInstitucion(institucion).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Registrado',
            text: '¡Operación exitosa!',
            showConfirmButton: false,
            timer: 2500,
          });
          this.obtenerListadoInstitucion();
          /* this.cancelar();
          this.crearFormularioVigilante();
          this.obtenerVigilanstes(); */
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
  }

  actualizarInstitucion(institucion: Institucion) {
    this.institucionService.actualizarInstitucion(institucion).subscribe(
      (data) => {
        if (data > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Actualizado',
            text: '¡Operación exitosa!',
            showConfirmButton: true,
            confirmButtonColor: '#8f141b',
            timer: 2500,
          });
          /* this.cancelar();
          this.obtenerVigilanstes(); */
        } else {
          this.mensajeError();
        }
      },
      (err) => this.fError(err)
    );
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
    this.ubicacionService
      .obtenerMunicipiosPorDepartamento(codigo)
      .subscribe((data) => {
        this.municipios = data;
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
