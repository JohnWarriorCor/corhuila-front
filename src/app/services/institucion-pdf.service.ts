import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Institucion } from '../models/institucion';
import { DatePipe } from '@angular/common';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class InstitucionPdfService {
  header: any;
  footer: any;

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

  public export(element: Institucion): void {
    const docDefinition: any = {
      background: [
        {
          image: this.footer,
          width: 600,
          height: 120,
          alignment: 'center',
          opacity: 0.5,
          margin: [0, 704, 30, 0],
        },
      ],
      pageMargins: [40, 110, 40, 17.8],
      header: {
        margin: [30, 0, 0, 0],
        image: this.header,
        width: 600,
        height: 90,
        opacity: 0.5,
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
                  fillColor: '#8996a4',
                  bold: true,
                  alignment: 'left',
                },
                {
                  border: [false, false, false, false],
                  text:
                    'Pagina: ' + currentPage.toString() + ' de ' + pageCount,
                  fillColor: '#8996a4',
                  bold: true,
                  alignment: 'right',
                },
              ],
            ],
          },
        };
      },
      content: [
        {
          text: '',
          style: 'subheader',
        },
        {
          style: 'tableInit',
          table: {
            widths: ['*'],
            heights: 20,
            body: [
              [
                {
                  text: 'INSTITUCIÓN',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [{ text: element.nombre, margin: 5 }],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*'],
            body: [
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
                { text: element.nit, margin: 5 },
                {
                  text: element.ies,
                  margin: 5,
                },
                {
                  text: element.iesPadre,
                  margin: 5,
                },
              ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
                { text: 'SECTOR', fillColor: '#edeff0', bold: true, margin: 5 },
                {
                  text: 'NATURALEZA JURÍDICA',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'CARACTER ACADÉMICO',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [
                { text: element.sector.nombre, margin: 5 },
                { text: element.naturaleza.nombre, margin: 5 },
                { text: element.caracter.nombre, margin: 5 },
              ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
                {
                  text: 'DIRECCIÓN',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'TELEFONO',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'PÁGINA WEB',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [
                { text: element.direccion, margin: 5 },
                { text: element.telefono, margin: 5 },
                { text: element.url, margin: 5 },
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
                { text: 'PAÍS', fillColor: '#edeff0', bold: true, margin: 5 },
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
                  text: 'CABECERA MUNICIPAL O CENTRO POBLADO',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                  fontSize: 8,
                },
              ],
              [
                { text: element.pais.nombre, margin: 5 },
                { text: element.departamento.nombre, margin: 5 },
                { text: element.municipio.nombre, margin: 5 },
                { text: element.ccp.nombre, margin: 5 },
              ],
            ],
          },
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*', '*'],
            body: [
              [
                {
                  text: 'NORMA DE CREACIÓN',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
                {
                  text: 'FECHA DE LA NORMA DE CREACIÓN',
                  fillColor: '#edeff0',
                  bold: true,
                  margin: 5,
                },
              ],
              [
                { text: element.norma, margin: 5 },
                { text: element.fechaNorma, margin: 5 },
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
        'Reporte Institución' +
          this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm a') +
          ' .pdf'
      );
  }
}
