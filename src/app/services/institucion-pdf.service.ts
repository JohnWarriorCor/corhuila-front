import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Institucion } from '../models/institucion';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root',
})
export class InstitucionPdfService {
  header: any;
  footer: any;

  constructor(private http: HttpClient) {
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
      pageMargins: [60, 40, 60, 120],
      header: {
        image: this.header,
        width: 650,
        height: 120,
      },

      footer: {
        image: this.footer,
        width: 590,
        height: 120,
      },
      content: [
        { text: '', style: 'header' },
        'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
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
          margin: [0, 10, 0, 5],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 0],
          alignment: 'center',
        },
        tableExample: {
          margin: [0, 10, 0, 10],
          fontSize: 10,
          alignment: 'center',
        },
        tableInit: {
          margin: [0, 55, 0, 10],
          fontSize: 10,
          alignment: 'center',
        },
      },
    };

    pdfMake.createPdf(docDefinition).download('Institución CORHUILA.pdf');
  }
}
