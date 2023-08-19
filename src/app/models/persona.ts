import { ComunidadNegra } from './comunidad-negra';
import { DiscapacidadTipo } from './discapacidad-tipo';
import { EstadoCivil } from './estado-civil';
import { Estrato } from './estrato';
import { GrupoEtnico } from './grupo-etnico';
import { GrupoSanguineo } from './grupo-sanguineo';
import { PersonaDiscapacidad } from './persona-discapacidad';
import { PuebloIndigena } from './pueblo-indigena';
import { SexoBilogico } from './sexo-bilogico';
import { TalentoExepcional } from './talento-exepcional';
import { TipoIdentificacion } from './tipo-identificacion';

export class Persona {
  codigo!: number;
  identificacion!: string;
  tipoId!: TipoIdentificacion;
  libretaMilitar!: string;
  nombre!: string;
  apellido!: string;
  sexoBiologico!: SexoBilogico;
  lugarExpedicion!: string;
  fechaExpedicion!: Date;
  fechaNacimiento!: Date;
  direccion!: string;
  movil!: string;
  fijo!: string;
  estadoCivil!: EstadoCivil;
  lugarNacimiento!: string;
  estrato!: Estrato;
  paisResidencia!: number;
  departamentoResidencia!: string;
  municipioResidencia!: string;
  lugarResidencia!: string;
  barrio!: string;
  epsAfiliacion!: number;
  sisben!: string;
  grupoEtnico!: GrupoEtnico;
  puebloIndigena!: PuebloIndigena;
  comunidadNegra!: ComunidadNegra;
  personaDiscapacidad!: PersonaDiscapacidad;
  discapacidadTipo!: DiscapacidadTipo;
  talentoExepcional!: TalentoExepcional;
  familiarDireccion!: string;
  familiarNombre!: string;
  familiarTelefono!: string;
  familiarLugarResidencia!: string;
  correo!: string;
  correoInterno!: string;
  grupoSanguineo!: GrupoSanguineo;
  estado!: number;
  fechaRegistro!: Date;
}
