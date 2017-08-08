
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './login/login.component';
import { DashboardSaleComponent } from './dashboard-sale/dashboard-sale.component';
import { ListSaleComponent } from './list-sale/list-sale.component';

import { FormComponent } from './form/form.component';
import { SaleDetailComponent } from './sale-detail/sale-detail.component';
import { DashboardFilterComponent } from './dashboard-filter/dashboard-filter.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { MessageComponent } from './message/message.component';
import { ReportComponent } from './report/report.component';
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { ChangePasswordComponent } from "./change-password/change-profile.component";
import { SupportComponent } from './support/support.component';
import { AboutComponent } from './about/about.component';
import { HelpComponent } from './help/help.component';


import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { Sale } from './_models/sale';
import { SaleService } from './_services/sale.service';
import { HttpModule } from '@angular/http';


const routes: Routes = [
    {
      path: '',
      redirectTo: '/main',
      pathMatch: 'full'
    },
    {
      path: 'main',
      component: MainPageComponent,
    },
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'register',
      component: RegisterComponent
    },
    {
      path: 'profile',
      component: ProfileComponent
    },
    {
      path: 'editprofile',
      component: EditProfileComponent
    },
    {
        path: 'changepassword',
        component: ChangePasswordComponent
    },
    {
      path: 'form',
      component: FormComponent
    },
    {
      path: 'dashboard',
      component: DashboardSaleComponent
    },
    {
      path: 'list',
      component: ListSaleComponent
    },
    {
      path:'dashboard/:make',
      component: DashboardFilterComponent
    },
    {
      path: 'detail/:id',
      component: SaleDetailComponent
    },
    {

      path: 'message/all',
      component: MessageComponent
    },
    {
      path: 'report/:id',
      component: ReportComponent
    },
    {
      path: 'support',
      component: SupportComponent
    },
    {
      path: 'about',
      component: AboutComponent
    },
    {
      path: 'help',
      component: HelpComponent
    },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
