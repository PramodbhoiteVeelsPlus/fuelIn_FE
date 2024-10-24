
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalsModule, WidgetsModule } from '../../_metronic/partials';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { DeleteModalComponent } from './delete-modal.component';
import { DeleteCrPaymentComponent } from './delete-cr-payment/delete-cr-payment.component';
import { DeleteFuelPriceComponent } from './delete-fuel-price/delete-fuel-price.component';
import { DeleteFastagComponent } from './delete-fastag/delete-fastag.component';
import { DeleteDsrComponent } from './delete-dsr/delete-dsr.component';

@NgModule({
  declarations: [
    DeleteModalComponent,
    DeleteCrPaymentComponent,
    DeleteFuelPriceComponent,
    DeleteFastagComponent,
    DeleteDsrComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        {
            path: '',
            component: DeleteModalComponent,
        },
        {
            path: 'deleteCrPayment',
            component: DeleteCrPaymentComponent,
        },
        {
            path: 'deleteFuelPrice',
            component: DeleteFuelPriceComponent,
        },
        {
            path: 'deleteFastag',
            component: DeleteFastagComponent,
        },
        {
            path: 'deleteDsr',
            component: DeleteDsrComponent,
        },
    ]),
    WidgetsModule,
    ModalsModule,
    NgbNavModule,
],
  exports: [
    
  ]
})
export class deleteModalModule { }
