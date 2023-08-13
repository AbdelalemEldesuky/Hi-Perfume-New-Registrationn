import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
} from "@angular/core";
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
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";

@Component({
  selector: 'app-ourServices',
  templateUrl: './ourServices.component.html',
  styleUrls: ['./ourServices.component.scss']
})
export class OurServicesComponent implements OnInit {

perfumes=[1,2,3,4,5,6,7,9,10,11,12,13,14,15,16]
services: any[] = [];
unsubscribeSignal: Subject<void> = new Subject();
loading = true;


constructor(
  private httpCategoryService: HttpCategoryService,
  private toaster: ToastrService,

) {}

ngOnInit() {
  this.getServices() 
}


getServices() {
  this.httpCategoryService
    .getServicesFromApi()
    .pipe(
      takeUntil(this.unsubscribeSignal.asObservable()),
      finalize(() => (this.loading = false))
    )
    .subscribe(
      (data: any) => {
        this.services = data.body.data;
        console.log('servicesss',this.services);
        
      },
      (err) => {
        this.toaster.error(err.error.message);
      }
    );
}
}
