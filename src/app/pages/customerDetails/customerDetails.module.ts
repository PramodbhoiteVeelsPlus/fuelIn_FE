
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CustomerDetailsComponent } from './customerDetails.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerDetailsEditComponent } from './customer-details-edit/customer-details-edit.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [CustomerDetailComponent, CustomerDetailsEditComponent, SettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CustomerDetailsComponent,
      },
      {
        path: 'customerDetail/:id',
        component: CustomerDetailComponent,
      },
      {
        path: 'customerDetailsEdit/:id',
        component: CustomerDetailsEditComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule,
  ], 
  exports: [
    CustomerDetailComponent,
    CustomerDetailsEditComponent
  ]
})
export class customerDetailsModule { }
