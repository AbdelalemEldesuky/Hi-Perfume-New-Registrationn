import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../service/auth.service";

@Injectable({
  providedIn: "root",
})
export class CanActivateViaAuthGuard implements CanActivate {
  status: any;
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem("isLogin")=="true") {
      return true;
    }
    localStorage.setItem('notAuthUser','true')
    localStorage.setItem('need_login','true')
    this.router.navigate([
      `/auth/register`,
    ]);
    return false;
  }
}
