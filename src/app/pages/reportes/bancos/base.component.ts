import { Component, OnInit, Input } from '@angular/core';
import { ReportesService } from '../../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import * as XLSX from 'xlsx';
//import jsPDF from 'jspdf';
//import 'jspdf-autotable';
//declare var $;
import * as fs from 'file-saver';
import { Angular2Txt } from 'angular2-txt/Angular2-txt';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styles: []
})
export class BaseComponent implements OnInit {

  constructor( public _reportesservice: ReportesService,
               public http: HttpClient) { }

  token = localStorage.getItem('token');
  //doc = new jsPDF();
  facturas: any[] = [];
  usuario: string;
  cols: any[];
  colspdf: any[];
  selectedFac: any[];
  router: Router;
  fileName = 'ListaDeFacturas.xlsx';
  selectedColumnsp: any[];
  selectedColumnspdf: any[];
  exportColumns: any[];

  _selectedColumns: any[];

  ngOnInit() {

    this.cols = [

    //  { field:  'id_factura', header: 'ID'},
    //  { field:  'payment_report_folio', header: 'Folio'},
      { field:  'tipo_operacion', header: 'Operacion'},
      { field:  'destinatario', header: 'Destinatario'},
      { field:  'cuenta_destino', header: 'Cuenta destino'},
      { field:  'importe', header: 'Importe'},
      { field:  'referencia_numerica', header: 'Referencia numerica' },
      { field:  'referencia_concepto', header: 'Referencia concepto'},
      { field:  'referencia', header: 'Referencia'},
      { field:  'divisa', header: 'Divisa'},
      { field:  'iva', header: 'IVA'},
      { field:  'rfc_destinatario', header: 'RFC destinatario'},
      { field:  'cuenta_cargo', header: 'Cuenta cargo'}
  ];

    this._selectedColumns = this.cols;
    this.colspdf = [

    //  { field:  'id_factura', header: 'ID'},
      { field:  'payment_report_folio', header: 'Folio'},
      { field:  'tipo_operacion', header: 'Operacion'},
      { field:  'destinatario', header: 'Destinatario'},
      { field:  'cuenta_destino', header: 'Cuenta Destino'},
      { field:  'importe', header: 'Importe'},
      { field:  'referencia_concepto', header: 'Referencia Concepto'},
      { field:  'referencia', header: 'Referencia'},
      { field:  'divisa', header: 'Divisa'}
];
    this.selectedColumnsp = this.cols;
    this.exportColumns = this.colspdf.map(col => ({title: col.header, dataKey: col.field}));

  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
}

set selectedColumns(val: any[]) {
  // restore original order
  this._selectedColumns = this.cols.filter(col => val.includes(col));
}

generarReporte() {

  swal2.fire({
    title: 'Cargando',
    allowOutsideClick: false
});
  swal2.showLoading();
  const curr: any = document.getElementById('curr');
  const valorCurr = curr.options[curr.selectedIndex].value;
  //console.log(valorCurr);
  const d = new Date((document.getElementById('fechaconsulta')as HTMLInputElement).value);
  d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) {
        month = '0' + month;
    }
  if (day.length < 2) {
        day = '0' + day;
    }

  const fecharepor = [year, month, day].join('-');
  const type = ((document.getElementById('type')as HTMLInputElement).value);
  this._reportesservice.getBase(fecharepor, valorCurr, type).subscribe(resp => {this.facturas = resp; //console.log(resp)
                                                                          swal2.close();
                                                                          if ( this.facturas.length === 0 ) {

                                                                        swal2.fire(
                                                                          'No se encontraron datos con la fecha:',
                                                                          fecharepor,
                                                                          'error'
                                                                          );
                                                                      } else {
                                                                        // tslint:disable-next-line: forin
                                                                        for (const prop in this.facturas) {
                                                                          this.facturas[prop].importe = this.facturas[prop].importe.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                                                        }
                                                                      }
  }, (err) => {
    swal2.close();
    console.log(err);
    swal2.fire(
         'Error al Consultar los Datos',
         '',
         'error'
      );
    this.ngOnInit();
   } );


}


  exportexcel() {
     this.fileName = this.facturas[0].payment_report_folio + '.xlsx';
     const Excel = require('exceljs');
     let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('base');
    let header=['Operacion', 'Destinatario','Cuenta destino', 'Importe', 'Referencia numerica','Referencia concepto', 'Referencia', 'Divisa', 'IVA', 'RFC destinatario', 'Cuenta cargo'];
    worksheet.addRow(header);
    for (const prop in this.facturas) {
      worksheet.addRow([
          this.facturas[prop].tipo_operacion,
          this.facturas[prop].destinatario,
          this.facturas[prop].cuenta_destino,
          this.facturas[prop].importe,
          this.facturas[prop].referencia_numerica,
          this.facturas[prop].referencia_concepto,
          this.facturas[prop].referencia,
          this.facturas[prop].divisa,
          this.facturas[prop].iva,
          this.facturas[prop].rfc_destinatario,
          this.facturas[prop].cuenta_cargo
      ]);
    } 
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: '.xlsx' });
      const file = blob;
      fs.saveAs(blob, this.fileName);
    });
  }


  exporttxt() {
    var options = { 
      fieldSeparator: '',
      quoteStrings: ''
    };
    let datos = [];
    this.fileName = this.facturas[0].payment_report_folio;
    for (const prop in this.facturas) {
      this.facturas[prop].importe = this.facturas[prop].importe.replaceAll(',','')
        datos.push({
          to: this.facturas[prop].tipo_operacion,
          tq: this.facturas[prop].destinatario,
          tw: this.facturas[prop].cuenta_destino,
          te: this.facturas[prop].importe,
          tr: this.facturas[prop].referencia_numerica,
          tt: this.facturas[prop].referencia_concepto,
          ty: this.facturas[prop].referencia,
          tu: this.facturas[prop].divisa,
          ti: this.facturas[prop].iva,
          ta: this.facturas[prop].rfc_destinatario,
          ts: this.facturas[prop].cuenta_cargo,
          tm: ' '
        })
    }
    new Angular2Txt(datos, this.fileName, options);

  }

}
