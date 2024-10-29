import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from "../../_metronic/shared/shared.module";
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { CustomerOnboardingComponent } from './customer-onboarding/customer-onboarding.component';
import { UploadKitNumberComponent } from './upload-kit-number/upload-kit-number.component';
import { AssignTransactionFastagComponent } from './assign-transaction-fastag/assign-transaction-fastag.component';
import { CoinRewardDetailsComponent } from './coin-reward-details/coin-reward-details.component';
import { FastagReplacementComponent } from './fastag-replacement/fastag-replacement.component';

@NgModule({
  declarations: [CustomerOnboardingComponent, UploadKitNumberComponent, AssignTransactionFastagComponent, CoinRewardDetailsComponent, FastagReplacementComponent],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule,
    NgbTooltipModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'CustomerOnboardingComponent',
        component: CustomerOnboardingComponent,
      },
      {
        path: 'UploadKitNumber',
        component: UploadKitNumberComponent,
      },
      {
        path: 'assignTransactionFastag',
        component: AssignTransactionFastagComponent,
      },
      {
        path: 'CoinRewardDetails',
        component: CoinRewardDetailsComponent,
      },
      {
        path: 'FastagReplacement',
        component: FastagReplacementComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule,
  ],
})
export class ViswasaModule { }
