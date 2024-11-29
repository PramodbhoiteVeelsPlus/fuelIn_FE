
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

@NgModule({
    declarations: [InfraComponent, CashBillComponent, FuelPriceComponent],
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
        ]),
        WidgetsModule,
        ModalsModule,
        NgbNavModule
    ],
})
export class PumpModule { }
