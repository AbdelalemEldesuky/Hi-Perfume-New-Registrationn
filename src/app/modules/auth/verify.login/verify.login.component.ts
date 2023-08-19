import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnChanges,
  DoCheck,
} from "@angular/core";
import { HttpHeaders, HttpResponse } from "@angular/common/http";
import { Validators, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../service/auth.service";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";
import * as $ from 'jquery';
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: "app-verify-login",
  templateUrl: "./verify.login.component.html",
  styleUrls: ["./verify.login.component.scss"],
})
export class VerifyLoginComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges, DoCheck
{
  counter = 60;
  loading: boolean = false;
  loadingResend: boolean = false;
  userData = {};
  phone: any = "";
  email: any = "";
  value;
  unsubscribeSignal: Subject<void> = new Subject();
  widthNum = 0;
  width = "";
  modalRefs: BsModalRef[] = [];
  interval;
  resend = false;
  btnDisable = false;
  lastPage = "";
  date = new Date("2019-01-26T00:00:00");
  date2 = new Date("2022-01-26T00:00:00");
  verifyByEmailAddress:any

  constructor(
    private fg: FormBuilder,
    private fc: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private toaster: ToastrService,
    private modalService: BsModalService

  ) {}

  public verifyCodeForm = this.fg.group({
    code: ["", Validators.required],
  });
  public resetPasswordForm = this.fg.group({
    // oldPassword: ["", Validators.required],
    newPassword: ["", Validators.required],
    newPasswordConfirmation: ["", Validators.required],
  });
  ngOnChanges() {}
  ngDoCheck() {}

  ngOnInit() {
    this.verifyByEmailAddress =  localStorage.getItem('verifyByEmailAddress')
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
                  $(this).siblings('span.error').text('Please type verification code').fadeIn().parent('.form-group').addClass('hasError');
                  usernameError = true;
              } 
              else {
                $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
                usernameError = false;
            }
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


    // this.verifyCodeForm.controls.mobile.setValue(
    //   localStorage.getItem("mobile_token")
    // );
    this.lastPage = localStorage.getItem("lastPage");
    this.resend = true;
    this.phone =localStorage.getItem("userPhoneNumber")
    this.email =localStorage.getItem("userEmailAddress")
  }
  startSpinner() {
    this.resend = true;
    let text = document.getElementById("counter").innerHTML;
    document.getElementById("counter").innerHTML = text.replace("0d 0h", "");
    let text2 = document.getElementById("counter").innerHTML;
    document.getElementById("counter").innerHTML = text2.replace("m", " :");
    let text3 = document.getElementById("counter").innerHTML;
    document.getElementById("counter").innerHTML = text3.replace("s", "");
    this.width = String(this.widthNum) + "%";
    this.widthNum += 3.4;
    console.log('sssssssss',this.widthNum);
    if(this.widthNum==108.80000000000005 || this.widthNum==105.40000000000005){
      this.resend = false;
    }
  }

  ngAfterViewInit() {}
  triggerFunction() {
    console.log("Timer Ended");
  }
  mySpinner() {}

  requiredErrorMessage($feild) {
    return this.verifyCodeForm.controls[$feild].hasError("required")
      ? "You must enter a value"
      : "";
  }

  resendCode() {
    this.resend = true;

    this.verifyCodeForm.controls.code.setValue("");
    let userMobileNumber = this.authService.getUserPhoneNumber();
    console.log('userMobileNumber--',userMobileNumber);
    
    let userCredentials = {
      mobile: userMobileNumber,
    };

    if (!this.loadingResend) {
      this.loadingResend = true;
      this.authService
        .sendOTP(userCredentials)
        .pipe(takeUntil(this.unsubscribeSignal.asObservable()))
        .subscribe(
          (resp: HttpResponse<any>) => {
            if (resp.status === 200) {
              this.btnDisable = true;
              this.ngOnInit()
              this.widthNum = 0;
              const message =
              "The code has been sent successfully"
              this.toaster.success(message);
              // this.verifyCodeForm.controls.phone.setValue(
              //   resp.body.data.mobile
              // );
              this.startSpinner()
              // this.authService.saveUserId(resp.body.data.id);
              // localStorage.setItem("mobile_token", resp.body.data.mobile);
              this.loadingResend = false;
            }
          },
          (err) => {
            this.loadingResend = false;
            this.toastr.error(err.error.message);
          }
        );
    }
  }
  openModal(MyModalComponent) {
    const config = {
      ignoreBackdropClick: true
    };
    $('.modal').css("visibility", "hidden")
    $('.modal-backdrop').css("visibility", "hidden")
    $('.modal-backdrop').css("visibility", "visible")
    $('.modal').css("visibility", "visible")
            const modalRef = this.modalService.show(MyModalComponent,config);
        this.modalRefs.push(modalRef);
       localStorage.setItem('modalStatus','close')
  }
  closeModal() {
    console.log('modalRefs',this.modalRefs);
    this.modalRefs[0].hide();
    
    // this.modalRefs.forEach((modalRef) => modalRef.hide());
    // this.modalRefs = [];
    // localStorage.setItem('modalStatus','close')
  }
  verifyCode() {
    const data = {
      mobile_token: this.verifyCodeForm.controls.mobile.value, //localStorage.getItem("mobile_token"),
      userId: localStorage.getItem("userId"),
    };
    if (!data.mobile_token)
      return this.toastr.error("Please make you entered valid code");
    this.isValidCode(data);
  }

  isValidCode(data) {
    if (!this.verifyCodeForm.controls.code.value) {
      const message = "Please Enter Verification Code";
                this.toaster.error(message);
      return;
    }
    const code = this.verifyCodeForm.controls.code.value;
    this.loading = true;
    const userData = {
      emailOrPhone: localStorage.getItem("userPhoneNumber"),
      code: code,
    };
    this.authService
      .varifyCode(userData)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp) => {
          if (resp.status === 200) {
            const message = "The account has been successfully verified";
            this.toaster.success(message);

            this.setUserData(resp);
            // this.router.navigate([`/${localStorage.getItem('LOCALIZE_DEFAULT_LANGUAGE')}`]);
            setTimeout(() => {
              const rALOR = localStorage.getItem("RALOR")
                ? localStorage.getItem("RALOR")
                : "";
              this.router.navigate([
                `/${rALOR}`,
              ]);
              if (rALOR) localStorage.removeItem("RALOR");
              window.location.reload();
            }, 500);
          }
        },
        (err) => {
          this.toastr.error(err.error.message);
        }
      );
  }

  isValidCodeForgetPassword2() {
    if (!this.verifyCodeForm.controls.code.value) {
      const message =
      "Please Enter Verification Code"
      this.toaster.error(message);
      return;
    }
   
    const code = this.verifyCodeForm.controls.code.value;
    this.loading = true;
    
    if(this.verifyByEmailAddress=='false'){
      var userData = {
        code: code,
        mobile: localStorage.getItem("userPhoneNumber"),
      };
      this.authService
      .varifyCode(userData)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp) => {
          if (resp.status === 200) {
             const message =
              "Welcome, you are signed in successfullyd";
              this.toaster.success(message);
              this.authService.saveUserId(resp.body.data.id);
              localStorage.setItem("muToken",'Bearer '+ resp.body.data.access_token);
              localStorage.setItem("guestToken", resp.body.data.access_token);
              localStorage.removeItem('userCredentials')
              localStorage.setItem('userIsVerfied','true')
              $('.signup').addClass('switched')
              $('.login').removeClass('switched')
              // location.href = '/';
              // this.closeModal()
            //  this.refreshComponent()
          }
        },
        (err) => {
          console.log('090000000',err);
          
          this.toastr.error(err.error.message);
        }
      );
    }
    else{
      var userData2 = {
        code: code,
        email: localStorage.getItem("verifyByEmailAddress"),
      };
      this.authService
      .varifyCode(userData2)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp) => {
          if (resp.status === 200) {
             const message =
              "Welcome, you are signed in successfullyd";
              this.toaster.success(message);
              this.authService.saveUserId(resp.body.data.id);
              localStorage.setItem("muToken",'Bearer '+ resp.body.data.access_token);
              localStorage.setItem("guestToken", resp.body.data.access_token);
              localStorage.removeItem('userCredentials')
              localStorage.setItem('userIsVerfied','true')
              $('.signup').addClass('switched')
              $('.login').removeClass('switched')
              // location.href = '/';
              // this.closeModal()
            //  this.refreshComponent()
          }
        },
        (err) => {
          console.log('090000000',err);
          
          this.toastr.error(err.error.message);
        }
      );
    }

  }

  isValidCodeForNewPhone() {
    if (!this.verifyCodeForm.controls.code.value) {
      const message ="Please Enter Verification Code";
      this.toaster.error(message);
      return;
    }
    const code = this.verifyCodeForm.controls.code.value;
    this.loading = true;
    const body = {
      code: code,
    };
    this.authService
      .varifyNewPhone(body)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (resp) => {
          if (resp.status === 200) {
            const message = "The account has been successfully verified"
            this.toaster.success(message);

            this.setUserData(resp);
            localStorage.removeItem("lastPage");
            this.authService.logout();
            this.router.navigate([
              `/auth/login`,
            ]);
          }
        },
        (err) => {
          this.toastr.error(err.error.message);
        }
      );
  }

  setUserData(respone) {
    this.authService.saveToken(respone.body.data.access_token);
    this.authService.saveUserData(respone.body.data);
    localStorage.setItem("isLogin", "true");
    localStorage.setItem("userPhoneNumber", respone.body.data.mobile);
    this.authService.isLogoutSubject.next(true);
  }

  ngOnDestroy() {
    const userIsVerfied =  localStorage.getItem('userIsVerfied')
    if(localStorage.getItem("isLoginNovirfy")==="true"){
    if( userIsVerfied == 'false'  ||!localStorage.getItem('userIsVerfied') ){
      const message =
      "Welcome, you are signed in successfullyd";
      const message2 = "But you must verify your account to be able to continue"
      this.toaster.success(message);
      this.toaster.error(message2);
      localStorage.setItem('userIsVerfied','false')
      localStorage.removeItem("isLoginNovirfy")
      window.location.reload();
    }
  }
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
  }


  submit() {
    const data = this.resetPasswordForm.value;

    if (!data.newPassword) {
      const message =
        "Please Enter Your Password"
      this.toaster.error(message);
      return;
    }
    if (!data.newPasswordConfirmation) {
      const message =
       "Please Enter Your Conform Password"
      this.toaster.error(message);
      return;
    }
    if (data.newPassword != data.newPasswordConfirmation ) {
      const message =
   "Please Conform Password"
      this.toaster.error(message);
      return;
    }

    const newPassword = String(this.resetPasswordForm.controls.newPassword.value);
    const newPasswordConfirmation = String(this.resetPasswordForm.controls.newPasswordConfirmation.value);   
    let userMobileNumber = this.authService.getUserPhoneNumber();

     let userCredentials = {
      // oldPassword:"123456",
      password: newPassword,
      password_confirmation:newPasswordConfirmation ,
    };
    this.loading = true;
    if (!this.resetPasswordForm.invalid) {
      this.authService
        .changePassword(userCredentials)
        .pipe(
          takeUntil(this.unsubscribeSignal.asObservable()),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          (resp: HttpResponse<any>) => {
            if (resp.status === 200) {
              this.authService.saveUserPhoneNumber(userMobileNumber);
              this.authService.saveUserPhoneNumber(resp.body.data.mobile);

              this.authService.saveUserId(resp.body.data.id);
              localStorage.setItem("muToken",'Bearer '+ resp.body.data.access_token);
              localStorage.setItem("guestToken", resp.body.data.access_token);
              this.setUserData(resp);
              const message =
          "Welcome, you are logged in successfullyd"
            this.toaster.success(message);
            localStorage.setItem('userIsVerfied','true')
            location.href = '/';

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
