import { Component, OnInit, OnDestroy, TemplateRef } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpResponse } from "@angular/common/http";
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
import {
  BsModalService,
  BsModalRef,
  ModalOptions,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: "app-forgetpassword",
  templateUrl: "./forgetpassword.component.html",
  styleUrls: ["./forgetpassword.component.scss"],
})
export class ForgetPasswordComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  userData = {};
  svgWidth: number;
  unsubscribeSignal: Subject<void> = new Subject();
  repsData = {};
  separateDialCode = false;
   verifyBYMobile=true;
  modalRef: BsModalRef;
  modalRefs: BsModalRef[] = [];
  TooltipLabel = TooltipLabel;

  SearchCountryField = SearchCountryField;

  CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  country_iso=CountryISO.UnitedStates

  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private toaster: ToastrService,
    private modalService: BsModalService
  ) {}

  public forgetPasswordForm = this.fg.group({
    mobile: [""],
    email: [""],
  });

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
                  $(this).siblings('span.error').text('Please type your mobile number').fadeIn().parent('.form-group').addClass('hasError');
                  usernameError = true;
              } 
              else {
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
  }
  changePreferredCountries() {
		this.preferredCountries = [CountryISO.Egypt, CountryISO.Canada];
	}
  ngOnDestroy() {
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
  }
  // closeModal() {
  //   console.log('modalRefmodalRef');
  //       this.modalRef.hide();
  //   // localStorage.setItem('modalStatus','close')
  // }
  closeModal() {
    this.modalRefs.forEach((modalRef) => modalRef.hide());
    this.modalRefs = [];
    localStorage.setItem('modalStatus','close')
  }
  requiredErrorMessage($feild) {
    return this.forgetPasswordForm.controls[$feild].hasError("required")
      ? "You must enter a value"
      : "";
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
  submit() {
    const data = this.forgetPasswordForm.value
    if(this.verifyBYMobile==true){
    if (!this.forgetPasswordForm.controls.mobile.value) {
      const message = "Please Enter Your Mobile "
      this.toaster.error(message);
      return;
    }
      var mobile = data.mobile.internationalNumber.replace(/[^+\d]+/g, "")
      let userCredentials = {
        mobile: data.mobile.internationalNumber.replace(/[^+\d]+/g, ""),
      };



    this.loading = true;
    if (!this.forgetPasswordForm.invalid) {
      this.authService
        .forgetPassword(userCredentials)
        .pipe(
          takeUntil(this.unsubscribeSignal.asObservable()),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          (resp: HttpResponse<any>) => {
            if (resp.status === 200) {
              this.repsData = resp.body.data;
              this.authService.saveUserPhoneNumber(mobile);
              localStorage.setItem('verifyByEmailAddress','false')

              this.authService.saveUserEmailAddress(resp.body.data.email);
            
              this.toaster.success(resp.body.message);
              setTimeout(() => {
                this.router.navigate(['/auth/verify-code']);
              }, 2000)
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

   else{
      if (!this.forgetPasswordForm.controls.email.value) {
        const message = "Please Enter Your Email "
        this.toaster.error(message);
        return;
      }
      var email = data.email

        const userCredentials = {
          email: data.email
        };
  
  
  
      this.loading = true;
      if (!this.forgetPasswordForm.invalid) {
        this.authService
          .forgetPasswordEmail(userCredentials)
          .pipe(
            takeUntil(this.unsubscribeSignal.asObservable()),
            finalize(() => (this.loading = false))
          )
          .subscribe(
            (resp: HttpResponse<any>) => {
              if (resp.status === 200) {
                this.repsData = resp.body.data;
                this.authService.saveUserEmailAddress(email);
                localStorage.setItem('verifyByEmailAddress','true')
                this.toaster.success(resp.body.message);
                setTimeout(() => {
                  this.router.navigate(['/auth/verify-code']);
                }, 2000)
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

  setUserDataToLocalStorage(userData) {
    localStorage.setItem("user", JSON.stringify(userData["id"]));
  }

  toggleDisplay() {
    this.verifyBYMobile = !this.verifyBYMobile;
  }
}
