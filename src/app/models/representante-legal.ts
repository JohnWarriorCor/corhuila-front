import { Persona } from './persona';

export class RepresentanteLegal {
  codigo!: number;
  persona!: Persona;
  norma!: number;
  fechaInicio!: Date;
  fechaFin!: Date;
  justificacion!: string;
  estado!: number;
}
