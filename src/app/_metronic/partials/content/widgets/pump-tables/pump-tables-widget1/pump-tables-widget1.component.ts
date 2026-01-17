import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbModal, NgbDatepickerConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../../stats/stats.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { PumpTablesService } from '../pump-tables.services';
import { addLubePurchaseArray } from './addLubricantPurchase.model';
import { Adv_TablesService } from '../../advance-tables/adv_tables.services';

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
  selector: 'app-pump-tables-widget1',
  templateUrl: './pump-tables-widget1.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class PumpTablesWidget1Component implements OnInit {
  lubricantForm = new FormGroup({
    invoiceDate: new FormControl(''),
    companyName: new FormControl(''),
    invoiceNumber: new FormControl(''),
    vehicleNumber: new FormControl(''),
    companyGST: new FormControl(''),

  });
  fuelDealerId: any;
  dealerCorporateId: any;
  userId: any;
  acceesGroup: any;
  dealerMobile: any;
  dealerLoginVPId: any;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: string;
  isValid: boolean = false;
  dealerGSTStateCode: string;
  subGST: string;
  countAddArray: any = 1;
  addLubePurchaseArray: any = [];
  addLubePurchaseArrayData = new addLubePurchaseArray();
  lubricantList: any = [];
  gstDetails: any = [];
  userName: string;

  constructor(
    private modalService: NgbModal,
    private post: PumpTablesService,
    private post1: Adv_TablesService,
    private post2: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.userId = element.userId;
    this.acceesGroup = element.accessGroupId;
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.userName = element.firstName + ' ' + element.lastName;
    this.acceesGroup = element.accessGroupId;
    this.addLubePurchaseRow();
    this.getLubricants(this.fuelDealerId)
    this.getGSTDetails()
    this.cd.detectChanges()
  }

  checkalidation2() {
    if (this.lubricantForm.value.companyName && this.lubricantForm.value.invoiceDate) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  checkGST() {
    if (this.lubricantForm.value.companyGST) {
      if (this.dealerGSTStateCode == (this.lubricantForm.value.companyGST.toString()).slice(0, 2)) {
        this.subGST = 'CGST'
      } else {
        this.subGST = 'IGST'
      }
    } else {
      this.subGST = 'CGST'
    }
  }

  addLubePurchaseRow() {
    this.countAddArray = this.countAddArray + 1;
    this.addLubePurchaseArrayData = new addLubePurchaseArray();
    this.addLubePurchaseArray.push(this.addLubePurchaseArrayData);
  }

  getLubeDetails(id: any, i: any) {
    this.spinner.show();
    let data = {
      lubricantsId: id.target.value,
    }
    this.post1.getLubricantByIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data.length) {
            this.addLubePurchaseArray[i].lubricantsName = res.data[0].lubricantsName;
            this.addLubePurchaseArray[i].lubricantsUnit = res.data[0].lubricantsUnit;
            this.addLubePurchaseArray[i].lubricantsHsnSacNumber = res.data[0].lubricantsHsnSacNumber;
            this.spinner.hide();
          } else {
            alert("Error..!")
            this.spinner.hide();
          }
        }
      })
  }

  getLubricants(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getLubricantsPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.lubricantList = res.data;
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      })
  }

  checkalidation(i: any) {
    if (this.lubricantForm.value.companyName && this.lubricantForm.value.invoiceDate
      && this.addLubePurchaseArray[i].lubricantId && this.addLubePurchaseArray[i].quantity
      && this.addLubePurchaseArray[i].totalAmt) {
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  gstCalculation(i: any) {
    if (this.addLubePurchaseArray[i].taxableAmt && this.addLubePurchaseArray[i].taxPercentage) {
      this.spinner.show();
      this.addLubePurchaseArray[i].gstAmount = (Number(this.addLubePurchaseArray[i].taxPercentage) * (this.addLubePurchaseArray[i].taxableAmt)) / 100;
      this.addLubePurchaseArray[i].totalAmt = Number(Number(this.addLubePurchaseArray[i].taxableAmt) + Number(this.addLubePurchaseArray[i].gstAmount)).toFixed(2);
      if (this.subGST == 'CGST') {
        this.addLubePurchaseArray[i].cGST = Number(Number(this.addLubePurchaseArray[i].taxPercentage) / 2).toFixed(2);
        this.addLubePurchaseArray[i].sGST = Number(Number(this.addLubePurchaseArray[i].taxPercentage) / 2).toFixed(2);
        this.addLubePurchaseArray[i].iGST = 0;
        this.spinner.hide();
        this.checkalidation(i)
      } else {
        this.addLubePurchaseArray[i].cGST = 0;
        this.addLubePurchaseArray[i].sGST = 0;
        this.addLubePurchaseArray[i].iGST = Number(this.addLubePurchaseArray[i].taxPercentage).toFixed(2);
        this.spinner.hide();
        this.checkalidation(i)
      }
    } else {
      this.checkalidation(i)
      this.spinner.hide();
    }
  }

  gstCalculation1(i: any) {
    if (this.addLubePurchaseArray[i].taxableAmt) {
      this.spinner.show();
      this.addLubePurchaseArray[i].gstAmount = (Number(this.addLubePurchaseArray[i].taxPercentage) * (this.addLubePurchaseArray[i].taxableAmt)) / 100;
      this.addLubePurchaseArray[i].totalAmt = Number(Number(this.addLubePurchaseArray[i].taxableAmt) + Number(this.addLubePurchaseArray[i].gstAmount)).toFixed(2);
      if (this.subGST == 'CGST') {
        this.addLubePurchaseArray[i].cGST = Number(Number(this.addLubePurchaseArray[i].taxPercentage) / 2).toFixed(2);
        this.addLubePurchaseArray[i].sGST = Number(Number(this.addLubePurchaseArray[i].taxPercentage) / 2).toFixed(2);
        this.addLubePurchaseArray[i].iGST = 0;
        this.spinner.hide();
        this.checkalidation(i)
      } else {
        this.addLubePurchaseArray[i].cGST = 0;
        this.addLubePurchaseArray[i].sGST = 0;
        this.addLubePurchaseArray[i].iGST = Number(this.addLubePurchaseArray[i].taxPercentage).toFixed(2);
        this.spinner.hide();
        this.checkalidation(i)
      }
    } else {
      alert("Please Enter Taxable Amount..");
      this.addLubePurchaseArray[i].taxPercentage = "";
      this.checkalidation(i)
      this.spinner.hide();
    }
  }

  getGSTDetails() {
    let data = {
    }
    this.post2.getGSTDataPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.gstDetails = res.data;
          } else {
            this.gstDetails.length = 0;
          }
        }
        else {
        }
      })
  }

  addLubePurchaseRows(i: any) {
    this.isValid = false;
    if (this.lubricantForm.value.companyName && this.lubricantForm.value.invoiceDate) {
      if (this.addLubePurchaseArray[i].lubricantId && this.addLubePurchaseArray[i].quantity
        && this.addLubePurchaseArray[i].totalAmt) {
        this.countAddArray = this.countAddArray + 1;
        this.addLubePurchaseArrayData = new addLubePurchaseArray();
        this.addLubePurchaseArray.push(this.addLubePurchaseArrayData);
      } else {
        alert("Please Select Product, Enter Quantity & Select Tax..!")
        this.isValid = false;
      }
    } else {
      alert("Please Enter Company Name & Select Date..!")
    }
  }

  removeLubePurchaseRow(i: any) {
    this.addLubePurchaseArray.splice(i, 1);
    this.countAddArray = this.countAddArray - 1;
    this.isValid = true;
  }

  submitLubePurchase() {
    if (this.fuelDealerId) {
      this.spinner.show();
      let data = {
        createdBy: this.userName,
        fuelDealerId: this.fuelDealerId,
        lubricantStockCompanyName: this.lubricantForm.value.companyName,
        lubricantStockInvDate: moment(this.lubricantForm.value.invoiceDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        lubricantStockInvNumber: this.lubricantForm.value.invoiceNumber,
        lubricantStockVehicleNumber: this.lubricantForm.value.vehicleNumber,
        lubricantStockCompanyGST: this.lubricantForm.value.companyGST,
        addArray: this.addLubePurchaseArray,
      }
      this.post.addLubricantPurchasePOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            alert("Lubricant Stock Details Added Successfully..!");
            this.clearLubePurchase();
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            alert("Error to Add Details..!");
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
    } else {
      alert("Error..!")
    }
  }

  clearLubePurchase() {
    this.addLubePurchaseArray.length = 0;
    this.lubricantForm.reset();
    this.addLubePurchaseRow();
  }
}

