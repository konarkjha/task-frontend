import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ApiService } from "../services/api.service";
import { Router } from "@angular/router";
import {
  STATUS_CODES,
  SESSION_STORAGE,
  MESSAGES,
  ROUTE_LIST,
  SPINNER_CONFIGS
} from "../app.constant";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: "login",
  templateUrl: "login.component.html",
  styleUrls: ["login.component.scss", "../app.component.scss"]
})
export class LoginComponent implements OnInit {
  logIn: boolean = true;
  signUp: boolean = false;
  FB: any;
  fullName: any;
  forgotPassword: boolean = false;
  loginEmailMobile: boolean = false;
  showOtpScreen: boolean = false;
  formUser = <any>{};
  userID: any;
  otpVal: any;
  token: any;
  loginUserID: any;
  allowNewServer: boolean = false;
  signupForm: FormGroup;
  name: any;
  spinnerConfigs: any;
  signupDetails: any;
  userInfo: any;
  userMobile: any;
  userEmail: any;
  loginOtpScreen: boolean = false;
  // passwordChangeScreen: boolean = false;
  otpValue: any;
  errorMessage: any;
  resend: boolean = false;
  count: number = 30;
  counter: any;
  hide: number = 0;
  password: any;
  email: any;
  contactNumber: any;
  forgotPassScreen: any;
  forgotPassOtpScreen: any;
  changePassScreen: any;
  forgotNumber: any;
  forgotEmail: any;
  newPassword: any;
  confirmNewPassword: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.spinnerConfigs = SPINNER_CONFIGS;
  }

  ngOnInit() {
    //checkiflogin
    if (this.checkIfLogin()) {
      this.closeAllPopUp();
      this.router.navigateByUrl("/users");
    } else {
      return;
    }
    this.signupForm = new FormGroup({
      name: new FormControl(this.name, [
        Validators.required,
        Validators.minLength(4) // <-- Here's how you pass in the custom validator.
      ]),
      password: new FormControl(this.password, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.pattern(
          "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,10}$"
        )
      ]),
      email: new FormControl(this.email, [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
      ]),
      contactNumber: new FormControl(this.contactNumber, [
        Validators.required,
        Validators.maxLength(10),
        Validators.pattern("^[6-9][0-9]*$")
      ])
    });
  }

  get Name() {
    return this.signupForm.get("name");
  }

  get Phone() {
    return this.signupForm.get("contactNumber");
  }

  get Email() {
    return this.signupForm.get("email");
  }

  get Password() {
    return this.signupForm.get("password");
  }

  get f() {
    return this.signupForm.controls;
  }

  checkIfLogin() {
    return sessionStorage.getItem(SESSION_STORAGE.TOKEN) ? true : false;
  }

  saveSession(key, userobj) {
    sessionStorage.setItem(key, userobj);
  }

  getStorageData(key) {
    const data = sessionStorage.getItem(key);
    return JSON.parse(data);
  }

  flushStorageData(key) {
    sessionStorage.removeItem(key);
  }

  //Login with email or contact number and password
  login(json) {
    if (
      (json && json.contactNumber && json.password) ||
      (json && json.email && json.password)
    ) {
      this.api.signIn(json).subscribe(
        response => {
          let res = response ? JSON.parse(response._body) : "";
          if (res && res.statusCode === STATUS_CODES.SUCCESS) {
            this.saveSession(SESSION_STORAGE.TOKEN, res.data.token);
            this.saveSession(SESSION_STORAGE.ID, res.data.id);
            this.saveSession(SESSION_STORAGE.DETAILS, JSON.stringify(res.data));
            this.storeUserRoles(res.data.id);
            this.closeAllPopUp();

            this.router.navigateByUrl(ROUTE_LIST.HOME);
          }
        },
        error => {
          console.log("error", error);

          this.errorMessage = JSON.parse(error._body);
          this.toastr.error(MESSAGES.INVALID_CREDENTIALS);
        }
      );
    } else {
      this.toastr.error(MESSAGES.MISSING_FIELDS);
    }
  }

  //signup
  register(json) {
    this.spinner.show();
    this.api.signUp(json).subscribe(
      response => {
        this.signupDetails = JSON.parse(response._body);
        if (
          this.signupDetails &&
          this.signupDetails.statusCode === STATUS_CODES.SUCCESS
        ) {
          this.saveSession(
            SESSION_STORAGE.RESEND,
            JSON.stringify({ contactNumber: json.contactNumber })
          );
          this.spinner.hide();
          location.reload();
        } else {
          this.toastr.error("status code failed"); // need to display toast message here
        }
      },
      error => {
        this.spinner.hide();
        this.errorMessage = JSON.parse(error._body);
        this.toastr.error(MESSAGES.MISSING_FIELDS);
      }
    );
  }

  changePasswordLogic() {
    if (this.newPassword && this.confirmNewPassword)
      if (this.newPassword === this.confirmNewPassword)
        this.updateUserPasswordCall(this.newPassword);
      else this.toastr.error(MESSAGES.PASSWORD_MISMATCH);
    else this.toastr.error(MESSAGES.MISSING_FIELDS);
  }

  updateUserPasswordCall(password) {
    const data = this.getStorageData(SESSION_STORAGE.DETAILS);
    this.spinner.show();
    const payload = {
      token: data.token,
      userId: data.id,
      userType: data.userType,
      id: data.id,
      name: data.name,
      password: password,
      email: data.email,
      contactNumber: data.contactNumber
    };
    this.api.updateUserPassword(payload).subscribe(
      response => {
        if (response && response.statusCode === STATUS_CODES.SUCCESS) {
          this.spinner.hide();
          this.flushStorageData(SESSION_STORAGE.DETAILS);
          this.openAnyPopUp("logIn", true);
          this.toastr.success(MESSAGES.DATA_UPDATED);
        }
      },
      error => {
        this.spinner.hide();
        this.errorMessage = JSON.parse(error._body);
        this.toastr.error(MESSAGES.INVALID_CREDENTIALS);
      }
    );
  }

  openLoginEmailMobileBlock() {
    this.forgotPassword = false;
    this.signUp = false;
    this.logIn = false;
    this.loginEmailMobile = true;
  }

  closeAllPopUp() {
    this.loginEmailMobile = false;
    this.signUp = false;
    this.logIn = false;
    this.forgotPassScreen = false;
    this.changePassScreen = false;
  }

  openAnyPopUp(key, isOther) {
    if (isOther) {
      this.closeAllPopUp();
    }
    this[key] = true;
  }

  closeAnyPopUp(key) {
    this[key] = false;
  }

  storeUserRoles(userId) {
    if (userId) {
      this.api.getUserRolesByUserId(userId).subscribe(response => {
        if (
          response.statusCode === STATUS_CODES.SUCCESS &&
          response.data &&
          response.data
        ) {
          this.saveSession(
            SESSION_STORAGE.USER_ROLES,
            JSON.stringify(response.data)
          );
          this.router.navigateByUrl(ROUTE_LIST.HOME);
        }
      });
    }
  }
}
