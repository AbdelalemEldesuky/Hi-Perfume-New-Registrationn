import { Component, OnInit, Input, ElementRef, Renderer, HostListener } from '@angular/core';
import { MyHttpInterceptor } from '../interceptor/my-http-interceptor';
import { LanguageService } from 'src/app/shared/services/language.service';
import { AuthService } from 'src/app/modules/auth/service/auth.service';
import { Router } from '@angular/router';
import { HttpCartService } from 'src/app/shared/services/cart.service';
import { Subscription } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  isLoggedOut$ = this.authService.isLogoutState$;
  token = this.authService.getToken();
  _opened: boolean = false;
  menuState: String = 'out';
  logoutState$ = this.authService.isLogoutState$;
  userStateLocalStorage: boolean;
  isLoggedIn = localStorage.getItem("isLogin");
  subscription: Subscription;
  isShow = true;
  userData :any ={};
  constructor(
    private el: ElementRef,
    public authService: AuthService,
    private languageService: LanguageService,
    private utilityService: HttpCartService,
    private router: Router,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem("userData"));
  }

  @HostListener('click', ['$event.target'])
  onClick(target) {
    let item = this.el.nativeElement.querySelector('li');
    this.utilityService.closeSideBarSubject.next(true);
  }

  switchLang() {
    const language = '';
    let changeLanguage ='' ? '' : '';
    // this.languageService.changeAppLanguage(changeLanguage);
  }

  logOut() {
    this.authService.logout();
  }
}
