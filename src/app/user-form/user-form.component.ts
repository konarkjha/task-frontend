import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from "../services/api.service";
import {
  STATUS_CODES,
  MANAGE_USERS,
  SPINNER_CONFIGS,
  MESSAGES
} from "../app.constant";
import { ToastrService } from "ngx-toastr";
import { FormGroup, FormControl, Validators } from "@angular/forms";
declare var $: any;

@Component({
  selector: "app-user-form",
  templateUrl: "./user-form.component.html",
  styleUrls: ["./user-form.component.scss"]
})
export class UserFormComponent implements OnInit {
  roles: any;
  userId: any;
  userData: any;
  userRoles: any;
  userTypes: any;
  spinnerConfigs: any;
  userEmail: any;
  dataForUpdate: any;
  modalFlag: any;
  registrationForm: any;
  fileData: File = null;
  seletedFiles: File = null;
  image: any;
  constructor(
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.roles = [];
    this.userRoles = this.api.getLoggedInUserRoles();
    this.userData = {
      name: "",
      email: "",
      contactNumber: "",
      userType: ""
    };
    this.spinnerConfigs = SPINNER_CONFIGS;
    this.modalFlag = false;
  }

  ngOnInit() {
    this.spinner.show();
    this.activatedRoute.params.subscribe(params => {
      if (params["id"] != null) {
        this.userId = params["id"];
        this.getUserById();
        this.getUserTypes();
      } else {
        window.history.back();
      }
    });
    this.registrationForm = new FormGroup({
      userNames: new FormControl(
        { value: "" },
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),

      userEmail: new FormControl(
        { value: "" },
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),
      userMobile: new FormControl(
        { value: "" },
        Validators.compose([
          Validators.required,
          Validators.pattern("^[6-9][0-9]*$"),
          Validators.minLength(10)
        ])
      ),
      userType: new FormControl({ value: "" }, Validators.required)
    });
  }
  get Name() {
    return this.registrationForm.get("userNames");
  }
  get Email() {
    return this.registrationForm.get("userEmail");
  }
  get Phone() {
    return this.registrationForm.get("userMobile");
  }
  get UserType() {
    return this.registrationForm.get("userType");
  }
  getUserById() {
    if (this.userId) {
      this.api.getUserById(this.userId).subscribe(
        response => {
          if (response.statusCode === STATUS_CODES.SUCCESS && response.data) {
            this.userData = response.data;
          }
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        }
      );
    }
  }

  getUserTypes() {
    this.api.getUserTypes().subscribe(
      response => {
        if (response.statusCode === STATUS_CODES.SUCCESS && response.data) {
          this.userTypes = response.data;
        }
      },
      error => {}
    );
  }

  save() {
    const formData = new FormData();
    formData.append("userProfileImage", this.seletedFiles);
    formData.append("userId", this.userId);
    formData.append("name", this.userData.name);
    formData.append("email", this.userData.email);
    formData.append("contactNumber", this.userData.contactNumber);
    formData.append("userType", this.userData.userType);
    console.log(formData, "KKKKKKKK");

    this.api.updateUserData(formData).subscribe(response => {
      if (response.statusCode == STATUS_CODES.SUCCESS) {
        this.getUserById();
        this.toastr.success(MESSAGES.DATA_UPDATED);
      }
    });
  }

  hasEditRoleAccess() {
    if (!this.userRoles) {
      return false;
    }
    const roles = Object.keys(this.userRoles);
    const matchedIndex = roles.indexOf(MANAGE_USERS);
    if (matchedIndex != -1) {
      if (
        Object.values(this.userRoles[roles[matchedIndex]]).filter(item => item)
          .length > 0
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  }
}
