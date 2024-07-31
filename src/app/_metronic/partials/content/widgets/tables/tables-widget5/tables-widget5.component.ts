import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalConfig } from 'src/app/_metronic/partials/layout/modals/modal.config';
import { Modal4Component } from 'src/app/_metronic/partials/layout/modals/modal4/modal4.component';

type Tabs =
  | 'kt_table_widget_5_tab_1'
  | 'kt_table_widget_5_tab_2'
  | 'kt_table_widget_5_tab_3';

@Component({
  selector: 'app-tables-widget5',
  templateUrl: './tables-widget5.component.html',
})
export class TablesWidget5Component implements OnInit {

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };

  @ViewChild('modal') private modal4Component: Modal4Component;
  constructor() { }

  posArray = [
    {
      AccountsignzyStatus: "",
      accountHolderName: "ONE",
      accountNumber: "11111111111111110000",
      attachedAccountId: "310",
      attachedBankName: "ONE BANK-11111111111111110000",
      bankDetailsId: 310,
      bankName: "ONE BANK",
      branchCode: "",
      branchName: "ONE",
      cancelStatus: "FALSE",
      corporateId: "382",
      createdAt: "2021-12-24T09:10:53.000Z",
      dealerId: "40",
      deleteStatus: "FALSE",
      fuelDealerId: "40",
      fuelTerminalsId: 440,
      ifsc: "AAAAAA111111",
      micrCode: "",
      personId: "1215",
      phone: "1111111111",
      terminalName: "TEST",
      terminalStatus: "MAPPED",
      terminalType: "BANK CARD",
      type: "SAVING",
      uniqueStatus: "FALSE",
      upiId: "one@one"
    },
    {
      AccountsignzyStatus: "",
      accountHolderName: "TWO",
      accountNumber: "22222222222222220000",
      attachedAccountId: "320",
      attachedBankName: "TWO BANK-22222222222222220000",
      bankDetailsId: 320,
      bankName: "TWO BANK",
      branchCode: "",
      branchName: "TWO",
      cancelStatus: "FALSE",
      corporateId: "383",
      createdAt: "2021-12-25T09:10:53.000Z",
      dealerId: "41",
      deleteStatus: "FALSE",
      fuelDealerId: "41",
      fuelTerminalsId: 441,
      ifsc: "BBBBBB222222",
      micrCode: "",
      personId: "1216",
      phone: "2222222222",
      terminalName: "TEST2",
      terminalStatus: "MAPPED",
      terminalType: "BANK CARD",
      type: "CURRENT",
      uniqueStatus: "FALSE",
      upiId: "two@two"
    },
    {
      AccountsignzyStatus: "",
      accountHolderName: "THREE",
      accountNumber: "33333333333333330000",
      attachedAccountId: "330",
      attachedBankName: "THREE BANK-33333333333333330000",
      bankDetailsId: 330,
      bankName: "THREE BANK",
      branchCode: "",
      branchName: "THREE",
      cancelStatus: "FALSE",
      corporateId: "384",
      createdAt: "2021-12-26T09:10:53.000Z",
      dealerId: "42",
      deleteStatus: "FALSE",
      fuelDealerId: "42",
      fuelTerminalsId: 442,
      ifsc: "CCCCCC333333",
      micrCode: "",
      personId: "1217",
      phone: "3333333333",
      terminalName: "TEST3",
      terminalStatus: "UNMAPPED",
      terminalType: "BANK CARD",
      type: "SAVING",
      uniqueStatus: "FALSE",
      upiId: "three@three"
    },
    {
      AccountsignzyStatus: "",
      accountHolderName: "FOUR",
      accountNumber: "44444444444444440000",
      attachedAccountId: "340",
      attachedBankName: "FOUR BANK-44444444444444440000",
      bankDetailsId: 340,
      bankName: "FOUR BANK",
      branchCode: "",
      branchName: "FOUR",
      cancelStatus: "FALSE",
      corporateId: "385",
      createdAt: "2021-12-27T09:10:53.000Z",
      dealerId: "43",
      deleteStatus: "FALSE",
      fuelDealerId: "43",
      fuelTerminalsId: 443,
      ifsc: "DDDDDD444444",
      micrCode: "",
      personId: "1218",
      phone: "4444444444",
      terminalName: "TEST4",
      terminalStatus: "MAPPED",
      terminalType: "BANK CARD",
      type: "CURRENT",
      uniqueStatus: "FALSE",
      upiId: "four@four"
    },
    {
      AccountsignzyStatus: "",
      accountHolderName: "FIVE",
      accountNumber: "55555555555555550000",
      attachedAccountId: "350",
      attachedBankName: "FIVE BANK-55555555555555550000",
      bankDetailsId: 350,
      bankName: "FIVE BANK",
      branchCode: "",
      branchName: "FIVE",
      cancelStatus: "FALSE",
      corporateId: "386",
      createdAt: "2021-12-28T09:10:53.000Z",
      dealerId: "44",
      deleteStatus: "FALSE",
      fuelDealerId: "44",
      fuelTerminalsId: 444,
      ifsc: "EEEEEE555555",
      micrCode: "",
      personId: "1219",
      phone: "5555555555",
      terminalName: "TEST5",
      terminalStatus: "MAPPED",
      terminalType: "BANK CARD",
      type: "SAVING",
      uniqueStatus: "FALSE",
      upiId: "five@five"
    }
  ];

  ngOnInit(): void { }

  async openModal() {
    return await this.modal4Component.open();
  }
}
