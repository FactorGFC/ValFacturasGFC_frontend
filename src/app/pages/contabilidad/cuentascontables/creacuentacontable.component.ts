import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ContabilidadService } from '../../../services/service.index';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

declare function init_plugins();

@Component({
  selector: 'app-creaoption',
  templateUrl: './creacuentacontable.component.html',
  styles: []
})
export class CreaCuentaContableComponent implements OnInit {

  forma: FormGroup;

  constructor(
    private route: ActivatedRoute,
    public _contabilidad: ContabilidadService,
    public router: Router
  ) { }


  ngOnInit() {


      this.forma = new FormGroup({
        account: new FormControl( null , Validators.required ),
        accounting_key: new FormControl( null , Validators.required ),
        accounting_name: new FormControl( null , Validators.required ),
        accounting_type: new FormControl( null),
        assigment: new FormControl( null),
        center: new FormControl( null ),
        cost_center: new FormControl( null ),
        definition: new FormControl( null),
        pep_element: new FormControl( null ),
        profit_center: new FormControl( null),
        tax_indicator: new FormControl( null),

      } );

  }


  registrarOpcion() {

    let params = {
        account: (document.getElementById('account') as HTMLInputElement).value,
        accounting_key: (document.getElementById('accounting_key') as HTMLInputElement).value,
        accounting_name: (document.getElementById('accounting_name') as HTMLInputElement).value,
        accounting_type: (document.getElementById('accounting_type') as HTMLInputElement).value,
        assigment: (document.getElementById('assigment') as HTMLInputElement).value,
        center: (document.getElementById('center') as HTMLInputElement).value,
        cost_center: (document.getElementById('cost_center') as HTMLInputElement).value,
        definition: (document.getElementById('definition') as HTMLInputElement).value,
        pep_element: (document.getElementById('pep_element') as HTMLInputElement).value,
        profit_center: (document.getElementById('profit_center') as HTMLInputElement).value,
        tax_indicator: (document.getElementById('tax_indicator') as HTMLInputElement).value,
        token: '',
        secret_key: ''
    }

    this._contabilidad.crearCuentaContable(params).subscribe( () => {
    Swal.fire({
      title: 'Creacion de cuenta exitosa',
      text: '',
      icon: 'success',
      showConfirmButton: true,
      showCancelButton: false,
      allowOutsideClick: false
    }). then ( res => {
      if ( res.value ) {
        this.router.navigate(['/contabilidad/cuentascontables']);
      }

    } );

  }, (err) => {             console.log(err);
                            Swal.fire(
                              'Error al crear Opcion',
                              'Error',
                              'error'
                           );
                        } ); 

  }


}
