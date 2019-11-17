import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from "ngx-toastr";
import { ToastrService } from "ngx-toastr";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";

/* Guards */
import { AuthGuard } from "./guards/auth.guard";

/* Global Services */
import { ApiService } from "./services/api.service";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RootComponent } from "./root/root.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./login/login.component";
import { UserFormComponent } from "./user-form/user-form.component";
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from "../app/home/home.component";
import { UsersComponent } from "./users/users.component";

@NgModule({
  declarations: [
    AppComponent,
    RootComponent,
    LoginComponent,
    UserFormComponent,
    UserDetailsComponent,
    HomeComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    InfiniteScrollModule,
    HttpClientModule,

    ToastrModule.forRoot({
      positionClass: "toast-top-full-width",
      preventDuplicates: true,
      closeButton: true
    }),
    NgxMaterialTimepickerModule
  ],
  providers: [ApiService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
