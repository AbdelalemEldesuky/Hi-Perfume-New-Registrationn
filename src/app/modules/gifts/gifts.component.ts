import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
  TemplateRef,
} from "@angular/core";
import { NavigationExtras } from '@angular/router';
import * as $ from 'jquery';
import { HttpCategoryService } from "src/app/shared/services/categories.services";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  finalize,
  takeUntil,
  filter,
} from "rxjs/operators";
import { HttpResponse } from "@angular/common/http";

import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { TabDirective } from 'ngx-bootstrap/tabs';
import { Router } from "@angular/router";
import { HttpCartService } from "src/app/shared/services/cart.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss']
})
export class GiftsComponent implements OnInit {
  @ViewChild("template", { static: true }) template: TemplateRef<any>;

  modalRefs: BsModalRef[] = [];
  selections: any[] = [];
  selections2: any[] = [1,2,3,4,5,6,7,8,6,5,4,3];
  unsubscribeSignal: Subject<void> = new Subject();
  loading = true;
  tagName :any;
  tagID :any;
  cartDetails:any;
  stars: number[] = [1, 2, 3, 4, 5];
  item_name:any
  item_sub_name:any;
  item_image:any;
  constructor(  private httpCategoryService: HttpCategoryService,
    private httpCartService: HttpCartService,
    private toaster: ToastrService,
    private modalService: BsModalService,

    private router: Router) { }

  ngOnInit() {
    this.getTagIDFromApi("gifts")

  }

  getTagIDFromApi(tagName) { 
    this.httpCategoryService
      .getTagIDFromApi(tagName)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.tagID = data.body.data[0].id;  
          console.log('tttt',this.tagID);
          if(this.tagID){
            this.getSelections() 
        }
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

  getSelections() {
    this.httpCategoryService
    .getSelectionsFromApi(this.tagID)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.selections = data.data.items;
          console.log('sssss///',this.selections);
     
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
}

onTabSelect(tab: TabDirective) {
  console.log('Tab selected:', tab.heading);
  // Add your logic here
}

openProductDetails(id: number): void {
  const userId = localStorage.getItem('userId');
   if(userId){
     this.router.navigateByUrl(
      `/product/${id}/${localStorage.getItem('userId')}`
    );
   }
   else{
     this.router.navigateByUrl(
       `/product/${id}/${0}`
     );
   }
}

refreshAPICart() {
  this.httpCategoryService.refresh();
}

openModal(MyModalComponent) {
  const config = {
    ignoreBackdropClick: true
  };
  const modalRef = this.modalService.show(MyModalComponent,config);
this.modalRefs.push(modalRef);
}

addToCart(id,addToCartNotifyTemplate,name,image,sub_name) {
  if(localStorage.getItem("isLogin")==="false"){
    this.router.navigateByUrl(
      `/auth/register`
    );
    localStorage.setItem('need_login','true')
    localStorage.setItem('notAuthUser','true')
  }
    else{
  let cartData = {
    item_id: id,
    quantity: 1,
  };
  this.loading = true;
    this.httpCartService
      .addToCart(cartData)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            this.cartDetails = resp.body;
            this.item_name=name;
            this.item_sub_name=sub_name;
            this.item_image=image;
            //  this.openModal(addToCartNotifyTemplate)
            this.refreshAPICart()
            this.getSelections()

             this.toaster.success('Item added to cart');
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
}}

refreshFavorit() {
  this.httpCategoryService.refresh();
}

addFavorite(id) {
  if(localStorage.getItem("isLogin")==="false"){
    this.router.navigateByUrl(
      `/auth/register`
    );
    localStorage.setItem('need_login','true')
    localStorage.setItem('notAuthUser','true')

  }
    else{
  let cartData = {
    item_id: id,
  };
  this.loading = true;
    this.httpCartService
      .addFavorite(cartData)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            this.cartDetails = resp.body;
            this.getSelections()
            this.refreshFavorit()
            if(resp.body.data.is_added == true){
              this.toaster.success(resp.body.message);
            }
            if(resp.body.data.is_added == false){
              this.toaster.error(resp.body.message);
            }
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
}}

facbookShare(id) {
  const userId = localStorage.getItem('userId')?localStorage.getItem('userId'):0
  const url_= `https://hiperfumeusa.com/product/${id}/${userId}`
console.log('ts---',url_);
  var facebookWindow = window.open(
  'https://www.facebook.com/sharer/sharer.php?u=' + url_,
  'facebook-popup',
  'height=350,width=600'
  );
  if (facebookWindow.focus) {
  facebookWindow.focus();
  }
  return false;
  }

  shareOnWhatsapp(name: string, image: string, sub_name: string, id: string) {
    const userId = localStorage.getItem('userId')?localStorage.getItem('userId'):0
    const url_=  `https://hiperfumeusa.com/product/${id}/${userId}`
    const url = `https://wa.me?text=${url_}`;
    window.open(url, '_blank');
  }

  shareOnInstagram(name: string, image: string, sub_name: string, id: string) {
    const userId = localStorage.getItem('userId')?localStorage.getItem('userId'):0
    const url_=  `https://hiperfumeusa.com/product/${id}/${userId}`
    const url = `https://www.instagram.com/share/create/?url=${url_}&caption=${encodeURIComponent(sub_name)}`;
    window.open(url, '_blank');
  }
}
