import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { UserFormComponent } from "./user-form/user-form.component";
import { UsersComponent } from "./users/users.component";
import { UserDetailsComponent } from "./user-details/user-details.component";
/* Guards */
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  { path: "home/:module", component: HomeComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "users", component: UsersComponent, canActivate: [AuthGuard] },
  {
    path: "user-details/:id",
    component: UserDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "user-form/:id",
    component: UserFormComponent,
    canActivate: [AuthGuard]
  },

  // otherwise redirect to home
  { path: "**", component: LoginComponent }
];

export const appRoutingModule = RouterModule.forRoot(routes);
