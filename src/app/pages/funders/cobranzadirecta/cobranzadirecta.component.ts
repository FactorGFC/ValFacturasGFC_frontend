import { Component, OnInit } from '@angular/core';
import { FundersService } from '../../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as fs from 'file-saver';
import { poliza } from '../../../models/personas.model';
@Component({
  selector: 'app-options',
  templateUrl: './cobranzadirecta.component.html',
  styles: []
})
export class CobranzaDirectaComponent implements OnInit {

  constructor(
               public _funders: FundersService,
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
    this._funders.getcobranzadirecta().subscribe( resp => { this.cc = resp; swal2.close();}
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

      { field: 'emisor', header: 'Emisor' },
      { field: 'receptor', header: 'Receptor' },
      { field: 'fecha_operacion', header: 'Fecha operacion' },
      { field: 'fecha_vencimiento', header: 'Fecha vencimiento' },
      { field: 'folio_factura', header: 'Folio factura' },
      { field: 'estatus', header: 'Estatus' },
      { field: 'folio_solicitud', header: 'Folio solicitud' },
      { field: 'folio_solicitud_fondeo', header: 'Folio solicitud fondeo' },
      { field: 'pagar_a', header: 'Pagar a' },
      { field: 'monto_operado', header: 'Monto operado' },
      { field: 'total_factura', header: 'Total factura' },
      { field: 'moneda', header: 'Moneda' },
      { field: 'uuid_factura_descontada', header: 'UUID factura descontada' },
      { field: 'reporte_de_cobranza', header: 'Reporte cobranza' },
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

  exportexcel() {
    const readOpts = {
      cellText:false, 
      cellDates:true,
    };
     /* table id is passed over here */
     const element = document.getElementById('tablaFacturas');
     const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, readOpts);
     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
     /* save to file */
    
     XLSX.writeFile(wb, 'Reporte_facturas.xlsx', readOpts);
  }

  registrapago() {
    if (this.seleccionpoliza === undefined) {
      swal2.fire({
        title: 'Debe seleccionar al menos una factura',
        text: '',
        icon: 'warning',
        showConfirmButton: true,
        allowOutsideClick: false
      })
    } else {
      const params = {
        secret_key: '',
        token: '',
        status: 'LIQUIDADO CADENA'
      }
      swal2.showLoading();
      swal2.fire({
        title: 'Desea registrar el pago las facturas seleccionadas',
        text: '',
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        allowOutsideClick: false
      }). then ( resp => {
        if ( resp.value) {
          for (const prop in this.seleccionpoliza) {
          this._funders.actualizaInvoice(this.seleccionpoliza[prop].id_factura, params).subscribe()
          }
          swal2.fire({
            title: 'La operacion se registo correctamente',
            text: '',
            icon: 'warning',
            showConfirmButton: true,
            allowOutsideClick: false
          }). then ( resp => {
            if ( resp.value) {
              window.location.reload();
            }
          });
        }
        
      });
    }
    }
}
