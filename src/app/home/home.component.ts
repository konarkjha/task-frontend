import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from "../services/api.service";
import { STATUS_CODES, SPINNER_CONFIGS } from "../app.constant";

@Component({
  selector: "home",
  templateUrl: "home.component.html",
  styleUrls: ["home.component.scss"]
})
export class HomeComponent {
  homeModule: any;
  spinnerConfigs: any;

  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.homeModule = null;
    this.spinnerConfigs = SPINNER_CONFIGS;
  }
}
