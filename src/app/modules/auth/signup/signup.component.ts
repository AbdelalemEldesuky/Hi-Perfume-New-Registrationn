import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, AfterViewInit, ElementRef } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../service/auth.service";
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

interface Country {
  shortName: string;
  name: string;
}
declare var google: any;

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit, OnDestroy,AfterViewInit {
  @ViewChild("template", { static: true }) template: TemplateRef<any>;
  @ViewChild('agreeTemplate', { static: false }) agreeTemplate: ElementRef;


  loading: boolean = false;
  userData = {};
  svgWidth: number;
  unsubscribeSignal: Subject<void> = new Subject();
  repsData = {};
  // modalRef: BsModalRef;
  modalRefs: BsModalRef[] = [];
  //  google:any;
  agreeTemplateVar:any
  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  countries: Country[];
  states: string[];
  cities: string[];
  userCredentialsData:any;
  country_iso=CountryISO.UnitedStates
  need_login=false;
  userGoogleInfo:any;
  country = new FormControl(null, [Validators.required]);
  state = new FormControl({ value: null, disabled: true }, [
    Validators.required,
  ]);
  city = new FormControl({ value: null, disabled: true }, [
    Validators.required,
  ]);
  privactPolicy:any
  isLoggedIn = localStorage.getItem("isLogin");

  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private toaster: ToastrService,
    private modalService: BsModalService,
    private _authService: SocialAuthService,
    private httpCategoryService: HttpCategoryService,

  ) {
    this.countries = this.authService.getCountries();
  }

  public signupForm = this.fg.group({
    first_name: ["", Validators.required],
    last_name: ["", Validators.required],
    phone: ["", Validators.required],
    email: ["", Validators.required],
    password: ["", Validators.required],
    confirmPassword: ["", Validators.required],
    // country: this.country,
    // state: this.state,
    // city: this.city,
    // zip_code: this.city,
    myCheckbox1: new FormControl(false),
    myCheckbox2: new FormControl(false),
  });

  agreementsForm = new FormGroup({
    myCheckbox1: new FormControl(false),
    myCheckbox2: new FormControl(false),
  });
  public loginForm = this.fg.group({
    email: ["", Validators.required],
    password: ["", Validators.required],
  });
  ngOnInit() {
    if(this.isLoggedIn=='true'){
      return this.router.navigateByUrl(`/`);
    }

    if(localStorage.getItem('need_login')=='true'){
      this.need_login=true;
      $('.signup').addClass('switched')
      $('.login').removeClass('switched')
      localStorage.removeItem('need_login')
    }


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
              if ($(this).val().length < 6) {
                  $(this).siblings('span.error').text('Please type at least 6 charcters').fadeIn().parent('.form-group').addClass('hasError');
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
      // $('form.signup-form').submit(function (event) {
      //     event.preventDefault();
  
      //     if (usernameError == true || emailError == true || passwordError == true || passConfirm == true) {
      //         $('.name, .email, .pass, .passConfirm').blur();
      //     } else {
      //         $('.signup, .login').addClass('switched');
  
      //         setTimeout(function () { $('.signup, .login').hide(); }, 700);
      //         setTimeout(function () { $('.brand').addClass('active'); }, 300);
      //         setTimeout(function () { $('.heading').addClass('active'); }, 600);
      //         setTimeout(function () { $('.success-msg p').addClass('active'); }, 900);
      //         setTimeout(function () { $('.success-msg a').addClass('active'); }, 1050);
      //         setTimeout(function () { $('.form').hide(); }, 700);
      //     }
      // });
  
      // Reload page
      $('a.profile').on('click', function () {
          location.reload();
      });
  
  
  });

    this.getPrivacyPolicyFromApi()
    localStorage.setItem('agree','false');
    console.log('------******-------------');
  
    this.breakpointObserver
      .observe(["(min-width: 600px)"])
      .pipe(takeUntil(this.unsubscribeSignal.asObservable()))
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.svgWidth = 90;
        } else {
          this.svgWidth = 50;
        }
      });

      this.country.valueChanges.subscribe((country) => {
        this.state.reset();
        this.state.disable();
        if (country) {
          this.states = this.authService.getStatesByCountry(country);
          this.state.enable();
        }
      });
  
      this.state.valueChanges.subscribe((state) => {
        this.city.reset();
        this.city.disable();
        if (state) {
          this.cities = this.authService.getCitiesByState(this.country.value, state);
          this.city.enable();
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
    // localStorage.setItem('agree','false');{
    //   const message =
    //   "You must first agree to the privacy policy";
    //   this.toaster.error(message);
    // }
  }

  logOut() {
    this.authService.logout();
    window.location.reload();
  }
  hide: boolean = true;
  myFunction() {
    this.hide = !this.hide;
  }
  openModal(MyModalComponent) {
    const config = {
      ignoreBackdropClick: true
    };
    this.getPrivacyPolicyFromApi()

    $('.modal').css("visibility", "hidden")
    $('.modal-backdrop').css("visibility", "hidden")
    $('.modal-backdrop').css("visibility", "visible")
    $('.modal').css("visibility", "visible")
        const modalRef = this.modalService.show(MyModalComponent,config);
    this.modalRefs.push(modalRef);
   localStorage.setItem('modalStatus','close')
  }

  openModalAgreements(agreeTemplate) {
    const config = {
      ignoreBackdropClick: true
    };
        const modalRef = this.modalService.show(agreeTemplate,config);
    this.modalRefs.push(modalRef);
  }
  closeModal() {
    console.log('modalRefs',this.modalRefs);
    this.modalRefs[0].hide();
    
    // this.modalRefs.forEach((modalRef) => modalRef.hide());
    // this.modalRefs = [];
    // localStorage.setItem('modalStatus','close')
  }
  setUserData(respone) {
    this.authService.saveToken(respone.body.data.access_token);
    this.authService.saveUserData(respone.body.data);
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("userPhoneNumber", respone.body.data.mobile);
    this.authService.isLogoutSubject.next(true);
  }
  requiredErrorMessage($feild) {
    return this.signupForm.controls[$feild].hasError("required")
      ? "You must enter a value"
      : "";
  }
  // closeModal() {
  //  localStorage.setItem('modalStatus','close')
  // }
  submitSignUp() { 
    const data = this.signupForm.value;
    console.log('sssss',data);

    if (!data.first_name ) {
      return this.toaster.error("Please Enter Your First Name");
    }
    if (!data.last_name ) {
      return this.toaster.error("Please Enter Your Last Name");
    }
    if (!data.email ) {
      return this.toaster.error("Please Enter Your Email");
    }
    if (!data.phone ) {
      return this.toaster.error("Please Enter Your Mobile");
    }
    if (data.password !== data.confirmPassword ) {
      const message =
       "password and confirm password doesn't match";
      return this.toaster.error(message);
    }
    if (!data.myCheckbox1 ) {
      return this.toaster.error("Please accept the terms first!");
    }
    if (!data.myCheckbox2 ) {
      return this.toaster.error("Please accept the terms first!");
    }
    let userCredentials = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      city: data.city,
      country: data.country,
      zip_code: data.zip_code,
      country_code: data.state,
      mobile: data.phone.internationalNumber.replace(/[^+\d]+/g, ""),
      password: data.password,
      confirmPassword: data.confirmPassword,
      partner_id : localStorage.getItem('partnerId')? localStorage.getItem('partnerId'):""
    };
    this.loading = true;
    if (!this.signupForm.invalid) {
      this.userCredentialsData=JSON.stringify(userCredentials)
    localStorage.setItem('userCredentials', this.userCredentialsData)
    // if(localStorage.getItem('agree')==='false'){
    //   this.openModalAgreements(this.agreeTemplate);
    // }  
    //    else{
        this.authService
        .register(userCredentials)
        .pipe(
          takeUntil(this.unsubscribeSignal.asObservable()),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          (resp: HttpResponse<any>) => {
            if (resp.status === 200) {
              localStorage.setItem("lastPage","registeration")
              this.repsData = resp.body.data;
              localStorage.setItem("muToken", 'Bearer '+resp.body.data.access_token);
              this.setUserData(resp);
              this.authService.saveUserId(resp.body.data.id);
              this.authService.saveUserData( resp.body.data);
              const is_activated =resp.body.data.detail.is_activated
              if(is_activated=='no'){
                localStorage.setItem('userIsVerfied','false')
                localStorage.setItem("isLoginNovirfy",'true')
                this.router.navigate(['/auth/verify']);
              }
              else{
                localStorage.setItem('userIsVerfied','true')
                location.href = '/';
            //  window.location.reload();
              }
              // this.openModalAgreements(verfyOTPTemplate);
            //   const message =
            //   "Welcome, you are signed in successfullyd";
            //   this.toaster.success(message);
            //   localStorage.removeItem('userCredentials')
            //   this.closeModal()
            //  this.refreshComponent()
            //     window.location.reload();

            }
          },
          (err) => {
            this.loading = false;
            console.log(err);
            this.toaster.error(err.error.message);
            // this.notifcationService.errorNotification(err.error.message);
          }
        );
      //  }
    }
  }

  setUserDataToLocalStorage(userData) {
    localStorage.setItem("user", JSON.stringify(userData["id"]));
  }
  refreshComponent() {
    localStorage.setItem('modalStatus','close')
    this.router.navigateByUrl('/perfumes', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/']);
    });
  }

  changePreferredCountries() {
		this.preferredCountries = [CountryISO.Egypt, CountryISO.Canada];
	}
  ngAfterViewInit(): void {
    google.accounts.id.initialize({
      // client_id: "668553267026-s5k194p274820a6m7sfoj097qe5ljoes.apps.googleusercontent.com",
      client_id: "537594911128-4va32fn26q9u462ei8o0dcth7133lcgs.apps.googleusercontent.com",
      callback: (response: any) => this.handleGoogleSignIn(response)
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { size: "large", type: "icon", shape: "pill" }  
    );
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv2"),
      { size: "large", type: "icon", shape: "pill" }  
    );
    console.log('aaaaaaaaaaaaaaaaaaa');
    
  }

  handleGoogleSignIn(response: any) {

    console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');

    console.log(response.credential);
    // This next is for decoding the idToken to an object if you want to see the details.
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    console.log(JSON.parse(jsonPayload));
    this.userGoogleInfo = JSON.parse(jsonPayload)
    this.registerSocialiteLlogin()
  }
  signInWithGoogle(): void {
    google.accounts.id.initialize({
      client_id: "668553267026-s5k194p274820a6m7sfoj097qe5ljoes.apps.googleusercontent.com",
      callback: (response: any) => this.handleGoogleSignIn(response)
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { size: "large", type: "icon", shape: "pill" }  // customization attributes
    );

    google.accounts.id.renderButton(
      document.getElementById("buttonDiv2"),
      { size: "large", type: "icon", shape: "pill" }  // customization attributes
    );
    
    
  }

  signInWithFB(): void {
    this._authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signInWithVK(): void {
    this._authService.signIn(VKLoginProvider.PROVIDER_ID);
  }
  // googleLoginOptions = {
  //   scope: 'profile email'
  // };
  // signInWithGoogle(): void {
  //   this._authService.signIn(GoogleLoginProvider.PROVIDER_ID, this.googleLoginOptions ).then((data) => {
  //     console.log(data);
  //   }).catch(data => {
  //     this._authService.signOut();
  //     this.router.navigate(['/user']);
  //   });
  // }
  getPrivacyPolicyFromApi() {
    this.httpCategoryService
      .getPrivacyPolicyFromApi()
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          console.log('privactPolicy',this.privactPolicy);
          this.privactPolicy = data.body.data.value;        
            
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
}

  acceptAgreements(){
    const data = this.agreementsForm.value;
    console.log('agreementsForm',data);
    if (!data.myCheckbox1 ) {
      return this.toaster.error("Please accept the terms first!");
    }
    if (!data.myCheckbox2 ) {
      return this.toaster.error("Please accept the terms first!");
    }

    if(this.userGoogleInfo){
    localStorage.setItem('agree','true');
    this.modalRefs.forEach((modalRef) => modalRef.hide());
    this.modalRefs = [];
    this.authService
    .registerSocialiteLlogin(localStorage.getItem('userCredentials'))
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable()),
      finalize(() => (this.loading = false))
    )
    .subscribe(
      (resp: HttpResponse<any>) => {
        if (resp.status === 200) {
          localStorage.setItem("lastPage","registeration")
          this.repsData = resp.body.data;
          localStorage.setItem("muToken", 'Bearer '+resp.body.data.access_token);
          this.setUserData(resp);
          this.authService.saveUserId(resp.body.data.id);
          this.authService.saveUserData( resp.body.data);
          const message =
          "Welcome, you are signed in successfullyd";
          this.toaster.success(message);
          localStorage.removeItem('userCredentials')
          this.closeModal()
         this.refreshComponent()
            window.location.reload();
        }
      },
      (err) => {
        this.loading = false;
        console.log(err);
        this.toaster.error(err.error.message);
        // this.notifcationService.errorNotification(err.error.message);
      }
    );
    }
    else{
      this.authService
      .register(localStorage.getItem('userCredentials'))
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            localStorage.setItem("lastPage","registeration")
            this.repsData = resp.body.data;
            localStorage.setItem("muToken", 'Bearer '+resp.body.data.access_token);
            this.setUserData(resp);
            this.authService.saveUserId(resp.body.data.id);
            this.authService.saveUserData( resp.body.data);
            this.authService.saveUserPhoneNumber(resp.body.data.mobile);

            const message =
            "Welcome, you are signed in successfullyd";
            localStorage.removeItem('userCredentials')
            this.toaster.success(message);
            this.closeModal()
           this.refreshComponent()
              window.location.reload();

          }
        },
        (err) => {
          this.loading = false;
          console.log(err);
          this.toaster.error(err.error.message);
          // this.notifcationService.errorNotification(err.error.message);
        }
      );
    }

  }

  registerSocialiteLlogin(){
    if(this.userGoogleInfo){
    // const provider_id_local  = localStorage.getItem('provider_id')
      const provider_id =localStorage.getItem('provider_id')?localStorage.getItem('provider_id'):""
    const provider_name ='google'
    const first_name = this.userGoogleInfo.given_name
    const last_name = this.userGoogleInfo.family_name
    const email = this.userGoogleInfo.email
    let userCredentials = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      provider_name: provider_name,
      provider_id: this.userGoogleInfo.aud,
      partner_id : localStorage.getItem('partnerId')? localStorage.getItem('partnerId'):""
    };
    this.userCredentialsData=JSON.stringify((userCredentials))
    this.loading = true;
    localStorage.setItem('userCredentials', this.userCredentialsData)
    // if(localStorage.getItem('agree')==='false'){
    //   this.openModalAgreements(this.agreeTemplate);
    // }
    // else{
      this.authService
          .registerSocialiteLlogin(userCredentials)
          .pipe(
            takeUntil(this.unsubscribeSignal.asObservable()),
            finalize(() => (this.loading = false))
          )
          .subscribe(
            (resp: HttpResponse<any>) => {
              if (resp.status === 200) {
                this.repsData = resp.body.data;
            localStorage.setItem("muToken", 'Bearer '+resp.body.data.access_token);
            this.setUserData(resp);
            this.authService.saveUserId(resp.body.data.id);
            this.authService.saveUserData( resp.body.data);
            if(resp.body.data.mobile){
              this.authService.saveUserPhoneNumber(resp.body.data.mobile);
            }
            const message =
            "Welcome, you are signed in successfullyd";
            localStorage.removeItem('userCredentials')
            this.toaster.success(message);
            // this.closeModal()
           this.refreshComponent()
              window.location.reload();
              }
            },
            (err) => {
              this.loading = false;
              console.log(err);
              this.toaster.error(err.error.message);
              // this.notifcationService.errorNotification(err.error.message);
            }
          );
   
    // }
    
    }
}

submitLogin() {
  if (!this.loginForm.controls.email.value) {
    const message ="Please Enter Your Email";
    this.toaster.error(message);
    return;
  }
  if (!this.loginForm.controls.password.value) {
    const message = "Please Enter You Password";
    this.toaster.error(message);
    return;
  }

  const email = String(this.loginForm.controls.email.value);
  const password = String(this.loginForm.controls.password.value);
  let userCredentials = {
    email: email,
    password: password,
  };
  this.loading = true;
  if (!this.loginForm.invalid) {
    this.authService
      .login(userCredentials)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp: HttpResponse<any>) => {
          if (resp.status === 200) {
            this.repsData = resp.body;
            this.authService.saveUserId(resp.body.data.id);
            localStorage.setItem("muToken",'Bearer '+ resp.body.data.access_token);
            localStorage.setItem("guestToken", resp.body.data.access_token);
            this.setUserData(resp);
            const message ="Welcome, you are logged in successfullyd";
            this.toaster.success(message);
            this.authService.saveUserPhoneNumber(resp.body.data.mobile);
            const is_activated =resp.body.data.detail.is_activated
            console.log('00000--',is_activated);
            
            if(is_activated=='no'){
              localStorage.setItem('userIsVerfied','false');
             this.router.navigate(['/auth/verify']);
            }
            else{
              localStorage.setItem('userIsVerfied','true')
              //  window.location.reload();      
              location.href = '/';
            }
            // this.router.navigate([
            //   `/`,
            // ]);
            // this.refreshComponent()
          }
        },
        (err) => {
          this.loading = false;
          console.log(err);
          this.toaster.error(err.error.message);
          // this.notifcationService.errorNotification(err.error.message);
        }
      );
  }
}


}
