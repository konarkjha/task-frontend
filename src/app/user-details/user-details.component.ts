import { Component } from "@angular/core";
import { ApiService } from "../services/api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { STATUS_CODES, SPINNER_CONFIGS, MESSAGES } from "../app.constant";

@Component({
  selector: "user-details",
  templateUrl: "user-details.component.html",
  styleUrls: ["user-details.component.scss"]
})
export class UserDetailsComponent {
  userDetails: any;
  userProfileImage: any;
  userRoles: any;
  spinnerConfigs: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute
  ) {
    this.userRoles = this.api.getLoggedInUserRoles();
    this.spinnerConfigs = SPINNER_CONFIGS;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.spinner.show();
      this.getUserDetailsById(params["id"]);
    });
  }

  getUserDetailsById(userId) {
    this.api.getUserById(userId).subscribe(
      response => {
        this.userDetails = response.data;
        this.userProfileImage = this.userDetails.photoUrl;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }
}
