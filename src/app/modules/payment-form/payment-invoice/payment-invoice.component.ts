import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HttpCartService } from 'src/app/shared/services/cart.service';
import { HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { HttpCategoryService } from 'src/app/shared/services/categories.services';
import { ToastrService } from 'ngx-toastr';
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  map,
  finalize,
  takeUntil,
  filter,
} from "rxjs/operators";
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-invoice',
  templateUrl: './payment-invoice.component.html',
  styleUrls: ['./payment-invoice.component.scss']
})
export class PaymentInvoiceComponent implements OnInit ,OnDestroy{

  unsubscribeSignal: Subject<void> = new Subject();
  loading = true;
  invoice_data:any;
  constructor(
    private httpCategoryService: HttpCategoryService,
    private toaster: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit() {
    this.invoice_data=JSON.parse(localStorage.getItem("invoice_data")).data;
console.log('555555555',this.invoice_data);

  }

  ngOnDestroy() {
  localStorage.removeItem('invoice_data')
  }
}
