import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReservationComponent } from './reservation.component';
import {  ReservationRoutingModule } from './reservation.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  imports: [CommonModule, ReservationRoutingModule, SharedModule,
    NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', loadingText: 'This item is actually loading...' }),
  ],
  declarations: [ReservationComponent]
})
export class ReservationModule { }
