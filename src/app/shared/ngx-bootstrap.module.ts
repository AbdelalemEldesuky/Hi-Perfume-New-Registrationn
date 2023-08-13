import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {  ModalModule } from 'ngx-bootstrap/modal';
import { RatingModule } from 'ngx-bootstrap/rating';

@NgModule({
    imports: [
        CommonModule,
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
    ],
    exports: [
        BsDatepickerModule,
        ModalModule
    ],
    declarations: [
    ]
})
export class NgxBoostrapModule { }
