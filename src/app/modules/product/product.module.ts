import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {ProductRoutingModule } from "./product.routing.module";
import {ProductComponent } from "./product.component";
import { SharedModule } from "src/app/shared/shared.module";
import { NgxStarsModule } from 'ngx-stars';
// import { BestSellerComponent } from "../bestSeller/bestSeller.component";

@NgModule({
  imports: [CommonModule,ProductRoutingModule,SharedModule,NgxStarsModule],
  declarations: [ProductComponent]
})
export class ProductModule {

}
