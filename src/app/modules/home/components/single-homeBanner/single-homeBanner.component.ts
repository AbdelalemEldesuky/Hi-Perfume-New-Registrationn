import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-single-homeBanner",
  templateUrl: "./single-homeBanner.component.html",
  styleUrls: ["./single-homeBanner.component.scss"],
})
export class SingleHomeBannerComponent implements OnInit {
  @Input() homeBanner;
  constructor() {}

  ngOnInit() {}

  openBanner() {
    const year = new Date().getFullYear();
    const month =
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    const day =
      new Date().getDate() + 1 < 10
        ? "0" + (new Date().getDate() + 1)
        : new Date().getDate() + 1;
    const date = `${year}-${month}-${day}`;
    if (this.homeBanner.type === "city") {
      window.location.replace(
        `/${localStorage.getItem(
          "current-language"
        )}/search-results?date=${date}&city=${this.homeBanner.city._id}`
      );
    }
    if (this.homeBanner.type === "category") {
      window.location.replace(
        `/${localStorage.getItem(
          "current-language"
        )}/search-results?date=${date}&category=${this.homeBanner.category._id}`
      );
    }
    if (this.homeBanner.type === "property") {
      window.location.replace(
        `/${localStorage.getItem(
          "current-language"
        )}/search-results/item-details/${this.homeBanner.property._id}?date=${date}`
      );
    }
    if (this.homeBanner.type === "external_url") {
      window.open(this.homeBanner.url);
      // window.open(`${this.homeBanner.url}`);

    }
  }
}
