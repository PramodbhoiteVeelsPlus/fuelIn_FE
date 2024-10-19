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

@NgModule({
  declarations: [ReportsComponent, NewReportComponent, UpdateMobileComponent],
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
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule,
  ],
})
export class AdminModule {}
