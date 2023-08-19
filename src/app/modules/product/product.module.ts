import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {ProductRoutingModule } from "./product.routing.module";
import {ProductComponent } from "./product.component";
import { SharedModule } from "src/app/shared/shared.module";
import { NgxStarsModule } from 'ngx-stars';
import {MatProgressBarModule} from '@angular/material/progress-bar';

// import { BestSellerComponent } from "../bestSeller/bestSeller.component";

@NgModule({
  imports: [CommonModule,ProductRoutingModule,SharedModule,NgxStarsModule,MatProgressBarModule],
  declarations: [ProductComponent]
})
export class ProductModule {

}
