import { DsrComponent } from './dsr/dsr.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { TankDsrComponent } from './tank-dsr/tank-dsr.component';
@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        FormsModule,
        InlineSVGModule,
        NgbTooltipModule,
        SharedModule,
        RouterModule.forChild([
            {
                path: 'dsrDetails',
                component: DsrComponent,
            },
            {
                path: 'tkDSRDetails',
                component: TankDsrComponent,
            },
        ]),
        WidgetsModule,
        ModalsModule,
        NgbNavModule
    ],
})
export class DSRModule { }
