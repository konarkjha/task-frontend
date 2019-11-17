import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";

import { appRoutingModule } from "./app.routing";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { UserFormComponent } from "./user-form/user-form.component";
import { UsersComponent } from "./users/users.component";
/* Guards */
import { AuthGuard } from "./guards/auth.guard";
import { UserDetailsComponent } from "./user-details/user-details.component";

NgModule({
  imports: [BrowserModule, appRoutingModule],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    UsersComponent,
    UserDetailsComponent,
    UserFormComponent
  ],
  bootstrap: [AppComponent]
});
const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "users",
    component: UsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "user-form/:id",
    component: UserFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "user-details/:id",
    component: UserDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "home/:module",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "**",
    component: LoginComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
