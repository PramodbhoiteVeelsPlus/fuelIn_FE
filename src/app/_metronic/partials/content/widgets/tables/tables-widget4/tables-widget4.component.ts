import { Component, ViewChild } from '@angular/core';
import { ModalConfig } from 'src/app/_metronic/partials/layout/modals/modal.config';
import { Modal3Component } from 'src/app/_metronic/partials/layout/modals/modal3/modal3.component';

type Tabs =
  | 'kt_table_widget_4_tab_1'
  | 'kt_table_widget_4_tab_2'
  | 'kt_table_widget_4_tab_3';

@Component({
  selector: 'app-tables-widget4',
  templateUrl: './tables-widget4.component.html',
})
export class TablesWidget4Component {
  activeTab: Tabs = 'kt_table_widget_4_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  bankArray = [
    {
      AccountsignzyStatus: "",
      accountHolderName: "ONE",
      accountNumber: "11111111111111110000",
      bankDetailsId: 310,
      bankName: "ONE BANK",
      branchCode: "",
      branchName: "ONE",
      corporateId: "382",
      createdAt: "2021-12-24T09:10:53.000Z",
      dealerId: "40",
      deleteStatus: "FALSE",
      ifsc: "AAAAAA111111",
      micrCode: "",
      personId: "1215",
      phone: "1111111111",
      type: "SAVING",
      uniqueStatus: "FALSE",
      upiId: "one@one"
    },
    {
      AccountsignzyStatus: "",
      accountHolderName: "TWO",
      accountNumber: "22222222222222220000",
      bankDetailsId: 311,
      bankName: "TWO BANK",
      branchCode: "",
      branchName: "TWO",
      corporateId: "383",
      createdAt: "2021-12-25T10:15:53.000Z",
      dealerId: "41",
      deleteStatus: "FALSE",
      ifsc: "BBBBBB222222",
      micrCode: "",
      personId: "1216",
      phone: "2222222222",
      type: "CURRENT",
      uniqueStatus: "FALSE",
      upiId: "two@two"
    },
    {
      AccountsignzyStatus: "",
      accountHolderName: "THREE",
      accountNumber: "33333333333333330000",
      bankDetailsId: 312,
      bankName: "THREE BANK",
      branchCode: "",
      branchName: "THREE",
      corporateId: "384",
      createdAt: "2021-12-26T11:20:53.000Z",
      dealerId: "42",
      deleteStatus: "FALSE",
      ifsc: "CCCCCC333333",
      micrCode: "",
      personId: "1217",
      phone: "3333333333",
      type: "SAVING",
      uniqueStatus: "TRUE",
      upiId: "three@three"
    },
    {
      AccountsignzyStatus: "",
      accountHolderName: "FOUR",
      accountNumber: "44444444444444440000",
      bankDetailsId: 313,
      bankName: "FOUR BANK",
      branchCode: "",
      branchName: "FOUR",
      corporateId: "385",
      createdAt: "2021-12-27T12:25:53.000Z",
      dealerId: "43",
      deleteStatus: "FALSE",
      ifsc: "DDDDDD444444",
      micrCode: "",
      personId: "1218",
      phone: "4444444444",
      type: "CURRENT",
      uniqueStatus: "FALSE",
      upiId: "four@four"
    },
    {
      AccountsignzyStatus: "",
      accountHolderName: "FIVE",
      accountNumber: "55555555555555550000",
      bankDetailsId: 314,
      bankName: "FIVE BANK",
      branchCode: "",
      branchName: "FIVE",
      corporateId: "386",
      createdAt: "2021-12-28T13:30:53.000Z",
      dealerId: "44",
      deleteStatus: "FALSE",
      ifsc: "EEEEEE555555",
      micrCode: "",
      personId: "1219",
      phone: "5555555555",
      type: "SAVING",
      uniqueStatus: "FALSE",
      upiId: "five@five"
    }
  ];

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modal3Component: Modal3Component;
  constructor() { }

  async openModal() {
    return await this.modal3Component.open();
  }
}
