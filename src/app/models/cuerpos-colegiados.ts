import { Funciones } from './funciones';

export class CuerposColegiados {
  codigo!: number;
  nombre!: string;
  nombreCorto!: string;
  numeroNorma!: number;
  nombreNorma!: string;
  fechaNorma!: Date;
  funciones!: Funciones;
  fechaCreacion!: Date;
  cantidadMiembros!: number;
  estado!: number;
}
