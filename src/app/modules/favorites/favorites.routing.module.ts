import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FavoritesComponent } from "./favorites.component";

export const route: Routes = [
  {
    path: "",
    component: FavoritesComponent
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(route)
  ],
  
  declarations: []
})
export class FavoritesRoutingModule {}
