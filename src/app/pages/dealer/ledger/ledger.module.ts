
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { CreditSalesComponent } from './credit-sales/credit-sales.component';
import { CreditPurchaseReportComponent } from './credit-purchase-report/credit-purchase-report.component';

@NgModule({
    declarations: [CreditSalesComponent, CreditPurchaseReportComponent],
    imports: [
        CommonModule,
        FormsModule,
        InlineSVGModule,
        NgbTooltipModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: 'creditSales',
                component: CreditSalesComponent,
            },
            {
                path: 'crPurchaseReport',
                component: CreditPurchaseReportComponent,
            },
        ]),
        WidgetsModule,
        ModalsModule,
        NgbNavModule
    ],
})
export class LedgerModule { }
