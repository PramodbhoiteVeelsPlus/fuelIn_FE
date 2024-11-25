import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AddAccountComponent } from './add-account/add-account.component';
import { ViewAccountComponent } from './view-account/view-account.component';
import { ViewAccountDetailsComponent } from './view-account-details/view-account-details.component';
import { AddSalesComponent } from './add-sales/add-sales.component';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { ViewSalesComponent } from './view-sales/view-sales.component';
import { AddPaymentsComponent } from './add-payments/add-payments.component';
import { ViewPaymentsComponent } from './view-payments/view-payments.component';
import { CreditStatementComponent } from './credit-statement/credit-statement.component';
import { FuelCreditInvoiceDocumentComponent } from './fuel-credit-invoice-document/fuel-credit-invoice-document.component';
import { FuelCreditInvoiceDocNewComponent } from './fuel-credit-invoice-doc-new/fuel-credit-invoice-doc-new.component';
import { FuelCreditInvoiceDocComponent } from './fuel-credit-invoice-doc/fuel-credit-invoice-doc.component';
import { FuelCreditInvoiceVehicleComponent } from './fuel-credit-invoice-vehicle/fuel-credit-invoice-vehicle.component';
import { LubeTaxStatementComponent } from './lube-tax-statement/lube-tax-statement.component';
import { FuelCrInvoiceComponent } from './fuel-cr-invoice/fuel-cr-invoice.component';
import { BookLedgerComponent } from './book-ledger/book-ledger.component';
import { SavedInvoiceComponent } from './saved-invoice/saved-invoice.component';
import { FuelCreditInvoiceManualComponent } from './fuel-credit-invoice-manual/fuel-credit-invoice-manual.component';
import { AddLubeTaxGstSaleComponent } from './add-lube-tax-gst-sale/add-lube-tax-gst-sale.component';
import { CashBillInvoiceComponent } from './cash-bill-invoice/cash-bill-invoice.component';

@NgModule({
  declarations: [
    AddAccountComponent, 
    ViewAccountComponent, 
    ViewAccountDetailsComponent, 
    AddSalesComponent, 
    ViewSalesComponent,
    AddPaymentsComponent,
    ViewPaymentsComponent,
    CreditStatementComponent,
    FuelCreditInvoiceDocumentComponent,
    FuelCreditInvoiceDocNewComponent,
    FuelCreditInvoiceDocComponent,
    FuelCreditInvoiceVehicleComponent,
    LubeTaxStatementComponent,
    FuelCrInvoiceComponent,
    BookLedgerComponent,
    SavedInvoiceComponent,
    FuelCreditInvoiceManualComponent,
    AddLubeTaxGstSaleComponent,
    CashBillInvoiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule,
    NgbTooltipModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'addAccount',
        component: AddAccountComponent,
      },
      {
        path: 'viewAccount',
        component: ViewAccountComponent,
      },
      {
        path: 'viewAccountDetails',
        component: ViewAccountDetailsComponent,
      },
      {
        path: 'addSales',
        component: AddSalesComponent,
      },
      {
        path: 'viewSales',
        component: ViewSalesComponent,
      },
      {
        path: 'addPayments',
        component: AddPaymentsComponent,
      },
      {
        path: 'viewPayments',
        component: ViewPaymentsComponent,
      },
      {
        path: 'creditStatement',
        component: CreditStatementComponent,
      },
      {
        path: 'fuelCreditInvoiceDocument/:id',
        component: FuelCreditInvoiceDocumentComponent,
      },
      {
        path: 'fuelCreditInvoiceDocNew/:id',
        component: FuelCreditInvoiceDocNewComponent,
      },
      {
        path: 'fuelCreditInvoiceDoc/:id',
        component: FuelCreditInvoiceDocComponent,
      },
      {
        path: 'fuelCreditInvoiceVehicle/:id',
        component: FuelCreditInvoiceVehicleComponent,
      },
      {
        path: 'lubeTaxStatement/:id',
        component: LubeTaxStatementComponent,
      },
      {
        path: 'fuelCrInvoice/:id',
        component: FuelCrInvoiceComponent,
      },
      {
        path: 'bookLedger',
        component: BookLedgerComponent,
      },
      {
        path: 'savedInvoice',
        component: SavedInvoiceComponent,
      },
      {
        path: 'fuelCreditInvoiceManual/:id/:id1',
        component: FuelCreditInvoiceManualComponent,
      },
      {
        path: 'AddLubeTaxGstSale',
        component: AddLubeTaxGstSaleComponent,
      },
      {
        path: 'cashBillInvoice',
        component: CashBillInvoiceComponent,
      },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule
  ],
})
export class CreditModule { }
