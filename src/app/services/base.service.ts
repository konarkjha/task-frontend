import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { ToastrService } from "ngx-toastr";
import {
  STATUS_CODES,
  RESPONSE_MESSAGES,
  SESSION_STORAGE
} from "../app.constant";

@Injectable({
  providedIn: "root"
})
export class BaseService {
  authToken: any;
  userId: any;
  userData: any;
  userRoles: any;

  constructor(protected http: Http, protected toastr: ToastrService) {}

  setActivityTime() {
    let now = new Date().getTime() / 1000;
    sessionStorage.setItem("activityTime", now.toString());
  }

  getLastActivityTime() {
    return parseInt(sessionStorage.getItem("activityTime"));
  }

  getTimeDiffernceOfActivity() {
    let now = new Date().getTime() / 1000;
    let inactiveTime = now - this.getLastActivityTime();
    return inactiveTime;
  }

  logout() {
    sessionStorage.clear();
    window.location.href = "login";
  }

  isInactive() {
    if (this.getTimeDiffernceOfActivity() > environment.inactiveTimeInSec) {
      // redirect to logout
      //alert("Inactive for "+environment.inactiveTimeInSec+" seconds");
      this.logout();
    } else {
      this.setActivityTime();
    }
  }

  isLoggedIn() {
    if (
      sessionStorage.getItem(SESSION_STORAGE.TOKEN) &&
      sessionStorage.getItem(SESSION_STORAGE.ID) &&
      sessionStorage.getItem(SESSION_STORAGE.DETAILS)
    ) {
      return true;
    }
    return false;
  }

  loadToken() {
    this.isInactive();
    if (sessionStorage.getItem(SESSION_STORAGE.TOKEN)) {
      this.authToken = sessionStorage.getItem(SESSION_STORAGE.TOKEN);
    } else {
      this.authToken = null;
    }
  }

  getUserData() {
    this.isInactive();
    if (
      sessionStorage.getItem(SESSION_STORAGE.DETAILS) &&
      JSON.parse(sessionStorage.getItem(SESSION_STORAGE.DETAILS))
    ) {
      this.userData = JSON.parse(
        sessionStorage.getItem(SESSION_STORAGE.DETAILS)
      );
    } else {
      this.userData = null;
    }
    return this.userData;
  }

  getUserId() {
    this.isInactive();
    if (sessionStorage.getItem(SESSION_STORAGE.ID)) {
      this.userId = sessionStorage.getItem(SESSION_STORAGE.ID);
    } else {
      this.userId = null;
    }
    return this.userId;
  }

  getLoggedInUserRoles() {
    this.isInactive();
    if (
      sessionStorage.getItem(SESSION_STORAGE.USER_ROLES) &&
      JSON.parse(sessionStorage.getItem(SESSION_STORAGE.USER_ROLES))
    ) {
      this.userRoles = JSON.parse(
        sessionStorage.getItem(SESSION_STORAGE.USER_ROLES)
      );
    } else {
      this.userRoles = null;
    }
    return this.userRoles;
  }

  getHeaders(method): Headers {
    this.loadToken();
    this.getUserId();
    if (this.authToken && this.userId) {
      if (method == "get") {
        return new Headers({
          Authorization: `Bearer ${this.userId},${this.authToken}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache"
        });
      } else {
        return new Headers({
          Authorization: `Bearer ${this.userId},${this.authToken}`
        });
      }
    } else {
      return new Headers();
    }
  }

  post(url: string, body: Object = {}, headers?: Object): Observable<any> {
    let finalHeaders = this.getHeaders("post");
    if (headers && headers["headers"]) {
      const headerKeys = headers["headers"].keys();
      const headerValues = headers["headers"].values();
      for (let i = 0; i < headerKeys.length; i++) {
        finalHeaders.set(headerKeys[i], headerValues[i][0]);
      }
    }
    return this.http.post(url, body, { headers: finalHeaders });
  }

  get(url: string, headers?: Object): Observable<any> {
    let finalHeaders = this.getHeaders("get");
    if (headers && headers["headers"]) {
      const headerKeys = headers["headers"].keys();
      const headerValues = headers["headers"].values();
      for (let i = 0; i < headerKeys.length; i++) {
        finalHeaders.set(headerKeys[i], headerValues[i][0]);
      }
    }
    return this.http.get(url, { headers: finalHeaders });
  }

  put(url: string, body: Object = {}, headers?: Object): Observable<any> {
    let finalHeaders = this.getHeaders("put");
    if (headers && headers["headers"]) {
      const headerKeys = headers["headers"].keys();
      const headerValues = headers["headers"].values();
      for (let i = 0; i < headerKeys.length; i++) {
        finalHeaders.set(headerKeys[i], headerValues[i][0]);
      }
    }
    return this.http.put(url, body, { headers: finalHeaders });
  }

  delete(url: string, headers?: Object): Observable<any> {
    let finalHeaders = this.getHeaders("delete");
    if (headers && headers["headers"]) {
      const headerKeys = headers["headers"].keys();
      const headerValues = headers["headers"].values();
      for (let i = 0; i < headerKeys.length; i++) {
        finalHeaders.set(headerKeys[i], headerValues[i][0]);
      }
    }
    return this.http.delete(url, { headers: finalHeaders });
  }

  onError(error) {
    if (error && error._body) {
      const errorBody = JSON.parse(error._body);
      this.toastr.error(errorBody.message);
      if (error.status === STATUS_CODES.INTERNAL_SERVER_ERROR) {
        if (errorBody.message === RESPONSE_MESSAGES.NOT_LATEST_LOGIN) {
          this.logout();
        } else if (errorBody.message === RESPONSE_MESSAGES.INVALID_TOKEN) {
          this.logout();
        } else if (
          errorBody.message === RESPONSE_MESSAGES.AUTH_HEADER_MISSING
        ) {
          this.logout();
        } else {
          // do something here
        }
      } else if (error.status === STATUS_CODES.UNAUTHORIZED) {
        alert(errorBody.message); // to be replaced by toast message
      } else if (error.status === STATUS_CODES.FORBIDDEN) {
        alert(errorBody.message); // to be replaced by toast message
      }
    }
  }
}
