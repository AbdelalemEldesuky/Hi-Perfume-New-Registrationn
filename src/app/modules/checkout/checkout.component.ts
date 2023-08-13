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
import { FormBuilder, FormGroup } from "@angular/forms";
import { UsersService } from "../home/services/users.service";

import {  OnDestroy, ChangeDetectorRef } from "@angular/core";
import {  Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import {
  take,
  takeLast,
  delay,
  share,
} from "rxjs/operators";
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider, VKLoginProvider } from "angularx-social-login";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { AuthService } from "../auth/service/auth.service";

interface Country {
  shortName: string;
  name: string;
}

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"],

})



export class CheckoutComponent implements OnInit ,DoCheck {
  @ViewChild("template", { static: true }) template: TemplateRef<any>;
  @ViewChild('verfyOTPTemplate', { static: true }) verfyOTPTemplate;

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
  editFile: boolean = true;
  removeUpload: boolean = false;
  shippingForm: FormGroup;
  changeUserMobileForm: FormGroup;
  changeUserPasswordForm: FormGroup;
  activeTabId: string = 'overview';
  country_iso=CountryISO.UnitedStates

  modalRef: BsModalRef;
  oneAtATime = true;
  firstName: any;
  location:any;
  orders: any[] = [];
  shippingData:any
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  countries: Country[];
  states: string[];
  cities: string[];
imageFile:any
  country = new FormControl(null, [Validators.required]);
  state = new FormControl({ value: null, disabled: false }, [
    Validators.required,
  ]);
  city = new FormControl({ value: null, disabled: false }, [
    Validators.required,
  ]);
  total_price:any
  constructor(
    private toaster: ToastrService,
    private httpCartService: HttpCartService,
    private httpOrderService: HttpOrderService,
    private modalService: BsModalService,
    private httpCategoryService: HttpCategoryService,

    public breakpointObserver: BreakpointObserver,
    private router: Router,
    private httpUsersService: UsersService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private fg: FormBuilder,
    public authService: AuthService,
  ) {  this.countries = this.authService.getCountries();
  }

  ngOnInit() {

      if(localStorage.getItem("isLogin")==="false" ){
        this.router.navigateByUrl(
          `/auth/register`
        );
        localStorage.setItem('need_login','true')
        localStorage.setItem('notAuthUser','true')
      }
      else{
        if( localStorage.getItem('userIsVerfied')=='false' && localStorage.getItem('userPhoneNumber')){
          this.router.navigateByUrl(
            `/`
          );
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
        }
        else{
    
          this.router.navigateByUrl(
            `/checkout/complete-payment`
          );
        }
      }

    this.total_price=localStorage.getItem('TPFAMO')
    this.country.valueChanges.subscribe((country) => {
      this.state.reset();
      // this.state.disable();
        this.states = this.authService.getStatesByCountry(country);
        this.state.enable();
    });

    this.state.valueChanges.subscribe((state) => {
      this.city.reset();
      // this.city.disable();
        this.cities = this.authService.getCitiesByState(this.country.value, state);
        this.city.enable();
    });

    this.getCart();


    this.loadStripe();
    this.userData=JSON.parse(localStorage.getItem("userData"))

    this.shippingForm = this.fg.group({
      first_name: [ "", Validators.required],
      last_name: ["", Validators.required],
      email: ["", Validators.required],
      mobile: [""],       
      gender: ["", Validators.required],  
      dob: [""],
      password: ["", Validators.required],
      confirmPassword: ["", Validators.required],
      country: this.country,
      state: this.state,
      city: this.city,
      zip_code: [""],
      country_code: [""],
      card_number: ["", Validators.required],
      cvv: ["", Validators.required],
      expiration_date: ["", Validators.required],
      address: ["", Validators.required],
      description: [""],
      
      myCheckbox: new FormControl(false),

    });

    this.changeUserMobileForm = this.fg.group({
      phone: ["", Validators.required],
    });
    this.changeUserPasswordForm = this.fg.group({
      oldPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
      newPasswordConfirmation: ["", Validators.required],
    });
    $(document).ready(function() {
      $('.btn-1').click(function() {
        $('#myTabse a[href="#edit_profile"]').tab('show');
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
    // $('.modal-backdrop').hide();
 localStorage.setItem('TPFAMO',total_price)
        const modalRef = this.modalService.show(MyModalComponent);
    this.modalRefs.push(modalRef);
  }
  openVerfyModal(MyModalComponent) {
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
          this.shippingData=res.data.shipping;
          console.log('ssssssssssssssssss',this.shippingData);
          
          if(this.shippingData){
            this.userData = this.shippingData;

            this.shippingForm.patchValue({
              first_name: this.userData.first_name,
              last_name: this.userData.last_name,
              email: this.userData.email,
              mobile: this.userData.mobile,
              password: this.userData.password,
              country: this.userData.country,
              state: this.userData.state,
              city: this.userData.city,
              zip_code: this.userData.zip_code,
              address: this.userData.address,
              description: this.userData.description,
              myCheckbox:  new FormControl(true)
            });
            this.shippingForm.get('gender').patchValue(this.userData.detail.gender);
            this.shippingForm.get('country').patchValue(this.userData.country);
            this.shippingForm.get('state').patchValue(this.userData.state);
            this.shippingForm.get('city').patchValue(this.userData.city);
            this.country_iso=this.userData.country;

          }
          else{
      this.getProfile();

          }
          
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


getProfile() {
  this.httpUsersService.getProfile().subscribe((res) => {
    console.log('ddddddd',res);
    this.userData = res.data;

    this.userData = res.data;

    this.shippingForm.patchValue({
      first_name: this.userData.first_name,
      last_name: this.userData.last_name,
      email: this.userData.email,
      mobile: this.userData.mobile,
      gender: this.userData.detail.gender,
      dob: this.userData.detail.dob,
      password: this.userData.password,
      confirmPassword: this.userData.confirmPassword,
      country: this.userData.country,
      state: this.userData.state,
      city: this.userData.city,
      zip_code: this.userData.zip_code
    });
    this.shippingForm.get('gender').patchValue(this.userData.detail.gender);
    this.shippingForm.get('country').patchValue(this.userData.country);
    this.shippingForm.get('state').patchValue(this.userData.state);
    this.shippingForm.get('city').patchValue(this.userData.city);
    this.country_iso=this.userData.country;

  });
}

addShippingData(MyModalComponent,total_price) {
  const data = this.shippingForm.value;

  if (!data.first_name) {
   const message ="Please enter your first name";
    this.toaster.error(message);
    return;
  }
  if (!data.last_name) {
   const message ="Please enter your last name";
    this.toaster.error(message);
    return;
  }

  if (!data.email) {
   const message ="Please enter your email";
    this.toaster.error(message);
    return;
  }
  if (!data.country) {
   const message ="Please enter your country";
    this.toaster.error(message);
    return;
  }
  if (!data.state) {
   const message ="Please enter your state";
    this.toaster.error(message);
    return;
  }
  if (!data.city) {
   const message ="Please enter your city";
    this.toaster.error(message);
    return;
  }
  if (!data.zip_code) {
   const message ="Please enter your zip code";
    this.toaster.error(message);
    return;
  }
  if (!data.mobile) {
   const message ="Please enter your mobile";
    this.toaster.error(message);
    return;
  }
  if (!data.address) {
   const message ="Please enter your address";
    this.toaster.error(message);
    return;
  }
 
   if (!data.myCheckbox) {
    return this.toaster.error("Please accept the terms first!");
  }
  console.log(data.country);
  if(data.country == 'CA'|| data.country == 'US'){

  let body = {
   
    address : data.address,
    city : data.city,
    state : data.state,
    zip_code : data.zip_code,
    country : data.country,
    country_code : data.country_code,
    mobile: data.mobile.internationalNumber.replace(/[^+\d]+/g, ""),
    description:data.description
  };
  this.loading = true;
    this.httpOrderService
      .addShipping(body)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            console.log('----l-s---',resp);
            
            this.toaster.success('Shipping data added Success!!');
            // this.closeModal()
            this.getCart()
            this.refreshAPICart()
          //  this.openModal(MyModalComponent,total_price)
          //  this.router.navigateByUrl(
          //   `/pay`
          // );
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
    }
    else{
      return this.toaster.error("Unfortunately, shipping is not available for this Country at the moment!");
    }
}


changePreferredCountries() {
  this.preferredCountries = [CountryISO.Egypt, CountryISO.Canada];
}

continueToShipping(MyModalComponent,total_price) {
  const data = this.shippingForm.value;

  if (!data.first_name) {
   const message ="Please enter your first name";
    this.toaster.error(message);
    return;
  }
  if (!data.last_name) {
   const message ="Please enter your last name";
    this.toaster.error(message);
    return;
  }

  if (!data.email) {
   const message ="Please enter your email";
    this.toaster.error(message);
    return;
  }
  if (!data.country) {
   const message ="Please enter your country";
    this.toaster.error(message);
    return;
  }
  if (!data.state) {
   const message ="Please enter your state";
    this.toaster.error(message);
    return;
  }
  if (!data.city) {
   const message ="Please enter your city";
    this.toaster.error(message);
    return;
  }
  if (!data.zip_code) {
   const message ="Please enter your zip code";
    this.toaster.error(message);
    return;
  }
  if (!data.mobile) {
   const message ="Please enter your mobile";
    this.toaster.error(message);
    return;
  }
  if (!data.address) {
   const message ="Please enter your address";
    this.toaster.error(message);
    return;
  }
 
   if (!data.myCheckbox) {
    return this.toaster.error("Please accept the terms first!");
  }
  console.log(data.country);
  if(data.country == 'CA'|| data.country == 'US'){

  let body = {
   
    address : data.address,
    city : data.city,
    state : data.state,
    zip_code : data.zip_code,
    country : data.country,
    country_code : data.country_code,
    mobile: data.mobile.internationalNumber.replace(/[^+\d]+/g, ""),
    description:data.description
  };
  this.loading = true;
    this.httpOrderService
      .addShipping(body)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            console.log('----l-s---',resp);
            
            this.toaster.success('Shipping data added Success!!');
            // this.closeModal()
            this.getCart()
            this.refreshAPICart()
          //  this.openModal(MyModalComponent,total_price)
           this.router.navigateByUrl(
            `/pay`
          );
          }
        },
        (err) => {
          this.loading = false;
          this.toaster.error(err.error.message);
        }
      );
    }
    else{
      return this.toaster.error("Unfortunately, shipping is not available for this Country at the moment!");
    }
}

submit() {
  const data = this.shippingForm.value;

  if (!data.card_number) {
    const message ="Please enter your card number";
    this.toaster.error(message);
    return;
  }
  if (!data.expiration_date) {
    const message ="Please enter your expiration date";
     this.toaster.error(message);
     return;
   }
   if (!data.cvv) {
    const message ="Please enter your cvv";
     this.toaster.error(message);
     return;
   }
   if (!data.zip_code) {
    const message ="Please enter your Postal code";
     this.toaster.error(message);
     return;
   }
   const expiration_date = data.expiration_date.split('/');
// const [month, year] = new Date(`${expiration_date}`).toLocaleDateString('en-US', { month: 'numeric', year: 'numeric' }).split('/');
// console.log(month, year); 

    let body = {
      brand_type : 'Visa',
      channel : 'web',
      card_number : data.card_number,
      expiration_date : data.expiration_date,
      zip_code : data.zip_code,
      cvv:data.cvv
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

              this.toaster.success('Payment Success!!');
              localStorage.removeItem('TPFAMO')
              this.closeModal()
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
