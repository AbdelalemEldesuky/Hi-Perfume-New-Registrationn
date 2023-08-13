import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pay-now-button',
  templateUrl: './pay-now-button.component.html',
  styleUrls: ['./pay-now-button.component.scss']
})
export class PayNowButtonComponent implements OnInit {
  @Input() name;
  @Input() loading = false;
  @Input() btnBlock = false;
  @Output() isClicked = new EventEmitter();
  constructor() { }
  ngOnInit() {
  }

  handleIsClicked() {
    this.isClicked.emit();
  }


}
