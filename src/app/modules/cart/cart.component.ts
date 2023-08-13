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
import { Router } from '@angular/router';
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
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit ,DoCheck{
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
  constructor(
    private toaster: ToastrService,
    private router: Router,
    private httpCartService: HttpCartService,
    private httpOrderService: HttpOrderService,
    private modalService: BsModalService,
    private httpCategoryService: HttpCategoryService,
  ) { }

  ngOnInit() {
    $(document).ready(function () {

      'use strict';
  
      var usernameError = true,
          emailError    = true,
          passwordError = true,
          passConfirm   = true;
  
      // Detect browser for css purpose
      if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
          $('.form form label').addClass('fontSwitch');
      }
  
      // Label effect
      $('input').focus(function () {
  
          $(this).siblings('label').addClass('active');
      });
  
      // Form validation
      $('input').blur(function () {
  
          // User Name
          if ($(this).hasClass('name')) {
              if ($(this).val().length === 0) {
                  $(this).siblings('span.error').text('Please type your full name').fadeIn().parent('.form-group').addClass('hasError');
                  usernameError = true;
              } else if ($(this).val().length > 1 && $(this).val().length <= 6) {
                  $(this).siblings('span.error').text('Please type at least 6 characters').fadeIn().parent('.form-group').addClass('hasError');
                  usernameError = true;
              } else {
                  $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                  usernameError = false;
              }
          }
          // Email
          if ($(this).hasClass('email')) {
              if ($(this).val().length == '') {
                  $(this).siblings('span.error').text('Please type your email address').fadeIn().parent('.form-group').addClass('hasError');
                  emailError = true;
              } else {
                  $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                  emailError = false;
              }
          }
  
          // PassWord
          if ($(this).hasClass('pass')) {
              if ($(this).val().length < 8) {
                  $(this).siblings('span.error').text('Please type at least 8 charcters').fadeIn().parent('.form-group').addClass('hasError');
                  passwordError = true;
              } else {
                  $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                  passwordError = false;
              }
          }
  
          // PassWord confirmation
          if ($('.pass').val() !== $('.passConfirm').val()) {
              $('.passConfirm').siblings('.error').text('Passwords don\'t match').fadeIn().parent('.form-group').addClass('hasError');
              passConfirm = false;
          } else {
              $('.passConfirm').siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
              passConfirm = false;
          }
  
          // label effect
          if ($(this).val().length > 0) {
              $(this).siblings('label').addClass('active');
          } else {
              $(this).siblings('label').removeClass('active');
          }
      });
  
  
      // form switch
      $('a.switch').click(function (e) {
          $(this).toggleClass('active');
          e.preventDefault();
  
          if ($('a.switch').hasClass('active')) {
              $(this).parents('.form-peice').addClass('switched').siblings('.form-peice').removeClass('switched');
          } else {
              $(this).parents('.form-peice').removeClass('switched').siblings('.form-peice').addClass('switched');
          }
      });
  
  
      // Form submit
      $('form.signup-form').submit(function (event) {
          event.preventDefault();
  
          if (usernameError == true || emailError == true || passwordError == true || passConfirm == true) {
              $('.name, .email, .pass, .passConfirm').blur();
          } else {
              $('.signup, .login').addClass('switched');
  
              setTimeout(function () { $('.signup, .login').hide(); }, 700);
              setTimeout(function () { $('.brand').addClass('active'); }, 300);
              setTimeout(function () { $('.heading').addClass('active'); }, 600);
              setTimeout(function () { $('.success-msg p').addClass('active'); }, 900);
              setTimeout(function () { $('.success-msg a').addClass('active'); }, 1050);
              setTimeout(function () { $('.form').hide(); }, 700);
          }
      });
  
      // Reload page
      $('a.profile').on('click', function () {
          location.reload();
      });
  
  
  });

  }

  rating(star){
    this.selectedValue=star;
  }

  closeModal() {
    this.modalRefs.forEach((modalRef) => modalRef.hide());
    this.modalRefs = [];
  }

  openModal(MyModalComponent,total_price) {
    const config = {
      ignoreBackdropClick: true
    };
    // $('.modal-backdrop').hide();
 localStorage.setItem('TPFAMO',total_price)
        const modalRef = this.modalService.show(MyModalComponent,config);
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
             this.toaster.success( resp.body.message);
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
            this.refreshAPICart()
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
}
}
}
