import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
  Renderer2,
  DoCheck,
  TemplateRef
} from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
// import { StripeService, StripeCardElementOptions, StripeElementsOptions } from 'stripe-angular';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  finalize,
  takeUntil,
  filter,
} from "rxjs/operators";
import {
  BsModalService,
  BsModalRef,
  ModalOptions,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { HttpCartService } from "src/app/shared/services/cart.service";
import { HttpResponse } from "@angular/common/http";
// import { StripeService, Elements, Element as StripeElement, ElementsOptions } from "ngx-stripe";
import { HttpCategoryService } from 'src/app/shared/services/categories.services';
import * as $ from 'jquery';
import { HttpOrderService } from "src/app/shared/services/order.service ";

@Component({
  selector: 'app-order-details',
  templateUrl: 'order-details.component.html',
  styleUrls: ['order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit ,DoCheck{
  @ViewChild("template", { static: true }) template: TemplateRef<any>;

  modalRefs: BsModalRef[] = [];
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue = 3;
  loading = true;
  carts: any[] = [];
  cartDetails:any;
  unsubscribeSignal: Subject<void> = new Subject();
  handler:any = null;
  userData: any = [];
  payment_token :any;
  payment_status =false;
  orderID:any;
  order:any;
  item_name:any
  item_sub_name:any;
  item_image:any;
  invoice_data:any;
  constructor(
    private toaster: ToastrService,
    private router: Router,
    private httpCartService: HttpCartService,
    private httpOrderService: HttpOrderService,
    private modalService: BsModalService,
    private httpCategoryService: HttpCategoryService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.orderID = this.route.snapshot.params.id;
    this.getOrderDetails(this.orderID)
    this.userData=JSON.parse(localStorage.getItem("userData"))

  }

  rating(star){
    this.selectedValue=star;
  }

  closeModal() {
    this.modalRefs.forEach((modalRef) => modalRef.hide());
    this.modalRefs = [];
  }

  openModal(MyModalComponent,total_price) {
    // $('.modal-backdrop').hide();
    localStorage.setItem('TPFAMO',total_price)
        const modalRef = this.modalService.show(MyModalComponent);
    this.modalRefs.push(modalRef);
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
          this.carts = res.data.carts;
          console.log('cartDetails///',this.cartDetails);
          console.log('cart///',this.carts);
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
}

addToCart(id) {
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
  
            this.refreshAPICart()
            //  this.toaster.success('Item added to cart');
             this.getCart()
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
}}
refreshAPICart() {
  this.httpCategoryService.refresh();
}
updateCart(cart_id,quantity) {
  let cart = {
    quantity: quantity -1,
    cart_id: cart_id,
  };
  this.loading = true;
    this.httpCartService
      .updateCart(cart)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            this.cartDetails = resp.body;
             this.toaster.success('deleted');
             this.getCart()
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
}

deleteCart(id) {
  this.loading = true;
    this.httpCartService
      .deleteCart(id)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            this.cartDetails = resp.body;
             this.toaster.success('deleted');
             this.getCart()
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
}


promoCode(code) {
  let body = {
    promocode: code,
  };
  this.loading = true;
    this.httpCartService
      .promoCode(body)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
             this.toaster.success(resp.body.message);
             this.getCart()
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
}
pay(amount: any) {    
  //  const token = this.userData.access_token
  var handler = (<any>window).StripeCheckout.configure({
    key: 'pk_test_51H5E6hGtXaZtwBYvCG39zAdFDeA8qFTa9bKWxDmOzyfY5NAiwS1smV7HCcWTqz3BDDaTECbNquIWOonGMS7cWERB00o5PFocr9',
    locale: 'auto',
    token: function (token: any) {
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.
      console.log(token.id)
      this.payment_token = token.id
      this.payment_status =true;
      console.log(this.payment_status)
      localStorage.setItem('paymentToken',token.id)
      
      // alert('Token Created!!');
    }
  });

  handler.open({
    name: 'Hi Perfume',
    description: 'Payment',
    amount: amount * 100
  });
}

loadStripe() {
  if(!window.document.getElementById('stripe-script')) {
    var s = window.document.createElement("script");
    s.id = "stripe-script";
    s.type = "text/javascript";
    s.src = "https://checkout.stripe.com/checkout.js";
    s.onload = () => {
      this.handler = (<any>window).StripeCheckout.configure({
        key: 'pk_test_51H5E6hGtXaZtwBYvCG39zAdFDeA8qFTa9bKWxDmOzyfY5NAiwS1smV7HCcWTqz3BDDaTECbNquIWOonGMS7cWERB00o5PFocr9',
        locale: 'auto',
        token: function (token: any) {
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
          console.log(token)
        }
      });
    }
     
    window.document.body.appendChild(s);
  }
}

ngDoCheck(): void {
  console.log('2222222222222222222',this.payment_status);
  if(localStorage.getItem('paymentToken')){
    this.makeOrder()
  }
}
makeOrder() {
const token = localStorage.getItem('paymentToken')
localStorage.removeItem('paymentToken')
  if(token){
  let body = {
    payment_token : token,
    brand_type:"visa",
    method:'stripe'
    
  };
  this.loading = true;
    this.httpOrderService
      .makeOrder(body)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            // this.cartDetails = resp.body;
            localStorage.removeItem('paymentToken')
            this.payment_status=false;
            this.toaster.success('Payment Success!!');
            this.router.navigateByUrl(
              `/`
            );
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
}
}

getOrderDetails(id) {
  this.httpCartService
    .getOrderDetailsFromApi(id)
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable()),
      finalize(() => (this.loading = false))
    )
    .subscribe(
      (res: any) => {
        this.cartDetails = res.data;
        this.carts = res.data.items;
        localStorage.setItem('invoice_data',JSON.stringify(res))
        console.log('Order///',this.carts);
        console.log('inv///',res);
        
      },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
}
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


