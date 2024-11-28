
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { OilCompanyPurchaseComponent } from './oil-company-purchase/oil-company-purchase.component';
import { VariationPercentageComponent } from './variation-percentage/variation-percentage.component';
import { ViewOilCompanyPurchaseComponent } from './view-oil-company-purchase/view-oil-company-purchase.component';

@NgModule({
    declarations: [OilCompanyPurchaseComponent, VariationPercentageComponent, ViewOilCompanyPurchaseComponent],
    imports: [
        CommonModule,
        FormsModule,
        InlineSVGModule,
        NgbTooltipModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: 'oilCompanyPurchase',
                component: OilCompanyPurchaseComponent,
            },
            {
                path: 'variationPercentage',
                component: VariationPercentageComponent,
            },
            {
                path: 'viewOilCompanyPurchase',
                component: ViewOilCompanyPurchaseComponent,
            },
        ]),
        WidgetsModule,
        ModalsModule,
        NgbNavModule
    ],
})
export class InventoryModule { }
