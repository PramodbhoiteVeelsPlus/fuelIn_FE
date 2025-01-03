import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from "../../_metronic/shared/shared.module";
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { FtVehicleComponent } from './ft-vehicle/ft-vehicle.component';

@NgModule({
  declarations: [CustomerListComponent, FtVehicleComponent],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule,
    NgbTooltipModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'customerList',
        component: CustomerListComponent,
      },
      {
        path: 'ftVehicle/:id',
        component: FtVehicleComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule,
  ],
})
export class New_ViswasaModule { }
