import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
  OnDestroy,
  OnChanges,
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
import { NotificationService } from "src/app/shared/components/popup-notification/popup-notification.service";

@Component({
  selector: 'app-perfumes',
  templateUrl: './perfumes.component.html',
  styleUrls: ['./perfumes.component.scss']
})
export class PerfumesComponent implements OnInit,OnDestroy {
  @ViewChild("template", { static: true }) template: TemplateRef<any>;

  modalRefs: BsModalRef[] = [];
  perfumes=[1,2,3,4,5,6,7,9,10,11,12,13,14,15,16]
  products: any[] = [];
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
 onSearch=false;
 pagination:any;
 itemAddedCart=false
 item_name:any
 item_sub_name:any;
 item_image:any;
 item_id:any;
 userIsVerfied = localStorage.getItem("userIsVerfied");
 isLoggedIn = localStorage.getItem("isLogin");

  constructor(
    private httpCategoryService: HttpCategoryService,
    private toaster: ToastrService,
    private route: ActivatedRoute, private router: Router,
    private httpCartService: HttpCartService,
    private modalService: BsModalService,
    private notificationService: NotificationService


  ) {}

  ngOnInit() {
    this.notificationService.notificationClicked$.subscribe(data => {
      // Handle the popup notification click event
      // console.log('Popup notification clicked:', data);
       this.refreshAPICart()
            this.getProducts()
      // Perform any desired actions with the data
    });
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 1;
    })
   console.log('zzzzzz', 
   this.currentPage
   );
    this.tagID = localStorage.getItem('tagId');
    if(this.tagID){
      this.getSelections();
      this.onSearch=true;
    localStorage.removeItem('tagId');

    }
     if(localStorage.getItem('prouductByFilter')){
      this.products= JSON.parse(localStorage.getItem('prouductByFilter'));
      this.onSearch=true;
      localStorage.removeItem('prouductByFilter')

    }
     if(localStorage.getItem('prouductByDiscover')){

      this.products= JSON.parse(localStorage.getItem('prouductByDiscover'));
      console.log('/////////',this.products);
      this.pagination=1
      this.onSearch=true;
      localStorage.removeItem('prouductByDiscover')
    }
    if(this.onSearch==false){
      this.getProducts() ;
      console.log('elseeeeee');
      
    }
  }


  ngOnDestroy() {
    localStorage.removeItem('tagId');
    localStorage.removeItem('prouductByFilter')
    localStorage.removeItem('prouductByDiscover')

  }
  openModal(MyModalComponent) {
    const config = {
      ignoreBackdropClick: true
    };
        const modalRef = this.modalService.show(MyModalComponent,config);
    this.modalRefs.push(modalRef);
  }
  closeModal() {
    this.modalRefs.forEach((modalRef) => modalRef.hide());
    this.modalRefs = [];
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
          this.pagination=data.data.pagination;
      console.log('##products',this.products.length)
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }
  rating(star){
    this.selectedValue=star;
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
          console.log('perfume tag///',this.products);
          this.pagination=data.data.pagination;
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
}
getProductsByPagination(page) {
  console.log('pageee',parseInt(page)+1);
  
  this.httpCategoryService
  .getProductsByPaginationFromApi(parseInt(page)+1)
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable()),
      finalize(() => (this.loading = false))
    )
    .subscribe(
      (data: any) => {
        this.products.push(data.data.items)
        
        this.products = [].concat(...this.products);
        console.log('perfume pagination///',this.products);
        this.pagination=data.data.pagination;
        console.log('pagination',this.pagination);

      },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
}
// pageChange() {
//   if(this.nextPage == true){
//     this.currentPage = this.route.snapshot.params.page;
//     console.log('curr page',this.currentPage);
//   }
//   this.query['page'] = this.currentPage +1;
//   this.router.navigate([`/perfumes`], { queryParams: this.query });
//   this.nextPage = true;
// }
refreshAPICart() {
  this.httpCategoryService.refresh();
}
pageChange(event: any) {
  console.log('ppppp',event.pageIndex );
  
  this.query['page'] = event.pageIndex ;
  // this.router.navigate([`/perfumes/`], { queryParams: this.query });

  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([`/perfumes/`], { queryParams: this.query });

  });
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
addToCart(selection,id,addToCartNotifyTemplate,name,image,sub_name) {
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
      selection.showPopup = true;
           
             this.toaster.success('Item added to cart');
            this.item_name=name;
            this.item_sub_name=sub_name;
            this.item_image=image;
            this.item_id=id;
            //  this.openModal(addToCartNotifyTemplate)
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
            this.getProducts()
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

