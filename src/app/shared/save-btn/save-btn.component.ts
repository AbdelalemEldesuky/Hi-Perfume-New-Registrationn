import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-save-btn',
  templateUrl: './save-btn.component.html',
  styleUrls: ['./save-btn.component.scss']
})
export class SaveBtnComponent implements OnInit {
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
