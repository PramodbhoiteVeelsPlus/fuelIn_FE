import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from "../../_metronic/shared/shared.module";
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { CustomerOnboardingComponent } from './customer-onboarding/customer-onboarding.component';

@NgModule({
  declarations: [CustomerOnboardingComponent],
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
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule,
  ],
})
export class ViswasaModule { }
