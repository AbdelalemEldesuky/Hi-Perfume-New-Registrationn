import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {PickupRoutingModule } from "./pickup.routing.module";
import {PickupComponent } from "./pickup.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [CommonModule,PickupRoutingModule,SharedModule],
  declarations: [PickupComponent]
})
export class PickupModule {

}
