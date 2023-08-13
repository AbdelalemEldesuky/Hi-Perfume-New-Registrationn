import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
  OnDestroy,
  TemplateRef,
} from "@angular/core";
import * as $ from 'jquery';
import {MatPaginatorModule} from '@angular/material/paginator';
import { HttpResponse } from "@angular/common/http";

import { HttpCategoryService } from "src/app/shared/services/categories.services";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  finalize,
  takeUntil,
  filter,
} from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpCartService } from "src/app/shared/services/cart.service";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  @ViewChild("template", { static: true }) template: TemplateRef<any>;

  modalRefs: BsModalRef[] = [];
  perfumes=[1,2,3,4,5,6,7,9,10,11,12,13,14,15,16]
  products: any;
  unsubscribeSignal: Subject<void> = new Subject();
  loading = true;
  tagID :any;
  query = {};
 currentPage =20;
 nextPage=false;
 cartDetails:any;
 stars: number[] = [1, 2, 3, 4, 5];
 selectedValue = 4;
 isFavorite = false;
 item_name:any
 item_sub_name:any;
 item_image:any;
  constructor(
    private httpCategoryService: HttpCategoryService,
    private toaster: ToastrService,
    private route: ActivatedRoute, private router: Router,
    private httpCartService: HttpCartService,
    private modalService: BsModalService,



  ) {}

  ngOnInit() {

   this.getFavorites()
   
  }




  rating(star){
    this.selectedValue=star;
  }
  refreshFavorit() {
    this.httpCategoryService.refresh();
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
          this.products = data.data.items;
          console.log('faviort tag///',this.products);
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
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

             this.toaster.success('Item added to cart');
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
}}



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
            this.getFavorites()
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


}
