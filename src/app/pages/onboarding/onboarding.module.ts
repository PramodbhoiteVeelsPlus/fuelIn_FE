
import { dealerListComponent } from './dealerOnboarding/dealerList/dealerList.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { DashboardComponent } from './dashboard.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { demoComponent } from './dealerOnboarding/demo/demo.component';
import { onboardingComponent } from './onboarding.component';
import { requestComponent } from './dealerOnboarding/request/request.component';

@NgModule({
  declarations: [
    onboardingComponent,
    dealerListComponent,
    demoComponent,
    requestComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: onboardingComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule,
  ],
  exports: [
    dealerListComponent,
    demoComponent,
    requestComponent,
    // Dashboard4Component
  ]
})
export class onboardingModule { }
