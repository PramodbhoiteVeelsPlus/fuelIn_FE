
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { DashboardComponent } from './dashboard.component';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { onboardingComponent } from './onboarding.component';
import { AllDealerComponent } from "./dealerOnboarding/all-dealer/all-dealer.component";
import { DealerListsComponent } from './dealerOnboarding/dealer-lists/dealer-lists.component';
import { DemoRemovedComponent } from './dealerOnboarding/demo-removed/demo-removed.component';

@NgModule({
  declarations: [
    onboardingComponent,
    AllDealerComponent,
    DealerListsComponent,
    DemoRemovedComponent
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
    AllDealerComponent,
    DealerListsComponent,
    DemoRemovedComponent
  ]
})
export class onboardingModule { }
