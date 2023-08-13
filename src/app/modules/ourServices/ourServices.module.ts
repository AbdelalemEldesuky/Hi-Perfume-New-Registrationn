import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {OurServicesRoutingModule } from "./ourServices.routing.module";
import {OurServicesComponent } from "./ourServices.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [CommonModule,OurServicesRoutingModule,SharedModule],
  declarations: [OurServicesComponent]
})
export class OurServicesModule {

}
