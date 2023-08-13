import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../../auth/service//auth.service";
import { Subject } from "rxjs";
import * as $ from 'jquery';
import {
  takeUntil,
  take,
  takeLast,
  distinctUntilChanged,
  debounceTime,
  finalize,
  delay,
  share,
} from "rxjs/operators";
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider, VKLoginProvider } from "angularx-social-login";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { HttpCategoryService } from "src/app/shared/services/categories.services";
import { HttpOrderService } from "src/app/shared/services/order.service ";
import { UsersService } from "../../home/services/users.service";

interface Country {
  shortName: string;
  name: string;
}

@Component({
  selector: "app-payment-modal",
  templateUrl: "./payment-modal.component.html",
  styleUrls: ["./payment-modal.component.scss"],
})
 
export class PaymentModalComponent implements OnInit {

  editFile: boolean = true;
  removeUpload: boolean = false;
  paymentForm: FormGroup;
  changeUserMobileForm: FormGroup;
  changeUserPasswordForm: FormGroup;
  activeTabId: string = 'overview';

  modalRef: BsModalRef;
  oneAtATime = true;
  userData: any;
  firstName: any;
  unsubscribeSignal: Subject<void> = new Subject();
  loading: boolean;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue = 3;
  location:any;
  orders: any[] = [];

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
    private modalService: BsModalService,
    public breakpointObserver: BreakpointObserver,
    private fg: FormBuilder,
    private router: Router,
    private httpUsersService: UsersService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private httpCategoryService: HttpCategoryService,
    public authService: AuthService,
    private httpOrderService :HttpOrderService
    ) {
      this.countries = this.authService.getCountries();
    }
    registrationForm = this.fb.group({
      file: [null]
    })  
    ngOnInit() {
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

      this.getProfile();
      // this.refreshComponent()
   
    // this.userData=JSON.parse(localStorage.getItem("userData"))


    // this.firstName=this.userData.split(' ')[0];
    this.paymentForm = this.fg.group({
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
      card_number: ["", Validators.required],
      cvv: ["", Validators.required],
      expiration_date: ["", Validators.required],
      address: ["", Validators.required],
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

  getProfile() {
    this.httpUsersService.getProfile().subscribe((res) => {
      console.log('ddddddd',res);
      
      this.userData = res.data;
      this.paymentForm.patchValue({
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
      this.paymentForm.get('gender').patchValue(this.userData.detail.gender);
      this.paymentForm.get('country').patchValue(this.userData.country);
      this.paymentForm.get('state').patchValue(this.userData.state);
      this.paymentForm.get('city').patchValue(this.userData.city);
    });
  }

  closeModal() {
    this.modalRef.hide();
  }
  refreshAPICart() {
    this.httpCategoryService.refresh();
  }
  changePreferredCountries() {
		this.preferredCountries = [CountryISO.Egypt, CountryISO.Canada];
	}

  submit() {
    const data = this.paymentForm.value;

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
    // if (!data.email) {
    //  const message ="Please enter your email";
    //   this.toaster.error(message);
    //   return;
    // }
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
    // if (!data.mobile) {
    //  const message ="Please enter your mobile";
    //   this.toaster.error(message);
    //   return;
    // }
    if (!data.address) {
     const message ="Please enter your address";
      this.toaster.error(message);
      return;
    }
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
     if (!data.myCheckbox) {
      return this.toaster.error("Please accept the terms first!");
    }
     const expiration_date = data.expiration_date.split('/');
// const [month, year] = new Date(`${expiration_date}`).toLocaleDateString('en-US', { month: 'numeric', year: 'numeric' }).split('/');
// console.log(month, year); 
      let body = {
        brand_type : 'visa',
        channel : 'web',
        address : data.address,
        city : data.city,
        state : data.state,
        zip_code : data.zip_code,
        country : data.country,
        card_number : data.card_number,
        expiration_date : data.expiration_date,
        cvv : data.cvv,
        // expiration_year : expiration_date[1],
        // expiration_month : expiration_date[0],
        
        
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