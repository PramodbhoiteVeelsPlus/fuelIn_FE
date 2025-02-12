import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { BaseTablesService } from '../base-tables.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { WidgetService } from '../../widgets.services';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<any> {

  readonly DELIMITER = '-';

  fromModel(value: any | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): any | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: any): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): any {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-base-tables-widget14',
  templateUrl: './base-tables-widget14.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class BaseTablesWidget14Component implements OnInit {
  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  acceesGroup: number;
  dealerView: boolean;
  ownerName: string;
  dealerMobile: any;
  dealerLoginVPId: any;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: string;
  companyName: any;
  oilCompanyName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  headerName1: any;
  headerName3: string;
  GSTNumber: string;
  statementInvoice: boolean;
  customerName: any;
  statementStartDate: any;
  statementEndDate: any;
  isCustomer: string;
  address2: any;
  address1: any;
  mobile: any;
  FCInvoiceListDetails: any = [];
  totalAmount: any = 0;
  payableAmount: any = 0;
  fuelInvoicTotalPaymentAmount: any = 0;
  isActiveCustomer: boolean = false;
  startDate: any;
  endDate: any;
  finalTotal: any;
  advanceCust: any;
  allActiveCreditAccByDealer: any = [];
  totalpurchase: any = 0;
  totalpayment: any = 0;
  netTotal: any = 0;
  advance: any = 0;
  netOut: any = 0;
  customerId: any;


  constructor(
    private post: BaseTablesService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private post1: WidgetService,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private router: Router,) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.accessGroup = element.accessGroupId;
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.managerName = element.firstName + ' ' + element.lastName
    this.acceesGroup = element.accessGroupId;
    this.companyName = dealerData.companyName
    this.oilCompanyName = dealerData.brandName
    this.state = dealerData.state
    this.pin = dealerData.pin
    this.city = dealerData.city
    this.mobile = dealerData.hostPhone
    this.address1 = dealerData.address1
    this.address2 = dealerData.address2
    this.GSTNumber = dealerData.GSTNumber
    if (!this.post.setRouteForActiveArray.length) {
      this.statementInvoice = true;
      this.FCInvoiceListDetails = (this.post.FCInvoiceListDetails).reverse();
      if (this.post.isCustomer == 'TRUE') {
        this.customerName = this.FCInvoiceListDetails[0].toName;
      }
      this.statementStartDate = this.post.activeStartDate;
      this.statementEndDate = this.post.activeEndDate;

      this.isCustomer = this.post.isCustomer;
      this.getTotalOfAmount(this.post.FCInvoiceListDetails);
    } else {
      this.statementInvoice = false;
    }

    if (this.post.setRouteForActiveArray.length) {
      if (this.post.setRouteForActiveArray[0].activeRoute == 'activeCustomer') {
        this.isActiveCustomer = true;
        this.startDate = this.post.setRouteForActiveArray[0].activeStartDate;
        this.endDate = this.post.setRouteForActiveArray[0].activeEndDate;
        this.finalTotal = this.post.setRouteForActiveArray[0].crOutstanding2;
        this.advanceCust = this.post.setRouteForActiveArray[0].advance;
        this.allActiveCreditAccByDealer = this.post.setRouteForActiveArray[0].allActiveCreditAccByDealer

        this.allActiveCreditAccByDealer.map((purCal: { totalPurchaseAmt: any; totalPaymentAmt: any; netOS: any; totalOutstanding: any; }) => {
          this.totalpurchase = this.totalpurchase + Number(purCal.totalPurchaseAmt)
          this.totalpayment = this.totalpayment + Number(purCal.totalPaymentAmt)
          this.netTotal = this.netTotal + Number(purCal.netOS)
          if (Number(purCal.netOS) < 0) {
            this.advance = this.advance + Number(purCal.netOS)
          }
          if ((Number(purCal.totalOutstanding)) >= 0) {
            this.netOut = this.netOut + (Number(purCal.totalOutstanding))
          }
        })
      } else {
        this.isActiveCustomer = false;
        this.allActiveCreditAccByDealer = this.post.setRouteForActiveArray[0].allActiveCreditAccByDealer
        this.allActiveCreditAccByDealer.map((purCal: { totalPurchaseAmt: any; totalPaymentAmt: any; totalCRAmt: any; totalDiscount: any; totalInvPaidAmt: any; previousOutstand: any; }) => {

          this.totalpurchase = this.totalpurchase + Number(purCal.totalPurchaseAmt)
          this.totalpayment = this.totalpayment + Number(purCal.totalPaymentAmt)
          if (((Number(purCal.totalCRAmt) - Number(purCal.totalDiscount) - Number(purCal.totalInvPaidAmt)) + Number(purCal.previousOutstand)) >= 0) {
            this.netOut = this.netOut + ((Number(purCal.totalCRAmt) - Number(purCal.totalDiscount) - Number(purCal.totalInvPaidAmt)) + Number(purCal.previousOutstand))
          }
        })
      }
    }

    this.headerName1 = dealerData.companyName;
    // this.headerName2 = res.data[0].address1+', '+res.data[0].address2+', '+res.data[0].city;
    this.headerName3 = this.state + '-' + this.pin + '  ' + "GST: " + this.GSTNumber;
    
    if(element.accessGroupId == '14'){
      var managerData = JSON.parse(localStorage.getItem('managerData') || '{}');
      this.customerId = managerData.customerId;
      this.searchDealerBycustomerId(this.customerId)
    }
    this.cd.detectChanges()
  }

  getTotalOfAmount(FCInvoiceListDetails: any) {
    FCInvoiceListDetails.map((res: { invoiceOf: string; totalAmount: any; fuelInvoicTotalPaymentAmount: any; fuelInvoicePreviousStatement: any; }) => {
      if (res.invoiceOf == "LUBE TAX") {
        this.totalAmount = this.totalAmount + Number(res.totalAmount)
        this.payableAmount = this.payableAmount + Number(res.totalAmount)
        console.log("amt", this.totalAmount, this.payableAmount)
      } else {
        this.totalAmount = this.totalAmount + Number(res.totalAmount)
        this.fuelInvoicTotalPaymentAmount = this.fuelInvoicTotalPaymentAmount + Number(res.fuelInvoicTotalPaymentAmount)
        this.payableAmount = this.payableAmount + Number(res.totalAmount) - Number(res.fuelInvoicTotalPaymentAmount) + Number(res.fuelInvoicePreviousStatement)
        console.log("amt", this.totalAmount, this.payableAmount)
      }
    })
  }

  searchDealerBycustomerId(customerId: any) {    
    let data = {
      customerId: customerId,
    };
    this.post1.getCustomerByCustomerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {         
          this.companyName = res.data[0].companyName;
          this.oilCompanyName = res.data[0].brandName;
          this.address1 = res.data[0].address1;
          this.address2 = res.data[0].address2;
          this.city = res.data[0].city;
          this.state = res.data[0].state;
          this.pin = res.data[0].pin;
          this.GSTNumber = res.data[0].GSTNumber; 
          this.mobile = res.data[0].hostPhone;        
          
        } else {
          this.spinner.hide();
        }
      });
}
}
