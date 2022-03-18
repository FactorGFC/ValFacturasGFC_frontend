import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
@Injectable()
export class CobranzaDirectaGuard implements CanActivate {
    tieneacceso = false
    options: any[] = [];
  constructor(
    public router: Router
  ) {}
  canActivate() {
    this.options = JSON.parse(localStorage.getItem('dataacc'));
    if ( this.options.includes(btoa('/cobranzadirecta')) ) {
      return true
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
    
    
  }
}