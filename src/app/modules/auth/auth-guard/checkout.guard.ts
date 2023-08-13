import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class CanActivateCheckoutGuard implements CanActivate {
    status: any;
    constructor(private authService: AuthService, private router: Router,
        private toastr: ToastrService) {
    }
    canActivate() {
        // if (localStorage.getItem('checkout') === 'true' || localStorage.getItem('isCheckingout') === 'true') {
        //     return true;
        // } else {
        //     this.toastr.error('لا يوجد انشطه لاستكمال عملية الشراء ، من فضلك أضف نشاط')
        //     this.router.navigate([`/${localStorage.getItem('LOCALIZE_DEFAULT_LANGUAGE')}/`]);
        //     false;
        // }

        return true;
    }
}