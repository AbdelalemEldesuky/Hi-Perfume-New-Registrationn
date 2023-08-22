import { Component, OnInit } from '@angular/core';
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
import { trigger, transition, style, animate } from '@angular/animations';
import { log, timeStamp } from 'console';
import * as $ from 'jquery';


interface itemSelectedData {
  id: number;
  image : string;
  price:number;
  name:string
}

@Component({
  selector: 'app-pickup',
  templateUrl: './pickup.component.html',
  styleUrls: ['./pickup.component.scss'],
  animations: [
    trigger('addAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('1s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class PickupComponent implements OnInit {
  
  itemSelected: any = [];

  pickup_items = [1,2,3,4]
  showImage = false;
  finalPrice =0;
  perfumes=[1,2,3,4,5,6,7,9,10,11,12,13,14,15,16]
  tagID :any;
  pickups: any[] = [];
  filteredCategories: any;
  loading = true;
  cartDetails:any;
  stars: number[] = [1, 2, 3, 4, 5];
  products: any[] = [];
   userData:any;
  unsubscribeSignal: Subject<void> = new Subject();
  constructor(  private httpCategoryService: HttpCategoryService,
    private toaster: ToastrService,
    private router: Router,
    private httpCartService: HttpCartService,

    ) { }

  ngOnInit() {
    this.userData=JSON.parse(localStorage.getItem("userData"))

    // this.showImage = !this.showImage;
    this.getProducts()
    const pickupData = localStorage.getItem('pickuupData') ? JSON.parse( localStorage.getItem('pickuupData')) : null
    if(pickupData){
      this.itemSelected =  pickupData
      this.finalPrice =  this.itemSelected.reduce((sum, item) => sum + item.price, 0);   
    }

  }

  getProducts() {
    this.httpCategoryService
      .getProductsFromApi()
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.products = data.data.items;
          // this.pagination=data.data.pagination;
      console.log('##products',this.products.length)
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
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
            this.getPickup() 
        }
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

  getPickup() {
    this.httpCategoryService
    .getSelectionsFromApi(this.tagID)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.pickups = data.body.data.items;
          console.log('pickups///',this.pickups);
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
}

refreshAPICart() {
  this.httpCategoryService.refresh();
}

addToCart() {
  if (localStorage.getItem("isLogin") === "false") {
    this.router.navigateByUrl(
      `/auth/register`
    );
    localStorage.setItem('need_login','true')
        localStorage.setItem('notAuthUser', 'true');
  }
  if(this.userData.take_sample==true){
    this.toaster.error('Free samples cannot be requested more than once');
  }
  if(localStorage.getItem("samplesInCart")==="true"){
    this.toaster.error('You have 3 Items inside the cart, you cannot take more.');
  }
  else {
    let completedRequests = 0;
    let isLastItem = false;
    this.itemSelected.forEach(item => {
      if(this.itemSelected.length == 3){
      const cartData = {
        item_id: item.id,
        quantity: 1,
        type:'sample'
      };

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
              this.refreshAPICart();
              completedRequests++;
              
              localStorage.removeItem('pickuupData')
              this.router.navigateByUrl("/checkout/complete-payment");
              if (completedRequests === this.itemSelected.length) {
                this.toaster.success('Items added to cart');
                localStorage.setItem('samplesInCart','true')
              }
            }
          },
          (err) => {
            this.loading = false;
            this.toaster.error(err.error.message);
          }
        );
      }
      else{
          // this.toaster.error('Please complete the box')
          // $(".add_to_cart").attr("disabled", true);

      }
    });
  }
}

refreshFavorit() {
  this.httpCategoryService.refresh();
}




  addImage(imageSrc: string, id: number,price:number,name:string) {
    this.showImage = !this.showImage;
    if (this.itemSelected.length < 3 && !this.itemSelected.find(item => item.image === imageSrc)) {
      const itemSelectedData: itemSelectedData = { id: id, image: imageSrc,price:price,name:name };
      this.itemSelected.push(itemSelectedData);
      this.finalPrice +=price ;
      console.log('gggggggg', this.itemSelected);
      localStorage.setItem('pickuupData',JSON.stringify(this.itemSelected))
    }
    if(this.itemSelected.length == 3){
      $('.pickup_box__selectors_div').css('border-color', '#E1AF4F'); 
      $(".add_to_cart").removeClass("disabled");
    }
    if(this.itemSelected.length < 3){
      $('.pickup_box__selectors_div').css('border-color', '#919191');
    }
  }

  deletePickup(item: itemSelectedData,price) {
    const index = this.itemSelected.indexOf(item);
    if (index > -1) {
      this.itemSelected.splice(index, 1);      
      this.finalPrice -= price ;
      localStorage.setItem('pickuupData',JSON.stringify(this.itemSelected))
      if(this.itemSelected.length < 3){
        $('.pickup_box__selectors_div').css('border-color', '#919191');
        $(".add_to_cart").addClass("disabled");
      }
    }
  }
}
