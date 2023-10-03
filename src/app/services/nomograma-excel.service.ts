import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class NormogramaExcelService {
  logo: any;

  constructor(private http: HttpClient) {
    this.loadImageAsBase64();
  }

  loadImageAsBase64() {
    // Ruta de la imagen en "assets"
    const imagePath = 'assets/logo-corhuila-completo.png';

    // Realiza una solicitud HTTP GET para cargar la imagen como un blob
    this.http.get(imagePath, { responseType: 'blob' }).subscribe((blob) => {
      // Lee el blob como un ArrayBuffer
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = () => {
        // La imagen se ha cargado y convertido a base64
        const base64data = reader.result as string;
        this.logo = base64data;

        // Puedes utilizar base64data como necesites
      };
    });
  }

  exportExcel(excelData: { title: any; headers: any; data: any }) {
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Normograma');
    worksheet.columns = [
      { width: 20 },
      { width: 20 },
      { width: 30 },
      { width: 20 },
      { width: 30 },
      { width: 40 },
      { width: 50 },
      { width: 40 },
      { width: 60 },
      { width: 20 },
      { width: 50 },
    ];
    worksheet.columns.forEach((column) => {
      column.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
    //Add Row and formatting
    worksheet.mergeCells('B1', 'I2');
    let titleRow1 = worksheet.getCell('B1');
    titleRow1.value = 'SISTEMAS INTEGRADOS DE GESTIÓN';
    titleRow1.font = {
      name: 'Calibri',
      size: 16,
      //underline: 'single',
      bold: true,
      //color: { argb: '0085A3' },
    };
    titleRow1.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('B3', 'I4');
    let titleRow2 = worksheet.getCell('B3');
    titleRow2.value = 'NORMOGRAMA';
    titleRow2.font = {
      name: 'Calibri',
      size: 16,
      //underline: 'single',
      bold: true,
      //color: { argb: '0085A3' },
    };
    titleRow2.alignment = { vertical: 'middle', horizontal: 'center' };

    // Date
    worksheet.mergeCells('J1:K1');
    let d = new Date();
    let date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    let dateCell1 = worksheet.getCell('J1');
    dateCell1.value = 'CÓDIGO: FO-SI-25';
    dateCell1.font = {
      name: 'Calibri',
      size: 10,
      bold: true,
    };
    dateCell1.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('J2:K2');
    let dateCell2 = worksheet.getCell('J2');
    dateCell2.value = 'VERSIÓN: 04';
    dateCell2.font = {
      name: 'Calibri',
      size: 10,
      bold: true,
    };
    dateCell2.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('J3:K3');
    let dateCell3 = worksheet.getCell('J3');
    dateCell3.value = 'PAGINA: 1 de 1';
    dateCell3.font = {
      name: 'Calibri',
      size: 10,
      bold: true,
    };
    dateCell3.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('J4:K4');
    let dateCell4 = worksheet.getCell('J4');
    dateCell4.value = 'VIGENCIA: diciembre 04 de 2021';
    dateCell4.font = {
      name: 'Calibri',
      size: 10,
      bold: true,
    };
    dateCell4.alignment = { vertical: 'middle', horizontal: 'center' };
    //Fecha
    let dateCell5 = worksheet.getCell('A5');
    dateCell5.value = 'Fecha de actualización:';
    dateCell5.font = {
      name: 'Calibri',
      size: 10,
      bold: true,
    };
    dateCell5.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('B5:K5');
    let dateCell6 = worksheet.getCell('B5');
    dateCell6.value = '';
    dateCell6.font = {
      name: 'Calibri',
      size: 10,
      bold: true,
    };
    dateCell6.alignment = { vertical: 'middle', horizontal: 'center' };

    //Add Image
    let myLogoImage = workbook.addImage({
      base64: this.logo,
      extension: 'png',
    });
    worksheet.mergeCells('A1:A4');
    worksheet.addImage(myLogoImage, 'A1:A4');

    //Blank Row
    //worksheet.addRow([]);

    //Adding Header Row
    let headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '3e6c83' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
    });

    // Adding Data with Conditional Formatting
    data.forEach((d: any) => {
      let row = worksheet.addRow(d);

      let sales: any = row.getCell(6);
      let color = '';
      /* if (+sales.value < 200000) {
        color = '';
      }
 */
      sales.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color },
      };
    });

    worksheet.getColumn(3).width = 20;
    worksheet.addRow([]);

    //Footer Row
    /* let footerRow = worksheet.addRow([
      'Employee Sales Report Generated from example.com at ' + date,
    ]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB050' },
    }; */

    //Merge Cells
    //worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      saveAs(blob, title + '.xlsx');
    });
  }
}
