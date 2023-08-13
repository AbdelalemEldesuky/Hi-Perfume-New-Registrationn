import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-payment-btn',
  templateUrl: './confirm-payment-btn.component.html',
  styleUrls: ['./confirm-payment-btn.component.scss']
})
export class ConfirmPaymentBtnComponent implements OnInit {
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
