import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpResponse } from "@angular/common/http";
import { BreakpointObserver, BreakpointState } from "@angular/cdk/layout";
import { ToastrService } from "ngx-toastr";
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
import { AuthService } from "src/app/modules/auth/service/auth.service";
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: "app-become-ppartners",
  templateUrl: "./become-ppartners.component.html",
  styleUrls: ["./become-ppartners.component.scss"],
})


export class BecomePartnersComponent implements OnInit, OnDestroy ,DoCheck{
  @ViewChild("rate", { static: true }) rate: TemplateRef<any>;
  @ViewChild("template", { static: true }) template: TemplateRef<any>;
  @ViewChild("modalone", { static: false }) public modalone: ModalDirective;
  isShow = true;
  modalRef: BsModalRef;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  country_iso=CountryISO.UnitedStates
  loading: boolean = false;
  userData = {};
  svgWidth: number;
  unsubscribeSignal: Subject<void> = new Subject();
  repsData = {};
  separateDialCode = false;

  constructor(
    private fg: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public breakpointObserver: BreakpointObserver,
    private toaster: ToastrService,
    private modalService: BsModalService,
    private cdr: ChangeDetectorRef
  ) {}

  public becomePartnersForm = this.fg.group({
    name: ["", Validators.required],
    email: ["", Validators.required],
    mobile: ["", Validators.required],
    message: ["", Validators.required],
    region: ["", Validators.required],
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
  refreshComponent() {
    // $('.modal-backdrop').hide();
    // $('.modal').hide();
    $('.modal-backdrop').css("visibility", "visible")

    this.router.navigateByUrl('/perfumes', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/user']);
    });
  }
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
    return this.becomePartnersForm.controls[$feild].hasError("required")
      ? "You must enter a value"
      : "";
  }
  setUserData(respone) {
    this.authService.saveToken(respone.body.data.access_token);
    this.authService.saveUserData(respone.body.data);
    localStorage.setItem("isLogin", "true");
    this.authService.isLogoutSubject.next(true);
  }
  changePreferredCountries() {
		this.preferredCountries = [CountryISO.Egypt, CountryISO.Canada];
	}
  submit() {
    if (!this.becomePartnersForm.controls.email.value) {
      const message ="Please Enter Your Email";
      this.toaster.error(message);
      return;
    }
    if (!this.becomePartnersForm.controls.name.value) {
      const message = "Please Enter Your Name";
      this.toaster.error(message);
      return;
    }
    if (!this.becomePartnersForm.controls.message.value) {
      const message = "Please Enter Your Message";
      this.toaster.error(message);
      return;
    }
    if (!this.becomePartnersForm.controls.mobile.value) {
      const message = "Please Enter Your Mobile";
      this.toaster.error(message);
      return;
    }

    const email = String(this.becomePartnersForm.controls.email.value);
    const name = String(this.becomePartnersForm.controls.name.value);
    const message = String(this.becomePartnersForm.controls.message.value);
    // const mobile = String(this.becomePartnersForm.controls.mobile.value);
    const region = String(this.becomePartnersForm.controls.region.value);
    const mobile = this.becomePartnersForm.value.mobile.internationalNumber.replace(/[^+\d]+/g, "");

    let userCredentials = {
      email: email,
      name: name,
      message: message,
      mobile: mobile,
      region: region,
    };
    this.loading = true;
    if (!this.becomePartnersForm.invalid) {
      this.authService
        .partnerRequest(userCredentials)
        .pipe(
          takeUntil(this.unsubscribeSignal.asObservable()),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          (resp: HttpResponse<any>) => {
            if (resp.status === 200) {
              // this.repsData = resp.body;
              const message =resp.body.message;
              this.toaster.success(message);
              // this.closeModal();
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

  setUserDataToLocalStorage(userData) {
    localStorage.setItem("user", JSON.stringify(userData["id"]));
  }

    // openModal(template: TemplateRef<any>, id) {
      // openModal(template: TemplateRef<any>) {
      //   this.modalRef = this.modalService.show(template);
      // }
      openModal(template: TemplateRef<any>) {
        const config = {
          ignoreBackdropClick: true
        };
        this.modalRef = this.modalService.show(template,config);
      }
      toggleDisplay() {
        this.isShow = !this.isShow;
      }
      // closeModal() {
      //   this.modalRefs.forEach((modalRef) => modalRef.hide());
      //   this.modalRefs = [];
      //   localStorage.setItem('modalStatus','close')
      // }
      closeModal() {
        this.modalRef.hide();
        $('.modal-backdrop').hide();
    $('.modal').hide();
    // $('.modal-backdrop').css("visibility", "visible")
        // localStorage.setItem('modalStatus','close')
        
        // const modalsCount = this.modalService.getModalsCount();
        // for (let i = 0; i < modalsCount; i++) {
        //   const modalRef = this.modalService.getModals()[i];
        //   modalRef.hide();
        // }
      }
      // closeModal() {
      //   const modalsStack = this.modalService.getModalsStack();
      //   modalsStack.forEach(modalRef => modalRef.hide());
      // }
}
