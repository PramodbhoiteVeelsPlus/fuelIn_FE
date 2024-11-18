import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from "../../_metronic/shared/shared.module";
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { AddAccountComponent } from './add-account/add-account.component';
import { ViewAccountComponent } from './view-account/view-account.component';
import { ViewAccountDetailsComponent } from './view-account-details/view-account-details.component';

@NgModule({
  declarations: [AddAccountComponent, ViewAccountComponent, ViewAccountDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule,
    NgbTooltipModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'addAccount',
        component: AddAccountComponent,
      },
      {
        path: 'viewAccount',
        component: ViewAccountComponent,
      },
      {
        path: 'viewAccountDetails',
        component: ViewAccountDetailsComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule
  ],
})
export class CreditModule { }
