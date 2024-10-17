import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListingComponent } from './user-listing/user-listing.component';
import { RouterModule } from '@angular/router';
import { UserDetailsComponent } from './user-details/user-details.component';
import { CrudModule } from 'src/app/modules/crud/crud.module';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgbCollapseModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EmployeeComponent } from './employee/employee.component';
import { BusinessComponent } from './business/business.component';
import { FollowUpComponent } from './follow-up/follow-up.component';
import { LocationComponent } from './location/location.component';
import { WidgetsModule } from 'src/app/_metronic/partials';



@NgModule({
  declarations: [UserListingComponent, UserDetailsComponent,
    EmployeeComponent, BusinessComponent, FollowUpComponent,
    LocationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserListingComponent,
      },
      {
        path: ':id',
        component: UserDetailsComponent,
      },
      {
        path: 'employee',
        component: EmployeeComponent,
      },
      {
        path: 'business',
        component: BusinessComponent,
      },
      {
        path: 'followUp',
        component: FollowUpComponent,
      },
      {
        path: 'location',
        component: LocationComponent,
      },
    ]),
    CrudModule,
    SharedModule,
    WidgetsModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbCollapseModule,
    NgbTooltipModule,
    SweetAlert2Module.forChild(),
  ]
})
export class UserModule { }
