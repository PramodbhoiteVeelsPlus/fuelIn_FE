import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { DailyReportEntriesComponent } from './daily-report-entries/daily-report-entries.component';
import { DailyReportComponent } from './daily-report/daily-report.component';
import { MonthlyReportComponent } from './monthly-report/monthly-report.component';
import { VatBookComponent } from './vat-book/vat-book.component';
import { ProfitReportComponent } from './profit-report/profit-report.component';
import { SummaryReportComponent } from './summary-report/summary-report.component';
import { ViswasaTxExcelComponent } from './viswasa-tx-excel/viswasa-tx-excel.component';
import { SalesPurchaseReportComponent } from './sales-purchase-report/sales-purchase-report.component';

@NgModule({
  declarations: [DailyReportEntriesComponent, DailyReportComponent, MonthlyReportComponent,
    VatBookComponent, ProfitReportComponent, SummaryReportComponent, ViswasaTxExcelComponent,
    SalesPurchaseReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule,
    NgbTooltipModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'dailyReportEntries',
        component: DailyReportEntriesComponent,
      },
      {
        path: 'dailyReport',
        component: DailyReportComponent,
      },
      {
        path: 'monthlyReport',
        component: MonthlyReportComponent,
      },
      {
        path: 'vatBook',
        component: VatBookComponent,
      },
      {
        path: 'profitReport',
        component: ProfitReportComponent,
      },
      {
        path: 'summaryReport',
        component: SummaryReportComponent,
      },
      {
        path: 'viswasaTxEcel',
        component: ViswasaTxExcelComponent,
      },
      {
        path: 'salesPurchaseReport',
        component: SalesPurchaseReportComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule
  ],
})
export class ReportModule { }
