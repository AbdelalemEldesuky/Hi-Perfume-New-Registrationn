import {
  Directive,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy
} from "@angular/core";

import { Subject, Observable, SubscriptionLike, timer } from "rxjs";
import { switchMap, take, tap, takeUntil } from "rxjs/operators";

@Directive({
  selector: "[counter]"
})
export class CounterDirective implements OnChanges, OnDestroy {
  private counter$ = new Subject<any>();
  private countSub$: SubscriptionLike;
  unsubscribeSignal: Subject<void> = new Subject();

  @Input() counter: number;
  @Input() interval: number;
  @Output() value = new EventEmitter<number>();

  constructor() {
    this.countSub$ = this.counter$
      .pipe(
        switchMap((options: any) =>
          timer(0, options.interval).pipe(
            take(options.count),
            tap(() => this.value.emit(--options.count))
          )
        )
      ).pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
      )
      .subscribe();
  }

  ngOnChanges() {
    this.counter$.next({ count: this.counter, interval: this.interval });
  }

  ngOnDestroy() {
    this.countSub$.unsubscribe();
    this.unsubscribeSignal.next();
    this.unsubscribeSignal.unsubscribe();
  }
}
