import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class CanActivePaymentStatus implements CanActivate {
    status: any;
    constructor(
        private router: Router,
    ) {
    }
    canActivate() {
        if (localStorage.getItem('credit_need_password') === 'true') {
            return true;
        } else {
            this.router.navigate([`/`]);
            false;
        }
    }
}