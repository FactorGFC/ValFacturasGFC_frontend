import { Component, OnInit } from '@angular/core';
import { ContabilidadService } from '../../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
@Component({
  selector: 'app-options',
  templateUrl: './generapoliza.component.html',
  styles: []
})
export class GeneraPolizaComponent implements OnInit {

  constructor(
               public _contabilidad: ContabilidadService,
               public router: Router,
               public http: HttpClient ) { }

  token = localStorage.getItem('token');
  cc: any[] = [];
  cols: any[];
  selectedFac: any[];
  tieneacceso = false;
  ngOnInit() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
    

    this.cols = [

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
     const fileName = 'Contabilidad' + '.xlsx';
     const Excel = require('exceljs');
     let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('base');
    let header=['Posicion', 'Asignacion','Clave contable', 'Cuenta', 'Denominacion','Importe', 'Importe ML', 'Moneda', 'Indicador impuestos', 'Texto', 'Centro de coste', 'Elemento pep', 'Centro de beneficio', 'Centro', 'UUID'];
    worksheet.addRow(header);
    for (const prop in this.cc) {
      worksheet.addRow([
          this.cc[prop].posicion,
          this.cc[prop].asignacion,
          this.cc[prop].clave_contabilizacion,
          this.cc[prop].cuenta_contable,
          this.cc[prop].denominacion,
          this.cc[prop].importe,
          this.cc[prop].importe_ml,
          this.cc[prop].moneda,
          this.cc[prop].indicador_impuestos,
          this.cc[prop].texto,
          this.cc[prop].centro_coste,
          this.cc[prop].elemento_pep,
          this.cc[prop].centro_beneficio,
          this.cc[prop].centro,
          this.cc[prop].uuid,
      ]);
    } 
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: '.xlsx' });
      const file = blob;
      fs.saveAs(blob, fileName);
    });
  }
  getrepor() {
    swal2.fire({
      title: 'Cargando',
      allowOutsideClick: false
 });
    swal2.showLoading();
    const fechaconsulta = (document.getElementById('fechaconsulta') as HTMLInputElement).value;
  
    if (fechaconsulta.length == 0) {
      swal2.close();
      swal2.fire({
        title: 'Debe seleccionar una fecha para la consulta',
        allowOutsideClick: false
   });
    } else {
      this._contabilidad.getAccountingEntries(fechaconsulta).subscribe( resp => { this.cc = resp; swal2.close();
      if (resp.length == 0) {
        swal2.fire({
          title: `No se encontro informacion con la fecha: ${fechaconsulta}` ,
          allowOutsideClick: false
     });
      }
      }
      , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );
    }
    
  }

  confirmapoliza() {
    swal2.showLoading();
    const fechaconsulta = (document.getElementById('fechaconsulta') as HTMLInputElement).value;

    if (fechaconsulta.length == 0) {
      swal2.close();
      swal2.fire({
        title: 'Debe seleccionar una fecha para la confirmacion de la poliza',
        allowOutsideClick: false
   });
    } else {
      this._contabilidad.getAccountingEntries(fechaconsulta).subscribe( resp => { this.cc = resp; swal2.close();
      if (resp.length == 0) {
        swal2.fire({
          title: `No se encontro informacion con la fecha: ${fechaconsulta}` ,
          allowOutsideClick: false
     });
      } else {
        swal2.showLoading();
        swal2.fire({
      title: 'Desea confirmar la poliza',
      text: '',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      allowOutsideClick: false
    }). then ( resp => {
      if ( resp.value) {
        
        const params = { 
          token: '', 
          secret_key: '',
          accounting_entries: [],
          accounting_registry: { 
                     ar_date: fechaconsulta, 
                     //folio: "PO002", 
                     status: "ACTIVO", 
                    // attached: "http://attached.pdf"
                     
                   }
      }
      for (const prop in this.cc) {
        params.accounting_entries[prop] = {id: (this.cc[prop].id).toString() };
        
      }
      
        this._contabilidad.confirmaPoliza( params ).subscribe( () => {
          this.exportexcel();
          swal2.close();
          swal2.fire({
            title: 'La poliza',
            text: 'fue confirmada con exito',
            icon: 'success',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false
          }). then ( res => {
            
            if ( res.value ) {
              
              window.location.reload();
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
      , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );
    }
  }
}
