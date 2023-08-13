import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-login-btn',
  templateUrl: './confirm-login-btn.component.html',
  styleUrls: ['./confirm-login-btn.component.scss']
})
export class ConfirmLoginBtnComponent implements OnInit {
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
