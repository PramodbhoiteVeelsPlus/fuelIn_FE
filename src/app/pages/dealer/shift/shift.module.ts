import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { AddShiftComponent } from './add-shift/add-shift.component';
import { PosDetailsComponent } from './pos-details/pos-details.component';
import { StaffComponent } from './staff/staff.component';
import { ViewShiftComponent } from './view-shift/view-shift.component';
import { AddShiftTimeComponent } from './add-shift-time/add-shift-time.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { StaffSalaryComponent } from './staff-salary/staff-salary.component';
import { ShiftWiseComponent } from './shift-wise/shift-wise.component';
import { DayWiseComponent } from './day-wise/day-wise.component';
import { MonthWiseComponent } from './month-wise/month-wise.component';
import { ShiftTimeWiseComponent } from './shift-time-wise/shift-time-wise.component';
import { OperatorWiseComponent } from './operator-wise/operator-wise.component';
import { ShiftReportComponent } from './shift-report/shift-report.component';

@NgModule({
  declarations: [
    AddShiftComponent,
    PosDetailsComponent, 
    StaffComponent,
    ViewShiftComponent,
    AddShiftTimeComponent,
    AttendanceComponent,
    StaffSalaryComponent,
    ShiftWiseComponent,
    DayWiseComponent,
    MonthWiseComponent,
    ShiftTimeWiseComponent,
    OperatorWiseComponent,
    ShiftReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule,
    NgbTooltipModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'addShift',
        component: AddShiftComponent,
      },
      {
        path: 'posDetails',
        component: PosDetailsComponent,
      },
      {
        path: 'staff',
        component: StaffComponent,
      },
      {
        path: 'viewShift',
        component: ViewShiftComponent,
      },
      {
        path: 'addShiftTime',
        component: AddShiftTimeComponent,
      },
      {
        path: 'attendance',
        component: AttendanceComponent,
      },
      {
        path: 'staffSalary',
        component: StaffSalaryComponent,
      },
      {
        path: 'shiftWise',
        component: ShiftWiseComponent,
      },
      {
        path: 'dayWise',
        component: DayWiseComponent,
      },
      {
        path: 'monthWise',
        component: MonthWiseComponent,
      },
      {
        path: 'shiftTimeWise',
        component: ShiftTimeWiseComponent,
      },
      {
        path: 'operatorWise',
        component: OperatorWiseComponent,
      },
      {
        path: 'shiftReport',
        component: ShiftReportComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule
  ],
})
export class ShiftModule { }
