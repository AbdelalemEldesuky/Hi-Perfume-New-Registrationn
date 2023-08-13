import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { HttpReservationService } from './services/reservation.service';
import { HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { switchMap, tap, map, finalize, takeUntil } from "rxjs/operators";
import { Meta } from '@angular/platform-browser';
import { NgxUiLoaderService } from "ngx-ui-loader"; // Import NgxUiLoaderService

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {
  property = JSON.parse(localStorage.getItem('property'));
  date = localStorage.getItem('reservationDate');
  reservationData: any;
  loading: boolean = true;
  modalRef: BsModalRef;
  isConfirmed = false;
  selectedReservation: any;
  unsubscribeSignal: Subject<void> = new Subject();
  center: any = {
    lng: 46.72185,
    lat: 24.68773,
  };
  
  constructor(
    private httpReservationService: HttpReservationService,
    private modalService: BsModalService,
    private metaTagService:Meta,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.httpReservationService.getPropertyReservation().pipe(
      takeUntil(this.unsubscribeSignal.asObservable()),
      finalize(() => this.loading = false)
    )
      .subscribe((data: HttpResponse<any>) => {
        if (data.status === 200) {
          this.reservationData = data.body;
        }
      })

      this.metaTagService.addTags([
        { name: 'keywords', content: 'Angular SEO Title, Meta Description, Meta Keyword Example' },
  
        { name: 'robots', content: 'index, follow' },
  
        { name: 'author', content: 'Hardik Savani' },
  
        { charset: 'UTF-8' }    ])

        
  
        this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId
        // Stop the foreground loading after 5s
        setTimeout(() => {
          this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
        }, 3000);
    
        // OR
        this.ngxService.startBackground("do-background-things");
        // Do something here...
        this.ngxService.stopBackground("do-background-things");
    
        this.ngxService.startLoader("loader-01"); // start foreground spinner of the loader "loader-01" with 'default' taskId
        // Stop the foreground loading after 5s
        setTimeout(() => {
          this.ngxService.stopLoader("loader-01"); // stop foreground spinner of the loader "loader-01" with 'default' taskId
        }, 3000);
  }

  ngOnDestroy() {
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
  }

  confirmCheckout(template) {
    let ngbModalOptions: ModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    this.modalRef = this.modalService.show(template, ngbModalOptions);
  }

  calculateWillpay() {
    let downPayment;
    if (this.selectedReservation.property.is_offer) {
      downPayment = (this.selectedReservation.property.offer_price * this.selectedReservation.property.category.down_payment_percentage) / 100;
    } else {
      downPayment = (this.selectedReservation.property.price * this.selectedReservation.property.category.down_payment_percentage) / 100;
    }
    return downPayment;
  }




  getPropertyPrice(property) {
    let price: number;
    if (!property.is_offer) {
      price = property.price;
      return price;
    }
    price = property.offer_price;
    return price;
  }

  openModal(template: TemplateRef<any>, reservationData) {
    this.selectedReservation = reservationData;
    this.modalRef = this.modalService.show(template);
  }


  goToMyReservation() {
    console.log('clicked!!!');
  }

}
