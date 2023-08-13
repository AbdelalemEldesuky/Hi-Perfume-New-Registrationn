import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
  Renderer2,
  OnDestroy,
  TemplateRef,
} from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import { ToastrService } from "ngx-toastr";
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

import { Subject } from "rxjs";
import { HttpCartService } from "src/app/shared/services/cart.service";
import { Meta, Title } from "@angular/platform-browser";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { NotificationService } from "src/app/shared/components/popup-notification/popup-notification.service";
import { Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit ,AfterViewInit,OnDestroy{
  @ViewChild("template", { static: true }) template: TemplateRef<any>;

  modalRefs: BsModalRef[] = [];

  unsubscribeSignal: Subject<void> = new Subject();
  loading = true;
  perfumes=[1,2,3,4,5,6,7,9,10,11,12,13,14,15,16]
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue = 3;
  productID :any;
  partnerId:any;
  product:any;
  is_added=false;
  item_name:any
  item_sub_name:any;
  item_image:any;
  item_id:any;
  userIsVerfied = localStorage.getItem("userIsVerfied");
  isLoggedIn = localStorage.getItem("isLogin");


  constructor(private route: ActivatedRoute,
    private httpCategoryService: HttpCategoryService,
    private httpCartService: HttpCartService,
    private router: Router,
    private elementRef: ElementRef,
     private renderer: Renderer2,
    private toaster: ToastrService,
    private metaTagService:Meta,
    private titleService : Title,
        private metaService: Meta,
        private activateRoute :ActivatedRoute,
        private modalService: BsModalService,
    private fg: FormBuilder,
    private notificationService: NotificationService


    ) {
   }
   public addCommentForm = this.fg.group({
    comment: ["", Validators.required],
  });
  ngOnInit() {
    this.notificationService.notificationClicked$.subscribe(data => {
      // Handle the popup notification click event
      // console.log('Popup notification clicked:', data);
       this.refreshAPICart()
       this.getProductDetails(this.item_id)
       // Perform any desired actions with the data
    });

    this.productID = this.route.snapshot.params.id;
    this.partnerId = this.route.snapshot.params.partner_id;
    const userId = localStorage.getItem('userId');
    if(userId !== this.partnerId && this.partnerId !=0){
      localStorage.setItem('partnerId',this.partnerId)
    }
      // this.getProductDetails(this.productID)
      console.log('partner_id',this.partnerId);
      
      console.log('this.activateRoute---',this.activateRoute);
       this.activateRoute.data.subscribe((data)=>{
        this.product =data.myProduct.data;
        console.log('this.product---',this.product);
      //         $('meta[property=og\\:image]').attr('content', this.product.image);
      // $('meta[property=og\\:title]').attr('content',  this.product.name);
      // $('meta[property=og\\:description]').attr('content', this.product.description);
    //     this.titleService.setTitle(this.product.name);
    // this.metaTagService.updateTag({ property: 'og:image', content: `${this.product.image}`});
    //     this.metaTagService.updateTag({ property: 'og:title', content: this.product.name  });
    //     this.metaTagService.updateTag({ property: 'og:description', content: this.product.sub_name});
      })


  }

  ngOnDestroy() {
// localStorage.removeItem('partnerId')
  }
  ngAfterViewInit(): void {
    $(".best_img_header").hide();

}
  rating(star){
    this.selectedValue=star;
  }
  
  getProductDetails(id) {
    this.httpCategoryService
      .getProductDetailsFromApi(id)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.product = data.data;
          console.log('product///',this.product);
          
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
}
        clickme(smallImg: HTMLImageElement) {
          const fullImg = document.getElementById("imagebox") as HTMLImageElement;
          fullImg.src = smallImg.src;
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
        
        addToCart(product,id,addToCartNotifyTemplate,name,image,sub_name) {
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

                    // this.cartDetails = resp.body;
                    this.item_name=name;
                    this.item_sub_name=sub_name;
                    this.item_image=image;
                    this.item_id=id;
                    product.showPopup = true;

                    //  this.openModal(addToCartNotifyTemplate)
                    // this.refreshAPICart()
            // this.getProductDetails(id)

                     this.toaster.success('Item added to cart');
                  }
                },
                (err) => {
                  this.loading = false;
                  this.toaster.error(err.error.message);
                }
              );
        }
      }
      
      refreshFavorit() {
        this.httpCategoryService.refresh();
      }
      
      addComment() {
    const data = this.addCommentForm.value;

        if (!data.comment) {
          const message =
          "Please Enter Yoyr Comment"
          this.toaster.error(message);
          return;
        }
       
        this.loading = true;
        const body = {
          comment: data.comment,
          item_id: this.product.id,
        };
        this.httpCategoryService
          .addComment(body)
          .pipe(
            takeUntil(this.unsubscribeSignal.asObservable()),
            finalize(() => (this.loading = false))
          )
          .subscribe(
            (resp) => {
              if (resp.status === 200) {
                this.addCommentForm.controls.comment.setValue("");
                 const message =
                  "Thank you for your comment on our product at Hi Perfume! ";
                  this.toaster.success(message);
                 this.getProductDetails(this.productID)
              }
            },
            (err) => {
              this.toaster.error(err.error.message);
            }
          );
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
                  this.is_added = resp.body.data.is_added;
                  this.getProductDetails(this.productID)
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


        twitterShare() {
          var twitterWindow = window.open(
          'https://twitter.com/share?url=' + document.URL,
          'twitter-popup',
          'height=350,width=600'
          );
          if (twitterWindow.focus) {
          twitterWindow.focus();
          }
          return false;
          }

      
          
        
           
}
