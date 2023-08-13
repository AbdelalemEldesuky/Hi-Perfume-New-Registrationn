import { Component, OnInit, OnDestroy, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { HttpCartService } from 'src/app/shared/services/cart.service';
import { HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  finalize,
  takeUntil,
  filter,
} from "rxjs/operators";
import { HttpCategoryService } from 'src/app/shared/services/categories.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @ViewChild("rate", { static: true }) rate: TemplateRef<any>;
  @ViewChild("template", { static: true }) template: TemplateRef<any>;

  modalRefs: BsModalRef[] = [];
  carts: any;
  unsubscribeSignal: Subject<void> = new Subject();
  loading = true;
  cartDetails:any;
  isLoggedIn = localStorage.getItem("isLogin");

  favorites:any;
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private elementRef: ElementRef,
    private httpCartService: HttpCartService,
    private toaster: ToastrService,
    private httpCategoryService: HttpCategoryService,
    


  ) { }

  ngOnInit() {
    this.httpCategoryService.refreshEvent.subscribe(() => {
      if(this.isLoggedIn=='true'){
        this.getCart();
        this.getFavorites()
      }
    });
    if(this.isLoggedIn=='true'){
      this.getCart();
      this.getFavorites()
    }
  }

  openModal(MyModalComponent) {
    const config = {
      ignoreBackdropClick: false
    };
        const modalRef = this.modalService.show(MyModalComponent,config);
    this.modalRefs.push(modalRef);
  }

  closeModal() {
    // this.modalRefs[0].hide(); 
    this.modalRefs.forEach((modalRef) => modalRef.hide());
    this.modalRefs = [];
    
  }
  getFavorites() {
    this.httpCartService
      .getFavorites()
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.favorites = data.data.items.length;
          
        },
        (err) => {
          // this.toaster.error(err.error.message);
        }
      );
}

openCart(){
  if(localStorage.getItem("isLogin")==="false"){
  localStorage.setItem('need_login','true')
    this.router.navigateByUrl(
      `/auth/register`
    );
    localStorage.setItem('notAuthUser','true')
  }
  else{
    if( localStorage.getItem('userIsVerfied')=='false' && localStorage.getItem('userPhoneNumber')){
      this.toaster.error('You must activate your account first!');
      this.router.navigateByUrl(
        `/auth/verify`
      );
    }
    else if(!localStorage.getItem('userPhoneNumber' ) ){
      this.toaster.error('You must activate your account first!');
      this.toaster.error('Please, complete your profile data!');
  localStorage.setItem('editProfile','true')
  this.router.navigateByUrl(
    `/user/profile`
  );
      // this.openModal(forgetpasswordTemplate)
    }
    else{

      this.router.navigateByUrl(
        `/checkout/complete-payment`
      );
    }
  }

}

openFvorit(){
  if(localStorage.getItem("isLogin")==="false"){
  localStorage.setItem('need_login','true')
    this.router.navigateByUrl(
      `/auth/register`
    );
    // localStorage.setItem('notAuthUser','true')
  }
  else{
    this.router.navigateByUrl(
      `/favorites`
    );
  }

}

  getCart() {

    this.httpCartService
      .getCart()
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (res: any) => {
          this.cartDetails = res.data;
          this.carts = res.data.carts.length;
        },
        (err) => {
          // this.toaster.error(err.error.message);
        }
      );
}
}
