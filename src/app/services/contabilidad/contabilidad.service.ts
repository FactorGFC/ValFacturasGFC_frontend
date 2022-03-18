import { Injectable } from '@angular/core';
import { Usuario, Usuario2, Usuario3, UserOptions } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { Perfisica, PerMoral, ContribuyenteFisica, ContribuyenteMoral, DocumentoPropiedad } from '../../models/personas.model';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';


@Injectable()
export class ContabilidadService {

  usuario: Usuario;
  token: string;
  usuario2: Usuario2;
  idUsuario: string;

  constructor(
    public http: HttpClient,
    public router: Router
  ) {
    this.cargarStorage();
  }

  cargarStorage() {

    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
    } else {
      this.token = '';
      this.usuario = null;
    }

  }


  crearArregloPersonaMoral( usuariosObj: any) {

    const usuarios: any[] = [];
    const resul: any[] = [];

    if ( usuariosObj === null ) { return []; }
    Object.keys ( usuariosObj ).forEach( key => {
      const usuario: any = usuariosObj[key];
      usuarios.push( usuario );
    });
    // tslint:disable-next-line: forin
  //  console.log( usuarios[0][prop].attributes );
    resul.push( usuarios[0].attributes );

    return resul;

}

getCuentasContables() {

  const url = `${environment.URL_SERVICIOS}/accounting_accounts?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloCuentasContables(resp);
    } )
  );

}

crearArregloCuentasContables( contribuObj: any) {

  const contribuyentes: any[] = [];
  const resul: any[] = [];
  if ( contribuObj === null ) { return []; }
  for (const prop in contribuObj.data) {
  resul.push( contribuObj.data[prop].attributes );
  }

  return resul;

}

crearCuentaContable( params ) {

  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;

  const url = `${environment.URL_SERVICIOS}/accounting_accounts/`;


  return this.http.post( url, params ).pipe(
            map( (resp: any) => {
              return (resp);
            }));
}

borraCuentaContable( idc ) {
  const url = `${environment.URL_SERVICIOS}/accounting_accounts/${idc}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.delete( url ).pipe(
    map( (resp: any) => {
      return resp;
    }));
}

actualizaCuentaContable(idc, params) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/accounting_accounts/${idc}`;
  
  return this.http.patch( url, params ).pipe(
    map( (resp: any) => { return resp;
    } ));
  }

getCuentaContable(idc) {
  const url = `${environment.URL_SERVICIOS}/accounting_accounts/${idc}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloCuentasContable(resp);
    } )
  );
}

crearArregloCuentasContable( optionObj: any) {

  const option: any[] = [];
  const resul: any[] = [];
 // console.log(usuariosObj);
  if ( optionObj === null ) { return []; }
  Object.keys ( optionObj ).forEach( key => {
    const r: any = optionObj[key];
    option.push( r );
  });
  // tslint:disable-next-line: forin
//  console.log( usuarios[0][prop].attributes );
  resul.push( optionObj.data.attributes );

  return resul;

}

getAccountingEntries(fecha) {
  const url = `${environment.URL_SERVICIOS}/ar_date/'${fecha}'/accouting_entries_report?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return resp;
    } )
  );
}

getAccountingRegistries() {
  const url = `${environment.URL_SERVICIOS}/accounting_registries/?token=${this.token}&secret_key=${environment.SECRET_KEY}`;
  return this.http.get(url).pipe(
    map( (resp: any) => {
      return this.crearArregloCuentasContables(resp);
    } )
  );
}

cancelaPoliza(params) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/cancel_accounting_registry/${params.idp.id}`;

  return this.http.patch( url, params ).pipe(
    map( (resp: any) => { return resp;
    } ));
}

getDetallesPoliza(idc) {
  const url = `${environment.URL_SERVICIOS}/accouting_registry_report/${idc}?token=${this.token}&secret_key=${environment.SECRET_KEY}`;

  return this.http.get(url).pipe(
    map( (resp: any) => {
      return (resp);
    } )
  );
}
confirmaPoliza(params) {
  params.token = this.token;
  params.secret_key = environment.SECRET_KEY;
  const url = `${environment.URL_SERVICIOS}/create_accounting_registry_with_entries/`;
  return this.http.post( url, params ).pipe(
            map( (resp: any) => {
              return (resp);
            }));

}
}
