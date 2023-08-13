import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReservationComponent } from './reservation.component';

export const route: Routes = [
  {
    path: "",
    component: ReservationComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(route)],
  declarations: []
})
export class ReservationRoutingModule { }
