import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
} from "@angular/core";
import { NavigationExtras } from '@angular/router';
import * as $ from 'jquery';
import { HttpCategoryService } from "src/app/shared/services/categories.services";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  finalize,
  takeUntil,
  filter,
} from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { HttpResponse } from "@angular/common/http";

import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { TabDirective } from 'ngx-bootstrap/tabs';
import { Router } from "@angular/router";
import { HttpCartService } from "src/app/shared/services/cart.service";

interface Slide_ {
  name: string;
  backgroundColor: string;
}

@Component({
  selector: "app-contactus",
  templateUrl: "./contactus.component.html",
  styleUrls: ["./contactus.component.scss"],
})
export class ContactusComponentComponent implements OnInit {
  unsubscribeSignal: Subject<void> = new Subject();
  loading = true;
  contactus :any;
  myForm: FormGroup;

  constructor(
    private httpCategoryService: HttpCategoryService,
    private httpCartService: HttpCartService,
    private toaster: ToastrService,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {

    this.myForm = this.fb.group({
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      message: ['', Validators.required]
    });
  }
  
  submit() {
    if (!this.myForm.controls.name.value) {
      const message ="Please Enter Your Name";
      this.toaster.error(message);
      return;
    }
    if (!this.myForm.controls.email.value) {
      const message ="Please Enter Your Email";
      this.toaster.error(message);
      return;
    }
    if (!this.myForm.controls.mobile.value) {
      const message = "Please Enter You Mobile";
      this.toaster.error(message);
      return;
    }
    if (!this.myForm.controls.message.value) {
      const message = "Please Enter You Message";
      this.toaster.error(message);
      return;
    }

    const email = String(this.myForm.controls.email.value);
    const mobile = String(this.myForm.controls.mobile.value);
    const message = String(this.myForm.controls.message.value);
    const name = String(this.myForm.controls.name.value);

    let userCredentials = {
      email: email,
      mobile: mobile,
      message: message,
      name : name
    };
    this.loading = true;
    if (!this.myForm.invalid) {
      this.httpCategoryService
        .sendContactUS(userCredentials)
        .pipe(
          takeUntil(this.unsubscribeSignal.asObservable()),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          (resp: HttpResponse<any>) => {
            if (resp.status === 200) {             
              const message = resp.body.message;
              this.toaster.success(message);
              this.router.navigateByUrl("/");
            }
          },
          (err) => {
            this.loading = false;
            console.log(err);
            this.toaster.error(err.error.message);
          }
        );
    }
  }


}
