import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {
  @Input() rate: number;
  @Input() status: string;
  constructor() { }

  ngOnInit() {
  }

  getAppropriateRate(rate) {
    let rateTxt = "";
    let lang = localStorage.getItem('LOCALIZE_DEFAULT_LANGUAGE');
    if (rate >= 0 && rate <= 2.5) {
      //terible
      rateTxt = lang === 'en' ? 'BAD' : 'سئ';
    } else if (rate >= 2.5 && rate < 5) {
      //bad
      rateTxt = lang === 'en' ? 'Ok' : 'جيد';
    } else if (rate >= 5 && rate < 7.5) {
      //great
      rateTxt = lang === 'en' ? 'great' : 'جيد جداً';
    } else if (rate >= 7.5 && rate <= 10) {
      //great
      rateTxt = lang === 'en' ? 'Excellent' : 'ممتاز';
    } 
    return rateTxt;

  }

}
