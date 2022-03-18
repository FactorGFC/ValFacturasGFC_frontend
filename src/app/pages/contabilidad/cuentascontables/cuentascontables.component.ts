import { Component, OnInit } from '@angular/core';
import { ContabilidadService } from '../../../services/service.index';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import swal2 from 'sweetalert2';

@Component({
  selector: 'app-options',
  templateUrl: './cuentascontables.component.html',
  styles: []
})
export class CuentasContablesComponent implements OnInit {

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
   // this.getAcceso('/options');
    this._contabilidad.getCuentasContables().subscribe( resp => { this.cc = resp; swal2.close(); }
    , (err) => {swal2.fire({title: 'Ocurrio un error al cargar la informacion', allowOutsideClick: false })} );

    this.cols = [

      { field: 'account', header: 'Cuenta' },
      { field: 'accounting_key', header: 'Clave contable' },
      { field: 'accounting_name', header: 'Nombre cuenta' },
      { field: 'accounting_type', header: 'Tipo cuenta' },
      { field: 'assigment', header: 'Asignacion' },
      { field: 'center', header: 'Centro' },
      { field: 'cost_center', header: 'Centro de coste' },
      { field: 'definition', header: 'Definicion' },
      { field: 'pep_element', header: 'Elemento pep' },
      { field: 'profit_center', header: 'Centro de beneficio' },
      { field: 'tax_indicator', header: 'Tax' },
      { field: 'herramientas', header: 'Herramientas' },

  ];
  
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

}
