import { Dashboard4Component } from './admin dashboard/dashboard4/dashboard4.component';
import { Dashboard3Component } from './admin dashboard/dashboard3/dashboard3.component';
import { Dashboard1Component } from './admin dashboard/dashboard1/dashboard1.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Dashboard2Component } from './admin dashboard/dashboard2/dashboard2.component';

@NgModule({
  declarations: [
    DashboardComponent,
    Dashboard1Component,
    Dashboard2Component,
    Dashboard3Component,
    Dashboard4Component,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule,
  ],
  exports: [
    Dashboard1Component,
    Dashboard2Component,
    Dashboard3Component,
    Dashboard4Component
  ]
})
export class DashboardModule { }
