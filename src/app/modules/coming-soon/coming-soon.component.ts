import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $( document ).ready(function() {
    $('#header').hide();
    $('.side_nav_container').hide();
  });

  }

}
