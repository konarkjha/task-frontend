import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.scss"]
})
export class TopBarComponent implements OnInit {
  @Input() sideNavExpanded: boolean = true;
  @Output() expanded = new EventEmitter();

  constructor(private api: ApiService) {}

  ngOnInit() {}

  toggleSidenav() {
    this.sideNavExpanded = !this.sideNavExpanded;
    this.expanded.emit(this.sideNavExpanded);
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
}
