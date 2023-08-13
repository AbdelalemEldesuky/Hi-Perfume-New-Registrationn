import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-btn',
  templateUrl: './custom-btn.component.html',
  styleUrls: ['./custom-btn.component.scss']
})
export class CustomButtonComponent implements OnInit {
  @Input() name;
  @Input() color;
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
