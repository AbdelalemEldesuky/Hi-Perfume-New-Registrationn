import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpResponse } from "@angular/common/http";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "../service/auth.service";
import { Subject } from "rxjs";
import * as $ from 'jquery';

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
  Renderer2,
  TemplateRef,
  OnDestroy,
  DoCheck,
  ChangeDetectorRef
} from "@angular/core";
import {
  BsModalService,
  BsModalRef,
  ModalOptions,
  ModalDirective,
} from "ngx-bootstrap/modal";

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
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider, VKLoginProvider } from "angularx-social-login";

declare var google: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})


export class LoginComponent implements OnInit, OnDestroy ,DoCheck,AfterViewInit{
  @ViewChild("rate", { static: true }) rate: TemplateRef<any>;
  @ViewChild("template", { static: true }) template: TemplateRef<any>;
  @ViewChild("modalone", { static: false }) public modalone: ModalDirective;
  isShow = true;
  modalRef: BsModalRef;
  hide: boolean = true;

  loading: boolean = false;
  userData = {};
  svgWidth: number;
  unsubscribeSignal: Subject<void> = new Subject();
  repsData = {};
  modalRefs: BsModalRef[] = [];
  userGoogleInfo:any;

  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private toaster: ToastrService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef,
    private _authService: SocialAuthService

  ) {}

  public loginForm = this.fg.group({
    email: ["", Validators.required],
    password: ["", Validators.required],
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
    this.isShow = true;
  }
  // refreshComponent() {
  //   $('.modal-backdrop').hide();
  //   $('.modal').hide();
  //   this.router.navigateByUrl('/perfumes', { skipLocationChange: true }).then(() => {
  //     this.router.navigate(['/user']);
  //   });
  // }
  ngOnDestroy() {
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
    console.log('logiiiiiiiiin');
    
  }
  ngDoCheck(): void {
    // const modalStatus = localStorage.getItem('modalStatus')
    // if(modalStatus=='close'){
    //  this.modalRef.hide();
    // localStorage.setItem('modalStatus','open')
    // }
   }
  requiredErrorMessage($feild) {
    return this.loginForm.controls[$feild].hasError("required")
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
                localStorage.setItem('userIsVerfied','false')
              }
              else{
                localStorage.setItem('userIsVerfied','true')
              }
              this.closeModal();
             window.location.reload();
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

  myFunction() {
    this.hide = !this.hide;
  }
  setUserDataToLocalStorage(userData) {
    localStorage.setItem("user", JSON.stringify(userData["id"]));
  }

    // openModal(template: TemplateRef<any>, id) {
      // openModal(template: TemplateRef<any>) {
      //   this.modalRef = this.modalService.show(template);
      // }
      openModal(MyModalComponent) {
        const config = {
          ignoreBackdropClick: true
        };
        $('.modal').css("visibility", "hidden")
    $('.modal-backdrop').css("visibility", "hidden")
    $('.modal-backdrop').css("visibility", "visible")
    $('.modal').css("visibility", "visible")
        this.modalRef = this.modalService.show(MyModalComponent,config);
        this.modalRefs.push(this.modalRef);
       localStorage.setItem('modalStatus','close')
      }
      toggleDisplay() {
        this.isShow = !this.isShow;
      }
      closeModal() {
        this.modalRefs.forEach((modalRef) => modalRef.hide());
        this.modalRefs = [];
        localStorage.setItem('modalStatus','close')
      }

      ngAfterViewInit(): void {
        google.accounts.id.initialize({
          client_id: "668553267026-s5k194p274820a6m7sfoj097qe5ljoes.apps.googleusercontent.com",
          callback: (response: any) => this.handleGoogleSignIn(response)
        });
        google.accounts.id.renderButton(
          document.getElementById("buttonDiv"),
          { size: "large", type: "icon", shape: "pill" }  // customization attributes
        );
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
        };
        this.loading = true;
        console.log('bbbbbbbbbb');
        this.authService
            .registerSocialiteLlogin(userCredentials)
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
              if(resp.body.data.mobile){
                this.authService.saveUserPhoneNumber(resp.body.data.mobile);
              }
              const is_activated =resp.body.data.detail.is_activated
              console.log('00000--',is_activated);
              
              if(is_activated=='no'){
                localStorage.setItem('userIsVerfied','false')
              }
              else{
                localStorage.setItem('userIsVerfied','true')
              }
                                this.closeModal();
                 window.location.reload();
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
      // closeModal() {
      //   this.modalRef.hide()
      //   localStorage.setItem('modalStatus','close')
        
      //   // const modalsCount = this.modalService.getModalsCount();
      //   // for (let i = 0; i < modalsCount; i++) {
      //   //   const modalRef = this.modalService.getModals()[i];
      //   //   modalRef.hide();
      //   // }
      // }
      // closeModal() {
      //   const modalsStack = this.modalService.getModalsStack();
      //   modalsStack.forEach(modalRef => modalRef.hide());
      // }
}
