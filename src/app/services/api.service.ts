import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Observable } from "rxjs";
import { throwError } from "rxjs";
import { map, catchError, finalize, mergeAll } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { BaseService } from "./base.service";
import { UNKNOWN_ERROR_MESSAGE } from "../app.constant";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root"
})
export class ApiService extends BaseService {
  apiUrl: any;

  constructor(protected http: Http, protected toastr: ToastrService) {
    super(http, toastr);
    this.apiUrl = environment.apiUrl;
  }

  getUsers(): Observable<any> {
    return this.get(`${this.apiUrl}/users`).pipe(
      map((ret: Response) => {
        return ret.json();
      }),
      catchError((error: Response) => {
        this.onError(error);
        return throwError(UNKNOWN_ERROR_MESSAGE);
      }),
      finalize(() => {})
    );
  }

  getUserById(userId): Observable<any> {
    return this.get(`${this.apiUrl}/user/${userId}`).pipe(
      map((ret: Response) => {
        return ret.json();
      }),
      catchError((error: Response) => {
        this.onError(error);
        return throwError(UNKNOWN_ERROR_MESSAGE);
      }),
      finalize(() => {})
    );
  }

  getUserDetails(userId): Observable<any> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append("Authorization", "Bearer " );
    return this.get(`${this.apiUrl}/user/${userId}`);
  }

  getUserRoles(): Observable<any> {
    return this.get(`${this.apiUrl}/roles`).pipe(
      map((ret: Response) => {
        return ret.json();
      }),
      catchError((error: Response) => {
        this.onError(error);
        return throwError(UNKNOWN_ERROR_MESSAGE);
      }),
      finalize(() => {})
    );
  }

  getUserRolesByUserType(userType): Observable<any> {
    return this.get(`${this.apiUrl}/roles/${userType}`).pipe(
      map((ret: Response) => {
        return ret.json();
      }),
      catchError((error: Response) => {
        this.onError(error);
        return throwError(UNKNOWN_ERROR_MESSAGE);
      }),
      finalize(() => {})
    );
  }

  getUserTypes(): Observable<any> {
    return this.get(`${this.apiUrl}/userTypes`).pipe(
      map((ret: Response) => {
        return ret.json();
      }),
      catchError((error: Response) => {
        this.onError(error);
        return throwError(UNKNOWN_ERROR_MESSAGE);
      }),
      finalize(() => {})
    );
  }

  updateRolesByUserType(payload): Observable<any> {
    return this.put(`${this.apiUrl}/roles`, payload).pipe(
      map((ret: Response) => {
        return ret.json();
      }),
      catchError((error: Response) => {
        this.onError(error);
        return throwError(UNKNOWN_ERROR_MESSAGE);
      }),
      finalize(() => {})
    );
  }

  getUserRolesByUserId(userId): Observable<any> {
    return this.get(`${this.apiUrl}/userroles/${userId}`).pipe(
      map((ret: Response) => {
        return ret.json();
      }),
      catchError((error: Response) => {
        this.onError(error);
        return throwError(UNKNOWN_ERROR_MESSAGE);
      }),
      finalize(() => {})
    );
  }

  signIn(json): Observable<any> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    // headers.append("Authorization", "Bearer");
    return this.post(`${this.apiUrl}/login`, json, headers);
  }

  signUp(json): Observable<any> {
    //  json = JSON.stringify(json);
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    //  headers.append('Authorization', 'Bearer ');
    return this.post(`${this.apiUrl}/signup`, json, headers);
  }
  updateUserData(payload): Observable<any> {
    return this.put(`${this.apiUrl}/user`, payload).pipe(
      map((ret: Response) => {
        return ret.json();
      }),
      catchError((error: Response) => {
        this.onError(error);
        return throwError(UNKNOWN_ERROR_MESSAGE);
      }),
      finalize(() => {})
    );
  }

  updateUserPassword(payload): Observable<any> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${payload.id},${payload.token}`);
    return this.http
      .put(`${this.apiUrl}/user`, payload, { headers: headers })
      .pipe(
        map((ret: Response) => {
          return ret.json();
        }),
        catchError((error: Response) => {
          this.onError(error);
          return throwError(UNKNOWN_ERROR_MESSAGE);
        }),
        finalize(() => {})
      );
  }

  deleteUserById(userId): Observable<any> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.delete(`${this.apiUrl}/user/${userId}`);
  }

  createUsers(payload): Observable<any> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.post(`${this.apiUrl}/user`, payload).pipe(
      map((ret: Response) => {
        return ret.json();
      }),
      catchError((error: Response) => {
        this.onError(error);
        return throwError(UNKNOWN_ERROR_MESSAGE);
      }),
      finalize(() => {})
    );
  }

  searchUserByAllFilters(obj): Observable<any> {
    let headers = new Headers();
    let urlText = `${this.apiUrl}/users`;
    if (obj.search && !obj.page) {
      urlText = `${urlText}?${obj.search}`;
    } else if (obj.page && !obj.search) {
      urlText = `${urlText}?page=${obj.page}`;
    } else if (obj.search && obj.page) {
      urlText = `${urlText}?page=${obj.page}${obj.search}`;
    }
    headers.append("Content-Type", "application/json");
    return this.get(urlText).pipe(
      map((ret: Response) => {
        return ret.json();
      }),
      catchError((error: Response) => {
        this.onError(error);
        return throwError(UNKNOWN_ERROR_MESSAGE);
      }),
      finalize(() => {})
    );
  }

  getAllUserTypes(): Observable<any> {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.get(`${this.apiUrl}/userTypes`);
  }
}
