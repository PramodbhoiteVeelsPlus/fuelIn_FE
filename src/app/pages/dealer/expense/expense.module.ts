
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { DailyReportExpenseComponent } from './daily-report-expense/daily-report-expense.component';
import { ExpenseAccountingComponent } from './expense-accounting/expense-accounting.component';
@NgModule({
    declarations: [ExpenseAccountingComponent, DailyReportExpenseComponent],
    imports: [
        CommonModule,
        FormsModule,
        InlineSVGModule,
        NgbTooltipModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: 'expenseAccounting',
                component: ExpenseAccountingComponent,
            },
            {
                path: 'dailyReportExpense',
                component: DailyReportExpenseComponent,
            },
        ]),
        WidgetsModule,
        ModalsModule,
        NgbNavModule
    ],
})
export class ExpenseModule { }
