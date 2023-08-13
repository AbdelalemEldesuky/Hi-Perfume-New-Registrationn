import { Component, OnInit, HostListener, ChangeDetectorRef, ViewChild, TemplateRef } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";

import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import {
  switchMap,
  debounceTime,
  catchError,
  tap,
  finalize,
  takeUntil,
} from "rxjs/operators";
import * as $ from 'jquery';

import { ToastrService } from "ngx-toastr";
import { HttpResponse } from "@angular/common/http";


import { HttpPaymentService } from "./services/payment.service";
import { HttpCartService } from "src/app/shared/services/cart.service";
import { HttpOrderService } from "src/app/shared/services/order.service ";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { HttpCategoryService } from "src/app/shared/services/categories.services";
import { BreakpointObserver } from "@angular/cdk/layout";
import { UsersService } from "../home/services/users.service";
import { AuthService } from "../auth/service/auth.service";
import { Subject } from "rxjs";

// import { NotificationService } from "../../shared/services/notifications/notification.service";

@Component({
  selector: "app-payment-form",
  templateUrl: "./payment-form.component.html",
  styleUrls: ["./payment-form.component.scss"],
})
export class PaymentFormComponent implements OnInit  {
  @ViewChild("template", { static: true }) template: TemplateRef<any>;

  modalRefs: BsModalRef[] = [];
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue = 3;
  loading = true;
  carts: any[] = [];
  cartDetails:any;
  handler:any = null;
  userData: any = [];
  payment_token :any;
  payment_status =false;
  editFile: boolean = true;
  removeUpload: boolean = false;
  unsubscribeSignal: Subject<void> = new Subject();

  paymentForm: FormGroup;
  changeUserMobileForm: FormGroup;
  changeUserPasswordForm: FormGroup;
  activeTabId: string = 'overview';

  modalRef: BsModalRef;
  oneAtATime = true;
  firstName: any;
  location:any;
  orders: any[] = [];
  shippingData:any
  separateDialCode = false;
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
  creditCardForm: FormGroup;
  expMonths: string[];
  expYears: string[];

  _isStoreCard: Boolean = false;

  progressCount: number = 1;
  progressValues = [];
  progressLength: number = 0;
  isPayed=false;
  spinnerShow: Boolean = false;
  successShow: Boolean = false;

  constructor(private cardForm: FormBuilder,
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
    public authService: AuthService,) {
    
  }

  inputEmail($event) {
      if ($event == 'test@gmail.com') {
          this.creditCardForm.controls.cardNumber.setValue('1234567899990000');
          this.creditCardForm.controls.expMonth.setValue('07');
          this.creditCardForm.controls.expYear.setValue('19');
          this.progressCount = 100;
      }
  }

  // Store card from email
  storeCard() {
      this._isStoreCard = !this._isStoreCard;
      if(this._isStoreCard) {
          this.creditCardForm.controls.cardNumber.disable();
          this.creditCardForm.controls.expMonth.disable();
          this.creditCardForm.controls.expYear.disable();
          this.creditCardForm.controls.email.enable();
      } else {
          this.creditCardForm.controls.cardNumber.enable();
          this.creditCardForm.controls.expMonth.enable();
          this.creditCardForm.controls.expYear.enable();
          this.creditCardForm.controls.email.disable();
      }
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
  // Initialization form
  private initForm(): void {
      this.creditCardForm = this.cardForm.group({
          cardNumber: [null, [
              Validators.required,
              Validators.pattern(/^[0-9]{16}$/),
              Validators.minLength(16),
              Validators.maxLength(16),
          ]],
          expMonth: [null, [
              Validators.required,
          ]],
          expYear: [null, [
              Validators.required,
          ]],
          zip_code: [null, [
            Validators.required,
        ]],
          cvvCode: [null, [
              Validators.required,
              Validators.pattern(/^[0-9]{3}$/),
              Validators.minLength(3),
              Validators.maxLength(3),
          ]],
          email: [null, [
              Validators.required,
              Validators.pattern(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/),
          ]],
      });
      this.creditCardForm.controls.email.disable();
  }

  // Counter for progressbar
  counterProgressBar(val) {
      this.progressLength = 0;
      this.progressValues = Object.values(val);

      if(!this._isStoreCard) {
          for (let item of this.progressValues) {
              if (item != null) {
                  this.progressLength += item.length * 4.5;
              }
          }
      }

      this.progressCount = this.progressLength;
  }

  refreshAPICart() {
    this.httpCategoryService.refresh();
  }

  // Submitting form
  submit() {
    this.isPayed=true;
    const data = this.creditCardForm.value;

    // if (!data.cardNumber) {
    //   const message ="Please enter your card number";
    //   this.toaster.error(message);
    //   return;
    // }
    // if (!data.expMonth) {
    //   const message ="Please enter your expiration date";
    //    this.toaster.error(message);
    //    return;
    //  }
    //  if (!data.cvvCode) {
    //   const message ="Please enter your cvv";
    //    this.toaster.error(message);
    //    return;
    //  }
    //  if (!data.zip_code) {
    //   const message ="Please enter your Postal code";
    //    this.toaster.error(message);
    //    return;
    //  }
    //  const expiration_date = data.expiration_date.split('/');
  // const [month, year] = new Date(`${expiration_date}`).toLocaleDateString('en-US', { month: 'numeric', year: 'numeric' }).split('/');
  // console.log(month, year); 
  
      let body = {
        brand_type : 'Visa',
        channel : 'web',
        card_number : data.cardNumber,
        expiration_date : data.expMonth+'/'+data.expYear,
        zip_code : data.zip_code,
        cvv:data.cvvCode
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
  
               this.isPayed=false;
                this.spinnerShow = true;
                
                setTimeout(()=>{
                  this.toaster.success('Payment Success!!');
                  localStorage.removeItem('TPFAMO');
                  localStorage.setItem('invoice_data',JSON.stringify(resp))
                  this.closeModal()
                  this.router.navigateByUrl(
                    `/checkout/invoice`
                  );
                  
                  this.refreshAPICart()
                },2000);
  
              }
            },
            (err) => {
              this.loading = false;
              this.isPayed=false;
              this.toaster.error(err.error.message);
            }
          );
   
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
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
}

  ngOnInit() {
    this.getCart()
      this.expMonths = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      this.expYears = [ '23', '24', '25','26','27','28','29','30','31','32'];
      this.initForm();

      // Subscribing to form changing for counter progressbar
      this.creditCardForm.valueChanges.subscribe(val => this.counterProgressBar(val));

      this.paymentForm = this.fg.group({
      
        zip_code: [""],
        cardNumber: ["", Validators.required],
        cvvCode: ["", Validators.required],
        expMonth: ["", Validators.required],
        expYear: ["", Validators.required],
        
  
      });
  }
  

}
