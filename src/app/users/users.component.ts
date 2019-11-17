import { Component, OnInit } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ApiService } from "../services/api.service";
import { FormBuilder, Validators } from "@angular/forms";
import { FormGroup, FormControl } from "@angular/forms";
import {
  STATUS_CODES,
  EDIT_ROLES,
  SPINNER_CONFIGS,
  SESSION_STORAGE,
  MESSAGES,
  SEARCH_DEBOUNCE_TIME
} from "../app.constant";
import { ToastrService } from "ngx-toastr";
import { BaseService } from "../services/base.service";
import { format } from "util";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { Subscription, BehaviorSubject } from "rxjs";
declare var $: any;

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {
  users: any;
  manageSpinner = { enableSpinner: false, showDataNotFound: false };
  userTypes: any = [];
  reportingHeads: any;
  userRoles: any;
  spinnerConfigs: any;
  keys: string[];
  userNames: any;
  userMobile: any;
  loaderTrigger: any;
  userEmail: any;
  userTypeValues: unknown[];
  userType: any;
  user_Types: any;
  userPassword: any;
  newUser: any;
  searchText: any;
  filterUserValue: any;
  storeDeleteId: any;
  department: any;
  reportingHead: any;
  loggedInUserType: any = {};
  scrollDistance = 1;
  scrollUpDistance = 2;
  throttle = 300;
  page: number = 2;
  registrationForm: FormGroup;
  isSavingUser: boolean;
  fileData: File = null;
  seletedFiles: File = null;
  image: any;
  searchSubscription: Subscription;
  activeSearch = new BehaviorSubject(this.searchText);
  stopApiCalls = false;
  constructor(
    private api: ApiService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.users = [];
    this.loaderTrigger = false;
    this.userRoles = this.api.getLoggedInUserRoles();
    this.spinnerConfigs = SPINNER_CONFIGS;
    this.isSavingUser = false;
  }
  onFileChanged(event: any) {
    this.seletedFiles = <File>event.target.files[0];
  }
  ngOnInit() {
    this.userNames = "";
    this.userPassword = "";
    this.spinner.show();
    this.getUsers();
    this.loggedInUserType = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE.DETAILS)
    );
    this.registrationForm = new FormGroup({
      userNames: new FormControl(
        { value: "" },
        Validators.compose([Validators.required, Validators.minLength(3)])
      ),
      userPassword: new FormControl(
        { value: "" },
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$"
          )
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
      userEmail: new FormControl(
        { value: "" },
        Validators.compose([
          Validators.required,
          Validators.pattern("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$")
        ])
      ),

      showMoreControls: new FormControl(),
      userType: new FormControl({ value: "" }, Validators.required)
    });
  }

  get Name() {
    return this.registrationForm.get("userNames");
  }

  get Phone() {
    return this.registrationForm.get("userMobile");
  }

  get Email() {
    return this.registrationForm.get("userEmail");
  }

  get Password() {
    return this.registrationForm.get("userPassword");
  }

  get UserType() {
    return this.registrationForm.get("userType");
  }

  getUserName() {
    let userData = this.api.getUserData();
    return userData.name;
  }

  getUserFirstLetter() {
    let userData = this.api.getUserData();
    let userName = userData.name;
    return userName.charAt(0).toUpperCase();
  }
  logout() {
    this.api.logout();
  }
  getUsers() {
    this.api.getUsers().subscribe(
      response => {
        if (response.statusCode === STATUS_CODES.SUCCESS && response.data) {
          this.users = response.data;
        }
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  searchUser(text) {
    this.manageSpinner.showDataNotFound = false;
    this.stopApiCalls = false;
    this.users.length = 0;
    this.activeSearch.next(this.searchText);
    if (!this.searchSubscription) {
      this.searchSubscription = this.activeSearch
        .pipe(
          debounceTime(SEARCH_DEBOUNCE_TIME),
          distinctUntilChanged(),
          switchMap(text => {
            let search = "";
            if (text) {
              search += "&search" + "=" + text;
            }
            if (this.filterUserValue) {
              search += "&userType" + "=" + this.filterUserValue;
            }
            let objectSearch = {
              page: 1,
              search: search
            };
            this.page = 2;
            this.manageSpinner.enableSpinner = true;
            return this.api.searchUserByAllFilters(objectSearch);
          })
        )
        .subscribe(response => {
          this.manageSpinner.enableSpinner = false;
          if (response.statusCode === STATUS_CODES.SUCCESS && response.data) {
            this.users = response.data;
            if (this.users.length == 0) {
              this.manageSpinner.showDataNotFound = true;
            }
          }
        });
    }
  }
  reset() {
    this.getUsers();
  }

  filterUsers() {
    let search = "";
    this.stopApiCalls = false;
    if (this.searchText) {
      search += "&search" + "=" + this.searchText;
    }
    if (this.filterUserValue) {
      search += "&userType" + "=" + this.filterUserValue;
    }
    let objectSearch = {
      page: 1,
      search: search
    };
    this.users.length = 0;
    this.page = 2;
    this.api.searchUserByAllFilters(objectSearch).subscribe(response => {
      if (response.statusCode === STATUS_CODES.SUCCESS && response.data) {
        this.users = response.data;
        this.getUserTypes();
      }
    });
  }

  getUserTypes() {
    this.api.getAllUserTypes().subscribe(response => {
      let res = response && response._body && JSON.parse(response._body);
      this.userTypes = res.data;
    });
  }

  deletStoreId(id) {
    this.storeDeleteId = id;
  }
  deleteUser() {
    this.spinner.show();
    this.api.deleteUserById(this.storeDeleteId).subscribe(response => {
      this.toastr.success(MESSAGES.DATA_DELETED);
      this.spinner.hide();
      this.getUsers();
    });
  }

  saveUsers() {
    const payload = {
      name: this.userNames,
      password: this.userPassword,
      email: this.userEmail,
      contactNumber: this.userMobile,
      userType: this.userType
    };

    if (
      this.userNames &&
      this.userPassword &&
      this.userMobile &&
      this.userEmail &&
      this.userType
    ) {
      this.spinner.show();
      this.api.createUsers(payload).subscribe(
        response => {
          this.newUser =
            response && response._body && JSON.parse(response._body).data;
          this.spinner.hide();
          this.toastr.success(MESSAGES.USER_CREATED);
          this.users.push(this.newUser);
          $("#userModal").modal("hide");
          this.getUsers();
          this.registrationForm.reset();
          this.blankdata();
          // this.resetCreateUserModalContent();
        },
        error => {
          this.spinner.hide();
        }
      );
    }

    // window.location.reload();
  }

  blankdata() {
    this.userMobile = "";
    this.userPassword = "";
    this.userEmail = "";
    this.userNames = "";
    this.userType = "";
  }
  onScrollDown() {
    if (this.loaderTrigger || this.stopApiCalls) {
      return;
    }
    let search = "";
    if (this.searchText) {
      search += "&search" + "=" + this.searchText;
    }
    if (this.filterUserValue) {
      search += "&userType" + "=" + this.filterUserValue;
    }
    let limit = 10;
    const payload = {
      page: this.page,
      search: search
    };
    this.loaderTrigger = true;
    if (this.page) {
      this.api.searchUserByAllFilters(payload).subscribe(response => {
        this.loaderTrigger = false;
        if (response.statusCode === STATUS_CODES.SUCCESS && response.data) {
          let newUserArray = response.data;
          if (!newUserArray.length) {
            this.page = 0;
          } else {
            this.page++;
          }
          if (newUserArray.length < limit) {
            this.stopApiCalls = true;
          }
          this.users = [...this.users, ...newUserArray];
        }
      });
    }
  }

  hasEditRoleAccess() {
    if (!this.userRoles) {
      return true;
    }
    const roles = Object.keys(this.userRoles);
    const matchedIndex = roles.indexOf(EDIT_ROLES);
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
