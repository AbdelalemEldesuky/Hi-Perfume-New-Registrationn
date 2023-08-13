import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-single-featuredProperty',
  templateUrl: './single-featuredProperty.component.html',
  styleUrls: ['./single-featuredProperty.component.scss']
})
export class SingleFeaturedPropertyComponent implements OnInit {
  @Input() featuredProperty;
  currentLanguage = "ar";
  date: string;
  constructor() { }

  ngOnInit() {
    this.currentLanguage = localStorage.getItem("current-language");
    const year = new Date().getFullYear();
    const month =
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1;
    const day =
      new Date().getDate() + 1 < 10
        ? "0" + (new Date().getDate() + 1)
        : new Date().getDate() + 1;
    this.date = `${year}-${month}-${day}`;
  }

}
