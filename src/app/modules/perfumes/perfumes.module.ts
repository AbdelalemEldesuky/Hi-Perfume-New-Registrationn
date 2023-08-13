import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {PerfumesRoutingModule } from "./perfumes.routing.module";
import {PerfumesComponent } from "./perfumes.component";
import { SharedModule } from "src/app/shared/shared.module";
import { DiscoverPerfumeComponent } from "./discover-perfume/discover-perfume.component";

@NgModule({
  imports: [CommonModule,PerfumesRoutingModule,SharedModule],
  declarations: [PerfumesComponent,DiscoverPerfumeComponent]
})
export class PerfumesModule {

}
