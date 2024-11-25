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

@NgModule({
  declarations: [
    AddShiftComponent,
    PosDetailsComponent, 
    StaffComponent
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
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule
  ],
})
export class ShiftModule { }
