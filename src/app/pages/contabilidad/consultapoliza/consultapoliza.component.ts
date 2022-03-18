import { Component, OnInit } from '@angular/core';
import { ContabilidadService } from '../../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
import { poliza } from '../../../models/personas.model';
@Component({
  selector: 'app-options',
  templateUrl: './consultapoliza.component.html',
  styles: []
})
export class ConsultaPolizaComponent implements OnInit {

  constructor(
               public _contabilidad: ContabilidadService,
               public router: Router,
               public http: HttpClient ) { }

  token = localStorage.getItem('token');
  cc: any[] = [];
  ccd: any[] = [];
  ccdsin: any[] = [];
  cols: any[];
  colsdetalle: any[];
  selectedFac: any[];
  tieneacceso = false;
  seleccionpoliza: poliza;
  muestradetalles: boolean;
  ngOnInit() {
    this.muestradetalles = false;
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
    this._contabilidad.getAccountingRegistries().subscribe( resp => { this.cc = resp; swal2.close(); }
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

      { field: 'id', header: 'Id' },
      { field: 'ar_date', header: 'Fecha' },
      { field: 'folio', header: 'Folio' },
      { field: 'total_credit', header: 'Cargos' },
      { field: 'total_debit', header: 'Abonos' },
      { field: 'balance', header: 'Balance' },
      { field: 'status', header: 'Estatus' },
      //{ field: 'attached', header: 'Anexo' },

  ];

  this.colsdetalle = [

      { field: 'posicion', header: 'Posicion' },
      { field: 'asignacion', header: 'Asignacion' },
      { field: 'clave_contabilizacion', header: 'Clave contable' },
      { field: 'cuenta_contable', header: 'Cuenta' },
      { field: 'denominacion', header: 'Denominacion' },
      { field: 'importe', header: 'Importe' },
      { field: 'importe_ml', header: 'Importe ML' },
      { field: 'moneda', header: 'Moneda' },
      { field: 'indicador_impuestos', header: 'Indicador impuestos' },
      { field: 'texto', header: 'Texto' },
      { field: 'centro_coste', header: 'Centro de coste' },
      { field: 'elemento_pep', header: 'Elemento pep' },
      { field: 'centro_beneficio', header: 'Centro de beneficio' },
      { field: 'centro', header: 'Centro' },
      { field: 'uuid', header: 'UUID' }

];
swal2.close();
  }

  borraCuentaContable( id: string ) {
    swal2.showLoading();
    swal2.fire({
      title: 'Desea Eliminar la cuenta contable',
      text: 'Seleccionada',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {

        this._contabilidad.borraCuentaContable( id ).subscribe( () => {
          swal2.close();
          swal2.fire({
            title: 'La cuenta contable',
            text: 'fue eliminada con exito',
            icon: 'success',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {

            if ( res.value ) {
              this.ngOnInit();
            }

          } );

        }, (err) => {
          swal2.close();
          console.log(err);
          swal2.fire({
            title: 'Ocurrio un error',
            text: '',
            icon: 'error',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {
            if ( res.value ) {
              this.ngOnInit();
            }
          } );
         } );

      }
    });

  }

  exportexcel() {
    const fileName = 'Polizadetalles' + '.xlsx';
     const Excel = require('exceljs');
     let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('base');
    let header=['Posicion', 'Asignacion','Clave contable', 'Cuenta', 'Denominacion','Importe', 'Importe ML', 'Moneda', 'Indicador impuestos', 'Texto', 'Centro de coste', 'Elemento pep', 'Centro de beneficio', 'Centro', 'UUID'];
    worksheet.addRow(header);
    for (const prop in this.ccd) {
      worksheet.addRow([
          this.ccd[prop].posicion,
          this.ccd[prop].asignacion,
          this.ccd[prop].clave_contabilizacion,
          this.ccd[prop].cuenta_contable,
          this.ccd[prop].denominacion,
          this.ccd[prop].importe,
          this.ccd[prop].importe_ml,
          this.ccd[prop].moneda,
          this.ccd[prop].indicador_impuestos,
          this.ccd[prop].texto,
          this.ccd[prop].centro_coste,
          this.ccd[prop].elemento_pep,
          this.ccd[prop].centro_beneficio,
          this.ccd[prop].centro,
          this.ccd[prop].uuid,
      ]);
    } 
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: '.xlsx' });
      const file = blob;
      fs.saveAs(blob, fileName);
    });
  }

  exportexcelsinconsulta() {
    this._contabilidad.getDetallesPoliza(this.seleccionpoliza.id).subscribe( resp => { this.ccdsin = resp; swal2.close(); 
      const fileName = 'Polizadetalles' + '.xlsx';
      const Excel = require('exceljs');
      let workbook = new Excel.Workbook();
     let worksheet = workbook.addWorksheet('base');
     let header=['Posicion', 'Asignacion','Clave contable', 'Cuenta', 'Denominacion','Importe', 'Importe ML', 'Moneda', 'Indicador impuestos', 'Texto', 'Centro de coste', 'Elemento pep', 'Centro de beneficio', 'Centro', 'UUID'];
     worksheet.addRow(header);
     for (const prop in this.ccdsin) {
       worksheet.addRow([
           this.ccdsin[prop].posicion,
           this.ccdsin[prop].asignacion,
           this.ccdsin[prop].clave_contabilizacion,
           this.ccdsin[prop].cuenta_contable,
           this.ccdsin[prop].denominacion,
           this.ccdsin[prop].importe,
           this.ccdsin[prop].importe_ml,
           this.ccdsin[prop].moneda,
           this.ccdsin[prop].indicador_impuestos,
           this.ccdsin[prop].texto,
           this.ccdsin[prop].centro_coste,
           this.ccdsin[prop].elemento_pep,
           this.ccdsin[prop].centro_beneficio,
           this.ccdsin[prop].centro,
           this.ccdsin[prop].uuid,
       ]);
     } 
     workbook.xlsx.writeBuffer().then((data) => {
       let blob = new Blob([data], { type: '.xlsx' });
       const file = blob;
       fs.saveAs(blob, fileName);
     });
    }
      , (err) => {console.log(err),swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );
    
  }

  cancelapoliza() {
  if (this.seleccionpoliza === undefined) {
    swal2.fire({
      title: 'Debe seleccionar al menos una poliza',
      text: '',
      icon: 'warning',
      showConfirmButton: true,
      allowOutsideClick: false
    })
  } else if (this.seleccionpoliza.status === 'CANCELADO') {
    swal2.showLoading();
    swal2.fire({
      title: 'La poliza ya se encuentra cancelada',
      text: '',
      icon: 'warning',
      showConfirmButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {
          this.ngOnInit();

        }
    });
  }else {
    const params = {
      secret_key: '',
      token: '',
      idp: this.seleccionpoliza
    }
    swal2.showLoading();
    swal2.fire({
      title: 'Desea cancelar la poliza seleccionada',
      text: 'Seleccionada',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {

        this._contabilidad.cancelaPoliza( params ).subscribe( () => {
          swal2.close();
          swal2.fire({
            title: 'La poliza',
            text: 'fue cancelada con exito',
            icon: 'success',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {

            if ( res.value ) {
              this.ngOnInit();
            }

          } );

        }, (err) => {
          swal2.close();
          console.log(err);
          swal2.fire({
            title: 'Ocurrio un error',
            text: '',
            icon: 'error',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {
            if ( res.value ) {
              this.ngOnInit();
            }
          } );
         } );

      }
    });
  }
  }

  consultaPolizaDetalle() {
    if (this.seleccionpoliza === undefined) {
      swal2.fire({
        title: 'Debe seleccionar al menos una poliza',
        text: '',
        icon: 'warning',
        showConfirmButton: true,
        allowOutsideClick: false
      })
    } else if (this.seleccionpoliza.status === 'CANCELADO'){
      swal2.showLoading();
      swal2.fire({
        title: 'La poliza se encuentra cancelada',
        text: '',
        icon: 'warning',
        showConfirmButton: true,
        allowOutsideClick: false
      }). then ( resp => {
        if ( resp.value) {
            this.ngOnInit();
  
          }
      });
    } else {
      this.muestradetalles = true;
      this._contabilidad.getDetallesPoliza(this.seleccionpoliza.id).subscribe( resp => { this.ccd = resp; swal2.close(); }
      , (err) => {console.log(err),swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );
    }
    
  }
}
