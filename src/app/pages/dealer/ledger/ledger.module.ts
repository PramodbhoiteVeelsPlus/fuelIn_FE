
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
import { CreditComponent } from './credit/credit.component';
import { AccountingComponent } from './accounting/accounting.component';
import { DsrComponent } from './dsr/dsr.component';
import { ShiftWiseComponent } from './shift-wise/shift-wise.component';
import { DayWiseComponent } from './day-wise/day-wise.component';
import { MonthWiseComponent } from './month-wise/month-wise.component';
import { ShifttimeWiseComponent } from './shifttime-wise/shifttime-wise.component';
import { OperaterWiseComponent } from './operater-wise/operater-wise.component';

@NgModule({
    declarations: [
        CreditSalesComponent, 
        CreditPurchaseReportComponent, 
        CreditComponent, 
        AccountingComponent, 
        DsrComponent,
        ShiftWiseComponent,
        DayWiseComponent,
        MonthWiseComponent,
        ShifttimeWiseComponent,
        OperaterWiseComponent],
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
            {
                path: 'credit',
                component: CreditComponent,
            },
            {
                path: 'accounting',
                component: AccountingComponent,
            },
            {
                path: 'dsr',
                component: DsrComponent,
            },
            {
                path: 'shiftWise',
                component: ShiftWiseComponent,
            },
            {
                path: 'dayWise',
                component: DayWiseComponent,
            },
            {
                path: 'monthWise',
                component: MonthWiseComponent,
            },
            {
                path: 'shifttimeWise',
                component: ShifttimeWiseComponent,
            },
            {
                path: 'operaterWise',
                component: OperaterWiseComponent,
            },
        ]),
        WidgetsModule,
        ModalsModule,
        NgbNavModule
    ],
})
export class LedgerModule { }
