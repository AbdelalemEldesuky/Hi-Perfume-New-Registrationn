import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  VERSION,
} from "@angular/core";

import { MatCarousel, MatCarouselComponent } from "@ngmodule/material-carousel";
import { HttpResponse } from "@angular/common/http";
import {
  debounceTime,
  distinctUntilChanged,
  tap,
  finalize,
  takeUntil,
} from "rxjs/operators";
import { fromEvent, Subject } from "rxjs";
import { HttpCategoryService } from "src/app/shared/services/categories.services";
import { OnDestroy, TemplateRef } from "@angular/core";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {
  BsModalService,
  BsModalRef,
  ModalOptions,
  ModalDirective,
} from "ngx-bootstrap/modal";
import { Title } from "@angular/platform-browser";
import { HttpAreaService } from "src/app/shared/services/areas.services";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  ActivatedRoute,
} from "@angular/router";

export interface DialogData {
  animal: string;
  name: string;
}
const config: ModalOptions = {
  backdrop: "static",
  keyboard: false,
  animated: true,
  ignoreBackdropClick: true,
  initialState: {
    data1: "new-user",
    username: "test",
  },
  class: "pupUp-booking-modal",
};
@Component({
  selector: "app-address-component",
  templateUrl: "./address-component.component.html",
  styleUrls: ["./address-component.component.scss"],
})
export class AddressComponentComponent implements OnInit {
  @ViewChild("template", { static: true }) template: TemplateRef<any>;
  modalRef: BsModalRef;
  userArea: any = "";
  areas: any = [];
  unsubscribeSignal: Subject<void> = new Subject();
  loading: boolean;
  currentUrl: any = "";
  constructor(
    private toaster: ToastrService,
    private modalService: BsModalService,
    private httpAreasService: HttpAreaService,
    private activeRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const params = this.activeRoute.snapshot.params;
    this.currentUrl = this.router.url
      ? String(this.router.url).substring(3, this.router.url.length)
      : "";

    const userCurrentArea = localStorage.getItem("userArea")
      ? JSON.parse(localStorage.getItem("userArea"))
      : null;
    if (!userCurrentArea) {
      const userData = localStorage.getItem("userData")
        ? JSON.parse(localStorage.getItem("userData"))
        : null;
      if (userData && userData.areas && userData.areas[0]) {
        this.getUserArea(userData.areas[0], userData);
      } else {
        this.getAreas();
      }
    } else {
      this.userArea = userCurrentArea;
    }
  }

  getAreas() {
    this.httpAreasService
      .getAreasFromApi()
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.areas = data.body;
          const area = data.body[0];
          area.street = "";
          area.building = "";
          area.floor = "";
          area.apartment = "";
          area.street = "";
          this.userArea = data.body[0];
          localStorage.setItem("userArea", JSON.stringify(area));
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

  getUserArea(areaId, userData) {
    this.httpAreasService
      .getSingleArea(areaId)
      .pipe(
        takeUntil(this.unsubscribeSignal.asObservable()),
        finalize(() => (this.loading = false))
      )
      .subscribe(
        (data: any) => {
          this.userArea = data.body;
          const area = data.body;
          area.street =
            userData.address && userData.address.street
              ? userData.address.street
              : "";
          area.building =
            userData.address && userData.address.building
              ? userData.address.building
              : "";
          area.floor =
            userData.address && userData.address.floor
              ? userData.address.floor
              : "";
          area.apartment =
            userData.address && userData.address.apartment
              ? userData.address.apartment
              : "";
          area.mark =
            userData.address && userData.address.mark
              ? userData.address.mark
              : "";
          localStorage.setItem("userArea", JSON.stringify(area));
        },
        (err) => {
          this.toaster.error(err.error.message);
        }
      );
  }

  closeModal() {
    this.modalRef.hide();
  }

  openModal(template: TemplateRef<any>) {
    const config = {
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(template,config);
  }
  changeAddress() {
    localStorage.setItem("redirectAfterAddress", this.currentUrl)
  }
  // this.modalRef.hide();
}
