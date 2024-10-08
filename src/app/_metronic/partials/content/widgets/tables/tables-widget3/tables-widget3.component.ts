import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalConfig } from 'src/app/_metronic/partials/layout/modals/modal.config';
import { Modal2Component } from 'src/app/_metronic/partials/layout/modals/modal2/modal2.component';

@Component({
  selector: 'app-tables-widget3',
  templateUrl: './tables-widget3.component.html',
})
export class TablesWidget3Component implements OnInit {
   
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modal2Component: Modal2Component;
  constructor() { }
  staffArray = [
    {
      accessGroupId:12,
      addressId:873,
      city:"PUNE",
      dealerMapStatus:"MAPPED",
      designation:"MANAGER",
      firstName:"REALMEOW",
      fuelDealerStaffId:12,
      lastName:"",
      personId:1215,
      phone1:"9765592000",
      salary:"NOT ADDED",
      userId:"725",
    },
    {
      accessGroupId:14,
      addressId:873,
      city:"PUNE",
      dealerMapStatus:"MAPPED",
      designation:"MANAGER",
      firstName:"REALMEOW",
      fuelDealerStaffId:12,
      lastName:"",
      personId:1215,
      phone1:"9765592000",
      salary:"10000",
      userId:"725",
    },
    {
      accessGroupId:13,
      addressId:873,
      city:"PUNE",
      dealerMapStatus:"MAPPED",
      designation:"OPERATOR",
      firstName:"OPERATOR1",
      fuelDealerStaffId:12,
      lastName:"",
      personId:1215,
      phone1:"9765592000",
      salary:"8000",
      userId:"725",
    },
    {
      accessGroupId:13,
      addressId:873,
      city:"PUNE",
      dealerMapStatus:"MAPPED",
      designation:"OPERATOR",
      firstName:"OPERATOR2",
      fuelDealerStaffId:12,
      lastName:"",
      personId:1215,
      phone1:"9765592000",
      salary:"5000",
      userId:"725",
    }
  ];
  ngOnInit(): void { }
  
  async openModal() {
    return await this.modal2Component.open();
  }
}
