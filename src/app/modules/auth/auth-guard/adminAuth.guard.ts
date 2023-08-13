import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable()
export class CanActivateAdminGuard implements CanActivate {
    status: any;
    constructor(private authService: AuthService, private router: Router) {
    }
    handleGuard() {
        return this.authService.getUserRole() === 'admin' ? true : this.router.navigateByUrl(``);
    }

    canActivate() {
        return this.handleGuard();
    }
}