import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PerfumesComponent } from "./perfumes.component";
import { DiscoverPerfumeComponent } from "./discover-perfume/discover-perfume.component";

export const route: Routes = [
  {
    path: "",
    component: PerfumesComponent
  },
  {
    path: "discover",
    component: DiscoverPerfumeComponent
  },
  
];
@NgModule({
  imports: [
    RouterModule.forChild(route)
  ],
  
  declarations: []
})
export class PerfumesRoutingModule {}
