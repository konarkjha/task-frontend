import { Component } from "@angular/core";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { SESSION_STORAGE } from "./app.constant";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "task-app";
  sideNavExpanded: boolean = true;

  toggleSidenav(event) {
    this.sideNavExpanded = event;
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
}
