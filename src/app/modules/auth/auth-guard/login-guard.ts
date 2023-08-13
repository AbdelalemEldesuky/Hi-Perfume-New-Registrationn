import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
    providedIn:'root'
})
export class CanActivateLoginGuard implements CanActivate {
    status: any;
    constructor(private authService: AuthService, private router: Router) {
    }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authService.getToken() === undefined) {
            this.router.navigateByUrl('/')
            return true;
        }

        // navigate to login page
        this.router.navigate(['/']);
        // you can save redirect url so after authing we can move them back to the page they requested
        return false;
    }
}