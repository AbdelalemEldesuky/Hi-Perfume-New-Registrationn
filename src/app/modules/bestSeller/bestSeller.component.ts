import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  finalize,
  takeUntil,
  filter,
} from "rxjs/operators";
import { HttpCartService } from "src/app/shared/services/cart.service";
import { HttpResponse } from "@angular/common/http";

import { HttpCategoryService } from 'src/app/shared/services/categories.services';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/shared/components/popup-notification/popup-notification.service';
@Component({
  selector: 'app-bestSeller',
  templateUrl: './bestSeller.component.html',
  styleUrls: ['./bestSeller.component.scss']
})
export class BestSellerComponent implements OnInit {
  @ViewChild("template", { static: true }) template: TemplateRef<any>;

  modalRefs: BsModalRef[] = [];
  perfumes=[1,2,3,4,5,6,7,9,10,11,12,13,14,15,16]
  tagID :any;
  products: any[] = [];
  filteredCategories: any;
  loading = true;
  cartDetails:any;
  stars: number[] = [1, 2, 3, 4, 5];
  item_name:any
  item_sub_name:any;
  item_image:any;
  unsubscribeSignal: Subject<void> = new Subject();

  itemIsAdded=false;
  is_added=false;
  catId:any;
  userIsVerfied = localStorage.getItem("userIsVerfied");
  isLoggedIn = localStorage.getItem("isLogin");
  constructor(  private httpCategoryService: HttpCategoryService,
    private toaster: ToastrService,
    private router: Router,
    private httpCartService: HttpCartService,
    private modalService: BsModalService,
    private notificationService: NotificationService



    ) { }

  ngOnInit() {
    this.notificationService.notificationClicked$.subscribe(data => {
      // Handle the popup notification click event
      // console.log('Popup notification clicked:', data);
      this.refreshAPICart()
      this.getTagIDFromApi("best seller")
      // Perform any desired actions with the data
    });
    this.getTagIDFromApi("best seller")

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
          console.log('ttttBest Sele',this.tagID);
        if(this.tagID){
          this.getSelections() 
      }
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

  filterCategories(catVame) {
    if (catVame) {
      this.filteredCategories = this.products.filter((category: any) =>
        category.category.name.toLowerCase().includes(catVame));
        console.log('filterrr',this.filteredCategories);
        
    } else {
      this.filteredCategories = this.products;
    }
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
          this.products = data.data.items;
          console.log('sssss///best seller',this.products);
     
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
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

addToCart(selection,id,addToCartNotifyTemplate,name,image,sub_name,catId) {
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
            this.itemIsAdded=true;
            selection.showPopup = true;
            this.catId=catId;
            //  this.openModal(addToCartNotifyTemplate)
            // this.refreshAPICart()
            // this.getProductsByCategory(catId)

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
