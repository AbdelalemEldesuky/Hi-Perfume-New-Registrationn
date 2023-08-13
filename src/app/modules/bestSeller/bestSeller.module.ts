import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {BestSellerRoutingModule } from "./bestSeller.routing.module";
// import {BestSellerComponent } from "./bestSeller.component";
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule,BestSellerRoutingModule,SharedModule,RouterModule],
  // declarations: [BestSellerComponent],
  // exports: [
  //   BestSellerComponent
  // ]
})
export class BestSellerModule {

}
