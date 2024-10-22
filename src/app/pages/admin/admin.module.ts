import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from "../../_metronic/shared/shared.module";
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { ReportsComponent } from './reports/reports.component';
import { NewReportComponent } from './new-report/new-report.component';
import { UpdateMobileComponent } from './update-mobile/update-mobile.component';
import { GstDetailsComponent } from './gst-details/gst-details.component';
import { ActivityCountComponent } from './activity-count/activity-count.component';
import { AddFuelPartnerComponent } from './add-fuel-partner/add-fuel-partner.component';
import { FuelProductMasterComponent } from './fuel-product-master/fuel-product-master.component';
import { ReferralComponent } from './referral/referral.component';

@NgModule({
  declarations: [ReportsComponent, NewReportComponent,
    UpdateMobileComponent, GstDetailsComponent,
    ActivityCountComponent, AddFuelPartnerComponent,
    FuelProductMasterComponent, ReferralComponent ],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule,
    NgbTooltipModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'reports',
        component: ReportsComponent,
      },
      {
        path: 'newReport',
        component: NewReportComponent,
      },
      {
        path: 'updateMobile',
        component: UpdateMobileComponent,
      },
      {
        path: 'gstDetails',
        component: GstDetailsComponent,
      },
      {
        path: 'activityCount',
        component: ActivityCountComponent,
      },
      {
        path: 'addFuelPartner',
        component: AddFuelPartnerComponent,
      },
      {
        path: 'fuelProductMaster',
        component: FuelProductMasterComponent,
      },
      {
        path: 'referral',
        component: ReferralComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule,
  ],
})
export class AdminModule { }
