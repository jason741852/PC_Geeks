//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { BaseRequestOptions, HttpModule, JsonpModule } from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { RatingModule } from 'ngx-rating'
import { SlideMenuModule } from './slideMenuNavigation/slideMenu';
import { AppRoutingModule } from './app-routing.module';
import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';

//Services
import { SaleService } from './_services/sale.service';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service'
import { UserService } from './_services/user.service'
import { PotentialBuyerService } from './_services/potential_buyer.service'
import { MessageService } from './_services/message.service'
import { CurrentUserService } from './_services/currentuser.service';


//Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ProfileComponent } from "./profile/profile.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { ChangePasswordComponent } from "./change-password/change-profile.component";

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormComponent } from './form/form.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { DashboardSaleComponent } from './dashboard-sale/dashboard-sale.component';
import { ListSaleComponent } from './list-sale/list-sale.component';
import { DashboardFilterComponent } from './dashboard-filter/dashboard-filter.component';
import { MessageComponent } from './message/message.component'
import { ReportComponent } from './report/report.component';
import { AlertComponent } from "./alert/alert.component";
import { SupportComponent } from './support/support.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainPageComponent,
    LoginComponent,
    RegisterComponent,
    SidebarComponent,
    FormComponent,
    SaleDetailComponent,
    DashboardSaleComponent,
    ListSaleComponent,
    DashboardFilterComponent,
    ProfileComponent,
    MessageComponent,
    ReportComponent,
    EditProfileComponent,
    AlertComponent,
    ChangePasswordComponent,
    SupportComponent,
    AboutComponent,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    JsonpModule,
    SlideMenuModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBgFlNhXKMMIboiiv2zgyUv6fA-9_qGeaQ',
      libraries: ['places']
    })
  ],
  providers: [
    SaleService,
    AlertService,
    AuthenticationService,
    UserService,
    CurrentUserService,
    PotentialBuyerService,
    MessageService,
    BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
