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
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit {

  perfumes=[1,2,3,4,5,6,7,9,10,11,12,13,14,15,16]
  stories: any[] = [];
  unsubscribeSignal: Subject<void> = new Subject();
  loading = true;
 

  constructor(
    private httpCategoryService: HttpCategoryService,
    private toaster: ToastrService,

  ) {}

  ngOnInit() {
    this.getStories() 
  }


  getStories() {
    this.httpCategoryService
      .getStoriesFromApi()
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.stories = data.body.data;
          console.log('storiesss',this.stories);
          
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

}
