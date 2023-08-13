import { Component, OnInit, OnDestroy } from "@angular/core";
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
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

@Component({
  selector: 'app-resetPassword',
  templateUrl: './resetPassword.component.html',
  styleUrls: ['./resetPassword.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  loading: boolean = false;
  userData = {};
  svgWidth: number;
  unsubscribeSignal: Subject<void> = new Subject();
  repsData = {};
  modalRefs: BsModalRef[] = [];

  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private toaster: ToastrService,
    private modalService: BsModalService

  ) {}

  public resetPasswordForm = this.fg.group({
    // oldPassword: ["", Validators.required],
    newPassword: ["", Validators.required],
    newPasswordConfirmation: ["", Validators.required],
  });

  ngOnInit() {
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
  hide: boolean = true;
  myFunction() {
    this.hide = !this.hide;
  }
  refreshComponent() {
    // $('.modal').css("visibility", "hidden")
    // $('.modal-backdrop').css("visibility", "hidden")
    //   this.router.navigateByUrl('/perfumes', { skipLocationChange: true }).then(() => {
    //   this.router.navigate(['/user']);
    // });
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
    this.modalRefs.forEach((modalRef) => modalRef.hide());
        this.modalRefs = [];
        localStorage.setItem('modalStatus','close')
  }
  ngOnDestroy() {
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
  }
  requiredErrorMessage($feild) {
    return this.resetPasswordForm.controls[$feild].hasError("required")
      ? "You must enter a value"
      : "";
  }
  setUserData(respone) {
    this.authService.saveToken(respone.body.data.access_token);
    this.authService.saveUserData(respone.body.data);
    localStorage.setItem("isLogin", "true");
    this.authService.isLogoutSubject.next(true);
  }
  submit() {
    if (!this.resetPasswordForm.controls.newPassword.value) {
      const message =
        "Please Enter Your Password"
      this.toaster.error(message);
      return;
    }
    if (!this.resetPasswordForm.controls.newPasswordConfirmation.value) {
      const message =
       "Please Enter Your Conform Password"
      this.toaster.error(message);
      return;
    }
    if (this.resetPasswordForm.controls.newPassword.value != this.resetPasswordForm.controls.newPasswordConfirmation.value ) {
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
      email:userMobileNumber ,
      password: newPassword,
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
              this.authService.saveUserId(resp.body.data.id);
              localStorage.setItem("muToken",'Bearer '+ resp.body.data.access_token);
              localStorage.setItem("guestToken", resp.body.data.access_token);
              this.setUserData(resp);
              const message =
          "Welcome, you are logged in successfullyd"
            this.toaster.success(message);
           
          
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

  setUserDataToLocalStorage(userData) {
    localStorage.setItem("user", JSON.stringify(userData["id"]));
  }
}
