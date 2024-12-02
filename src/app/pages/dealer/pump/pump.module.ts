
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { InfraComponent } from './infra/infra.component';
import { CashBillComponent } from './cash-bill/cash-bill.component';
import { FuelPriceComponent } from './fuel-price/fuel-price.component';
import { CreateCashBillComponent } from './create-cash-bill/create-cash-bill.component';
import { AddLubricantComponent } from './add-lubricant/add-lubricant.component';
import { AddLubricantPurchaseComponent } from './add-lubricant-purchase/add-lubricant-purchase.component';
import { ViewLubricantPurchaseComponent } from './view-lubricant-purchase/view-lubricant-purchase.component';
import { FtAccountInfoComponent } from './ft-account-info/ft-account-info.component';
import { FtAllTollTransactionComponent } from './ft-all-toll-transaction/ft-all-toll-transaction.component';
import { FtActiveVehicleComponent } from './ft-active-vehicle/ft-active-vehicle.component';
import { ActiveVehiclePdfComponent } from './active-vehicle-pdf/active-vehicle-pdf.component';
import { ActiveVehicleLQPdfComponent } from './active-vehicle-lqpdf/active-vehicle-lqpdf.component';
import { FtTollPlazaComponent } from './ft-toll-plaza/ft-toll-plaza.component';
import { FtTotalRechargeComponent } from './ft-total-recharge/ft-total-recharge.component';
import { FtVehicleSummaryComponent } from './ft-vehicle-summary/ft-vehicle-summary.component';

@NgModule({
    declarations: [
        InfraComponent, 
        CashBillComponent, 
        FuelPriceComponent, 
        CreateCashBillComponent, 
        AddLubricantComponent, 
        AddLubricantPurchaseComponent,
        ViewLubricantPurchaseComponent,
        FtAccountInfoComponent,
        FtAllTollTransactionComponent,
        FtActiveVehicleComponent,
        ActiveVehiclePdfComponent,
        ActiveVehicleLQPdfComponent,
        FtTollPlazaComponent,
        FtTotalRechargeComponent,
        FtVehicleSummaryComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        InlineSVGModule,
        NgbTooltipModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: 'infra',
                component: InfraComponent,
            },
            {
                path: 'cashBill',
                component: CashBillComponent,
            },
            {
                path: 'fuelPrice',
                component: FuelPriceComponent,
            },
            {
                path: 'createCashBill',
                component: CreateCashBillComponent,
            },
            {
                path: 'addLubricant',
                component: AddLubricantComponent,
            },
            {
                path: 'addLubricantPurchase',
                component: AddLubricantPurchaseComponent,
            },
            {
                path: 'viewLubricantPurchase',
                component: ViewLubricantPurchaseComponent,
            },
            {
                path: 'ftAccountInfo',
                component: FtAccountInfoComponent,
            },
            {
                path: 'ftAllTollTransaction',
                component: FtAllTollTransactionComponent,
            },
            {
                path: 'ftActiveVehicle',
                component: FtActiveVehicleComponent,
            },
            {
                path: 'activeVehiclePdf',
                component: ActiveVehiclePdfComponent,
            },
            {
                path: 'activeVehicleLQPdf',
                component: ActiveVehicleLQPdfComponent,
            },
            {
                path: 'ftTollPlaza',
                component: FtTollPlazaComponent,
            },
            {
                path: 'ftTotalRecharge',
                component: FtTotalRechargeComponent,
            },
            {
                path: 'ftVehicleSummary',
                component: FtVehicleSummaryComponent,
            },
        ]),
        WidgetsModule,
        ModalsModule,
        NgbNavModule
    ],
})
export class PumpModule { }
