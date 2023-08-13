import { Component, OnInit,TemplateRef } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';
import { HttpPropertyService } from '../../services/properties.service';
import { Observable, Subject } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { map, finalize, delay, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { cardAnimation } from '../../animations/animation';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  animations: [
    cardAnimation
  ]
})
export class ItemComponent implements OnInit {
  public carouselTileConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    loop: true,
    RTL: true,
    slide: 1,
    speed: 300,
    point: {
      visible: true
    },
    // interval: { timing: 1500 },
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };
  propertiesLength: any = 0;
  config: any;
  noActivity = false;
  items: any[] = [];
  query = {};
  loading: boolean;
  isAvailable = true;
  date: string;
  unsubscribeSignal: Subject<void> = new Subject();
  end_date: string;
  modalRef: BsModalRef;
  queryParamsDate ='';
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue = 2;

  constructor(
    private httpPropertyService: HttpPropertyService,
    private route: ActivatedRoute, private router: Router,
    private datepipe: DatePipe,
    private modalService: BsModalService
  ) {
    this.queryParamsDate = this.route.snapshot.queryParamMap.get("date");
   }

  ngOnInit() {
    localStorage.removeItem("loading")
    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0
    };
    this.route.queryParamMap.pipe(
      takeUntil(this.unsubscribeSignal.asObservable()),
    )
      .subscribe(page => {
        console.log('page: ', page['params']);
        this.config.currentPage = page['params'].page || 1;
        this.query['page'] = page['params'].page || 1;
        this.query['category'] = page['params'].category || '';
        this.query['sub_category'] = page['params'].sub_category || '';
        this.query['occasion'] = page['params'].occasion;
        this.query['city'] = page['params'].city;
        this.query['date'] = page['params'].date;
        if(page['params'].end_date) {
          this.query['startDate'] = page['params'].date ? page['params'].date : page['params'].end_date;
          this.query['endDate'] = page['params'].end_date;
          this.end_date = this.query['end_date'];
        }
        this.query['price_from'] = page['params'].price_from;
        this.query['name'] = page['params'].name;
        this.query['price_to'] = page['params'].price_to;
        this.query['rate_to'] = page['params'].rate_to;
        this.query['rate_from'] = page['params'].rate_from;
        this.query['capacity_from'] = page['params'].capacity_from;
        this.query['capacity_to'] = page['params'].capacity_to;
        this.query['sort'] = page['params'].sort;
        this.date = this.query['date'];
        let replaceDashDate = new Date()
        let replaceDashEndDate = new Date()
        if (this.query['date']) {
          replaceDashDate = new Date(page.get('date'));
        }
        if (this.query['endDate']) {
          replaceDashEndDate = new Date(page.get('end_date'));
          this.end_date = this.formatDate(replaceDashEndDate);
        }
        this.date = this.formatDate(replaceDashDate);
        if (page['params'].category !== 'offers') {
          this.loadData(this.query);
        }
        if (page['params'].category === 'offers') {
          this.query['category'] = '';
          this.loadOffers(this.query);
        }
      });
      if(this.loading===true){
        localStorage.setItem("loading","true");
      }
      
  }


  ngOnDestroy() {
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
  }


  pageChange(newPage: number) {
    this.query['page'] = newPage;
    this.router.navigate([`/search-results/`], { queryParams: this.query });
  }

  formatDate(selectedDate) {
    const currentDate = selectedDate;
    let latest_date = this.datepipe.transform(currentDate, 'yyyy-MM-dd');
    return latest_date || '';
  }


  loadData(queryPrams) {
    this.loading = true;
    this.httpPropertyService.getPropertiesFromApi(queryPrams).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      finalize(() => this.loading = false),
      takeUntil(this.unsubscribeSignal.asObservable()),
    )
      .subscribe((data: any) => {
        localStorage.setItem("loading","false");
        this.items = data.body && data.body.properties ? data.body.properties : data.body;
        this.propertiesLength = data.body ? data.body.length : 0
        this.config.totalItems = data.body ? data.body.length : 0
        if (typeof data.body == 'undefined' && data.body.length < 1) {
          this.noActivity = true;
        }

        this.queryParamsDate = this.route.snapshot.queryParamMap.get("date");

      })
    }
      

  loadOffers(queryParams) {
    this.httpPropertyService.getOffersFromApi(queryParams).pipe(
      debounceTime(500),
      distinctUntilChanged(),
      finalize(() => this.loading = false),
      takeUntil(this.unsubscribeSignal.asObservable()),
    )
      .subscribe(data => {
        localStorage.setItem("loading","false");
        this.items = data.body&& data.body["offers"] ? data.body["offers"] : data.body;
        this.propertiesLength = data.body ? data.body.length : 0
        this.config.totalItems = data.body ? data.body.length : 0
        if (this.items.length === 0 || this.items.length === undefined) {
          this.noActivity = true;
        }
      })
  }

  checkPropertyAvaiable(property) {
    let isAvailable = true;
    if (property.is_offer && !property.is_offer_available) {
      isAvailable = false;
    } else if (!property.is_available) {
      isAvailable = false;
    }
    else if (!property.is_offer && !property.is_available) {
      isAvailable = false;
    }
    return isAvailable;
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  rating(star){
    this.selectedValue=star;
  }
}
