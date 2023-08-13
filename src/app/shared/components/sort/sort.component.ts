import { Component, OnInit, OnDestroy ,TemplateRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent implements OnInit, OnDestroy {
  step = '';
  unsubscribeSignal: Subject<void> = new Subject();
  arrangements = [
    {
      id: 1,
      title: 'high_price',
      value: 'max_price',
    },
    {
      id: 2,
      title: 'min_price',
      value: 'min_price',
      selected: false,
    },
    {
      id: 3,
      title: 'high_rate',
      value: 'rate',
      selected: false,
    },

  ]
  query: any;
  modalRef: BsModalRef;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private modalService: BsModalService

  ) { }

  ngOnInit() {
    this.activateRoute.queryParamMap.pipe(
      takeUntil(this.unsubscribeSignal.asObservable()),
    )
      .subscribe(page => {
        this.query = page['params'];
      });
  }

  getArrangmentValue(value) {
    if (value === 'rate') {
      this.step = 'rate';
    }
    if (value === 'max_price') {
      this.step = 'max_price';
    }
    if (value === 'min_price') {
      this.step = 'min_price';
    }


    let clone = Object.assign({}, this.query);
    clone.sort = value;
    this.query = clone;
    if (value === 'clear') {
      this.step = '';
      delete clone.sort;
    }
    this.router.navigate([`/search-results/`], {
      relativeTo: this.activateRoute,
      queryParams: clone
    });
    this.modalRef.hide();

  }
  ngOnDestroy() {
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
