import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Institucion } from '../models/institucion';
import { Programa } from '../models/programa';
import { DatePipe } from '@angular/common';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class ProgramaPdfService {
  header: any;
  footer: any;
  aniosPasados: any;

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.hedaerBase64();
    this.footerBase64();
  }

  hedaerBase64() {
    // Ruta de la imagen en "assets"
    const imagePath = 'assets/header.jpg';

    // Realiza una solicitud HTTP GET para cargar la imagen como un blob
    this.http.get(imagePath, { responseType: 'blob' }).subscribe((blob) => {
      // Lee el blob como un ArrayBuffer
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        // La imagen se ha cargado y convertido a base64
        const base64data = reader.result as string;
        this.header = base64data;

        // Puedes utilizar base64data como necesites
      };
    });
  }

  footerBase64() {
    // Ruta de la imagen en "assets"
    const imagePath = 'assets/footer.jpg';

    // Realiza una solicitud HTTP GET para cargar la imagen como un blob
    this.http.get(imagePath, { responseType: 'blob' }).subscribe((blob) => {
      // Lee el blob como un ArrayBuffer
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        // La imagen se ha cargado y convertido a base64
        const base64data = reader.result as string;
        this.footer = base64data;

        // Puedes utilizar base64data como necesites
      };
    });
  }

  calcularAniosPasados(element: any) {
    console.log(element.fechaRegistroSnies);

    const fechaDada = new Date(element.fechaRegistroSnies);
    const fechaActual = new Date();

    const diferenciaEnMilisegundos =
      fechaActual.getTime() - fechaDada.getTime();
    this.aniosPasados = Math.floor(
      diferenciaEnMilisegundos / (1000 * 60 * 60 * 24 * 365.25)
    );
  }

  public export(element: Programa, institucion: Institucion[]): void {
    this.calcularAniosPasados(element);
    var convenio: string;
    //var fechaCreacion = this.datePipe.transform(element.fechaCreacion, 'dd-MM-yyyy h:mm a');
    var fechaCreacion = this.datePipe.transform(
      element.fechaCreacion,
      'dd-MM-yyyy'
    );
    var fechaRegistroSnies = this.datePipe.transform(
      element.fechaCreacion,
      'dd-MM-yyyy'
    );
    if (element.convenio == 0) {
      convenio = 'NO';
    } else {
      convenio = 'SI';
    }
    const docDefinition: any = {
      background: [
        {
          image: this.footer,
          width: 600,
          height: 120,
          alignment: 'center',
          opacity: 1,
          margin: [0, 704, 0, 0],
        },
      ],
      pageMargins: [30, 110, 30, 17.8],
      header: {
        image: this.header,
        width: 600,
        height: 90,
      },
      footer: function (
        currentPage: { toString: () => string },
        pageCount: string
      ) {
        let dia = [
          'lunes',
          'martes',
          'miércoles',
          'jueves',
          'viernes',
          'sábado',
          'domingo',
        ];
        let mes = [
          'enero',
          'febrero',
          'marzo',
          'abril',
          'mayo',
          'junio',
          'julio',
          'agosto',
          'septiembre',
          'octubre',
          'noviembre',
          'diciembre',
        ];
        let d = new Date();
        let date =
          ' ' +
          dia[d.getDay() - 1] +
          ' ' +
          d.getDate() +
          ' ' +
          mes[d.getMonth()] +
          ' ' +
          d.getFullYear();
        return {
          margin: [0, 0, 0, 0],
          style: 'footer',
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  border: [false, false, false, false],
                  text: 'Fecha de impresión:  ' + date,
                  fillColor: '#152e49',
                  bold: true,
                  alignment: 'left',
                },
                {
                  border: [false, false, false, false],
                  text:
                    'Pagina: ' + currentPage.toString() + ' de ' + pageCount,
                  fillColor: '#152e49',
                  bold: true,
                  alignment: 'right',
                },
              ],
            ],
          },
        };
      },
      /*  footer: {
        image: this.footer,
        width: 590,
        height: 120,
      }, */
      content: [
        {
          columns: [
            {
              width: '*',
              text: 'Hoja de vida - Programa académico',
              bold: true,
              margin: [10, 0, 10, 0],
              fontSize: 16,
              alignment: 'center',
            },
          ],
        },

        {
          text: '',
          style: 'subheader',
        },
        {
          style: 'tableInit',
          table: {
            heights: 20,
            widths: ['*', '*', '*'],
            body: [
              [
                {
                  colSpan: '3',
                  text: 'INSTITUCIÓN',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {},
                {},
              ],
              [
                {
                  colSpan: '3',
                  text: institucion[0].nombre.toUpperCase(),
                  margin: 5,
                },
                {},
                {},
              ],
              [
                { text: 'NIT', fillColor: '#edeff0', bold: true, margin: 5 },
                {
                  text: 'CÓDIGO SNIES',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'CÓDIGO SNIES PADRE',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [
                { text: institucion[0].nit, margin: 5 },
                {
                  text: institucion[0].ies,
                  margin: 5,
                },
                {
                  text: institucion[0].iesPadre,
                  margin: 5,
                },
              ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*'],
            heights: 20,
            body: [
              [
                {
                  text: 'NOMBRE DEL PROGRAMA ACADÉMICO',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'TÍTULO OTORGADO',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [
                { text: element.nombre, margin: 5 },
                { text: element.titulo, margin: 5 },
              ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                { text: 'SNIES', fillColor: '#edeff0', bold: true, margin: 5 },
                {
                  text: 'ESTADO EN SNIES',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'CONVENIO',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: '¿SE OFERTA?',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [
                { text: element.snies, margin: 5 },
                { text: element.estadoSnies, margin: 5 },
                { text: convenio, margin: 5 },
                { text: '', margin: 5 },
              ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                {
                  text: 'MODALIDAD',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'NIVEL ACADÉMICO',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'NIVEL DE FORMACIÓN',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'OFRECE CICLOS PROPEDEÚTICOS',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [
                { text: element.modalidad, margin: 5 },
                { text: element.nivelAcademico, margin: 5 },
                { text: element.nivelFormacion, margin: 5 },
                { text: element.ciclos, margin: 5 },
              ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                {
                  colSpan: 4,
                  text: 'UBICACIÓN DEL PROGRAMA',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {},
                {},
                {},
              ],
              [
                {
                  text: 'DEPARTAMENTO',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'MUNICIPIO',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'SEDE',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'FACULTAD',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [
                { text: element.facultad.sede.departamento.nombre, margin: 5 },
                { text: element.facultad.sede.municipio.nombre, margin: 5 },
                { text: element.facultad.sede.nombre, margin: 5 },
                { text: element.facultad.nombre, margin: 5 },
              ],
            ],
          },
        },
        {
          style: 'tableExampleBreak',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                {
                  colSpan: 4,
                  text: 'INFORMACIÓN DE CREACIÓN',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {},
                {},
                {},
              ],
              [
                {
                  text: 'NORMA CREACIÓN',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'FECHA CREACIÓN',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'FECHA REGISTRO SNIES',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'ANTIGUEDAD (AÑOS)',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [
                { text: element.norma, margin: 5 },
                { text: fechaCreacion, margin: 5 },
                { text: fechaRegistroSnies, margin: 5 },
                { text: this.aniosPasados, margin: 5 },
              ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            dontBreakRows: true,
            unbreakable: false,
            widths: ['*', '*', '*'],
            body: [
              [
                {
                  colSpan: 2,
                  text: 'CLASIFICACIÓN CINE',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {},
                {
                  text: 'CÓDIGO CINE',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [
                {
                  text: 'CAMPO AMPLIO (CA)',
                  margin: 5,
                  fillColor: '#edeff0',
                  bold: true,
                },
                { text: element.campoDetallado.amplio, margin: 5 },
                { text: element.campoDetallado.amplioCine, margin: 5 },
              ],
              [
                {
                  text: 'CAMPO ESPECÍFICO (CE)',
                  margin: 5,
                  fillColor: '#edeff0',
                  bold: true,
                },
                { text: element.campoDetallado.especifico, margin: 5 },
                { text: element.campoDetallado.especificoCine, margin: 5 },
              ],
              [
                {
                  text: 'CAMPO DETALLADO (CD)',
                  margin: 5,
                  fillColor: '#edeff0',
                  bold: true,
                },
                { text: element.campoDetallado.nombre, margin: 5 },
                { text: element.campoDetallado.cine, margin: 5 },
              ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*'],
            heights: 20,
            body: [
              [
                {
                  text: 'AREA DE CONOCIMIENTO',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'NBC',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [
                { text: element.areaConocimiento, margin: 5 },
                { text: element.nbc, margin: 5 },
              ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                {
                  colSpan: 4,
                  text: 'INFORMACIÓN DEL PROGRAMA',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {},
                {},
                {},
              ],
              [
                {
                  text: 'TIPO DE ADMISION',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'DURACIÓN',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'CRÉDITOS',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'CUPOS',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [
                { text: element.tipoAdmision, margin: 5 },
                {
                  text: element.duracion + ' ' + element.tipoDuracion,
                  margin: 5,
                },
                { text: element.creditos, margin: 5 },
                { text: element.cupos, margin: 5 },
              ],
            ],
          },
        },
      ],
      styles: {
        footer: {
          color: '#FFFFFF',
          fontSize: 10,
          bold: true,
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 0],
          alignment: 'center',
        },
        tableExample: {
          margin: [0, 5, 0, 5],
          fontSize: 10,
          alignment: 'center',
        },
        tableExampleBreak: {
          margin: [0, 5, 0, 180],
          fontSize: 10,
          alignment: 'center',
        },
        tableInit: {
          margin: [0, 10, 0, 5],
          fontSize: 10,
          alignment: 'center',
        },
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(
        'Hoja de vida porgrama - ' +
          element.nombre +
          ' - ' +
          this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm a') +
          '.pdf'
      );
  }
}
