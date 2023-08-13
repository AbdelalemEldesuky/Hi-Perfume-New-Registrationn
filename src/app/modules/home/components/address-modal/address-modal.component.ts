import { Component, OnInit, TemplateRef, OnDestroy } from "@angular/core";
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { HttpResponse } from "@angular/common/http";
import { Subject } from "rxjs";
import { switchMap, tap, map, finalize, takeUntil } from "rxjs/operators";
import { HttpAreaService } from "src/app/shared/services/areas.services";
import { ToastrService } from "ngx-toastr";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  ActivatedRoute,
} from "@angular/router";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "app-address-modal",
  templateUrl: "./address-modal.component.html",
  styleUrls: ["./address-modal.component.scss"],
})
export class AddressModalComponent implements OnInit {


  constructor(
  ) {}

  ngOnInit() {

  }

}
