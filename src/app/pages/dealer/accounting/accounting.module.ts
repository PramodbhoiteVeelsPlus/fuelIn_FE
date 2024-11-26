import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { AddAccountingComponent } from './add-accounting/add-accounting.component';
import { AddBankComponent } from './add-bank/add-bank.component';
import { ViewBankComponent } from './view-bank/view-bank.component';
import { BookLedgerComponent } from './book-ledger/book-ledger.component';
import { PosComponent } from './pos/pos.component';
import { ViewAccountingComponent } from './view-accounting/view-accounting.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule,
    NgbTooltipModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'addAccounting',
        component: AddAccountingComponent,
      },
      {
        path: 'viewAccounting',
        component: ViewAccountingComponent,
      },
      {
        path: 'addBank',
        component: AddBankComponent,
      },
      {
        path: 'viewBank',
        component: ViewBankComponent,
      },
      {
        path: 'book',
        component: BookLedgerComponent,
      },
      {
        path: 'pos',
        component: PosComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule
  ],
})
export class AccountingModule { }
