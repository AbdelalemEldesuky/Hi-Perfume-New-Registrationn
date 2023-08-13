import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {  WavesModule } from 'angular-bootstrap-md'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
// import { CarouselModule } from 'ngx-bootstrap/carousel';
import { GiftsComponent } from "./gifts.component";
import { NgxStarsModule } from "ngx-stars";
import { GiftsRoutingModule } from "./gifts.routing.module";
@NgModule({
  imports: [
    CommonModule,
    // CarouselModule.forRoot(),
    WavesModule,
    GiftsRoutingModule,
    NgxStarsModule,
    SharedModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot({ animation: 'pulse', loadingText: 'This item is actually loading...' }),
    RouterModule,
    MatButtonModule,
    MatDialogModule,
  ],
  declarations: [
   GiftsComponent   
  ],
  exports: [],

})
export class GiftstModule {}
