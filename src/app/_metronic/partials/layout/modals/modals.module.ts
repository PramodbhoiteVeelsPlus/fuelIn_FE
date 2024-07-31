import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {InlineSVGModule} from 'ng-inline-svg-2';
import {InviteUsersModalComponent} from './invite-users-modal/invite-users-modal.component';
import {MainModalComponent} from './main-modal/main-modal.component';
import {UpgradePlanModalComponent} from './upgrade-plan-modal/upgrade-plan-modal.component';
import {ModalComponent} from './modal/modal.component';
import {NgbDatepickerModule, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {SharedModule} from "../../../shared/shared.module";
import { FormsModule } from '@angular/forms';
import {Modal2Component} from './modal2/modal2.component';
import {Modal3Component} from './modal3/modal3.component';
import {Modal4Component} from './modal4/modal4.component';

@NgModule({
  declarations: [
    InviteUsersModalComponent,
    MainModalComponent,
    UpgradePlanModalComponent,
    ModalComponent,
    Modal2Component,
    Modal3Component,
    Modal4Component,
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    RouterModule,
    NgbModalModule,
    SharedModule,
    FormsModule,
    NgbDatepickerModule,
  ],
  exports: [
    InviteUsersModalComponent,
    MainModalComponent,
    UpgradePlanModalComponent,
    ModalComponent,
    Modal2Component,
    Modal3Component,
    Modal4Component,
  ],
})
export class ModalsModule {
}
