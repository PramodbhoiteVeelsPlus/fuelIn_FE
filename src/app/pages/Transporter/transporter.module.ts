
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from "../../_metronic/shared/shared.module";
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { TransDashboardComponent } from './trans-dashboard/trans-dashboard.component';
import { ViewPetrolPumpComponent } from './view-petrol-pump/view-petrol-pump.component';
import { ViewCreditPurchaseComponent } from './view-credit-purchase/view-credit-purchase.component';
import { ViewCreditPaymentComponent } from './view-credit-payment/view-credit-payment.component';
import { FuelLedgerComponent } from './fuel-ledger/fuel-ledger.component';
import { FastagRechargeTransactionComponent } from './fastag-recharge-transaction/fastag-recharge-transaction.component';

@NgModule({
  declarations: [
    TransDashboardComponent,
    ViewPetrolPumpComponent,
    ViewCreditPurchaseComponent,
    ViewCreditPaymentComponent,
    FuelLedgerComponent,
    FastagRechargeTransactionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule,
    NgbTooltipModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'transDashboard',
        component: TransDashboardComponent,
      },
      {
        path: 'viewPetrolPump',
        component: ViewPetrolPumpComponent,
      },
      {
        path: 'viewCreditPurchase',
        component: ViewCreditPurchaseComponent,
      },
      {
        path: 'viewCreditPayment',
        component: ViewCreditPaymentComponent,
      },
      {
        path: 'fuelLedger',
        component: FuelLedgerComponent,
      },
      {
        path: 'fastagRechargeTransactions',
        component: FastagRechargeTransactionComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule,
  ],
})
export class TransporterModule { }
