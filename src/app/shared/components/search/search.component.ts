import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpCartService } from "../../services/cart.service";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  cities: any;
  cityId: string;
  date: Date;
  end_date: Date;
  // date = new Date();
  occasions: any[];
  categories: any[];
  occasionId: any;
  categoryId: any;
  maxDate: Date;
  minDate: Date;
  unsubscribeSignal: Subject<void> = new Subject();
  selectedCategory: any = {};

  constructor(
    private HttpCartService: HttpCartService,
    public datepipe: DatePipe,
    private router: Router
  ) {
    this.maxDate = new Date();
    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate() + 1);
    // this.date.setDate(this.date.getDate() + 1);
  }

  ngOnInit() {
    this.fetchCities();
    this.fetchOccasion();
    this.fetchCategories();
  }

  fetchCities() {
    this.HttpCartService
      .getAllCities()
      .pipe(takeUntil(this.unsubscribeSignal.asObservable()))
      .subscribe((data) => {
        this.cities = data.body;
      });
  }

  fetchOccasion() {
    this.HttpCartService
      .getAllOccasions()
      .pipe(takeUntil(this.unsubscribeSignal.asObservable()))
      .subscribe((data) => {
        this.occasions = data.body;
      });
  }

  fetchCategories() {
    this.HttpCartService
      .getAllCategories()
      .pipe(takeUntil(this.unsubscribeSignal.asObservable()))
      .subscribe((data) => {
        this.categories = data.body;
      });
  }

  submitSearch() {
    const searchData = {
      occasion: this.occasionId,
      city: this.cityId,
      category: this.categoryId,
      date: this.formatDate((this.date ? this.date : new Date())),
      end_date:
        this.selectedCategory &&
        this.selectedCategory.multi_days_booking_enabled
          ? this.formatDate(this.end_date)
          : this.formatDate(this.date),
    };
    if (
      this.selectedCategory &&
      !this.selectedCategory.multi_days_booking_enabled
    ) {
      delete searchData["end_date"];
    }
    this.HttpCartService.setFilterData(searchData);
    this.router.navigate(
      [`${localStorage.getItem("LOCALIZE_DEFAULT_LANGUAGE")}/search-results`],
      { queryParams: searchData }
    );
  }

  formatDate(selectedDate) {
    const currentDate = selectedDate;
    let latest_date = this.datepipe.transform(currentDate, "yyyy-MM-dd");
    return latest_date || new Date();
  }

  changeCategory() {
    const getCategory = this.categories.filter(
      (c) => String(c._id) === String(this.categoryId)
    );
    this.selectedCategory = getCategory[0] ? getCategory[0] : {};
  }

  ngOnDestroy() {
    this.unsubscribeSignal.next();
    // Don't forget to unsubscribe from subject itself
    this.unsubscribeSignal.unsubscribe();
  }
}
