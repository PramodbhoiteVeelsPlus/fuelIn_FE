import { Component, OnInit, Injectable, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Adv_TablesService } from '../adv_tables.services';
import { ExcelService } from 'src/app/pages/excel.service';
import { lubricants } from './addLubricants.model';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';
  fromModel(value: string | null): NgbDateStruct | null {
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
  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}
/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';
  parse(value: string): NgbDateStruct | null {
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
  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-advance-tables-widget14',
  templateUrl: './advance-tables-widget14.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class AdvanceTablesWidget14Component {

  isFastagReg: boolean = false;
  phoneSearch: any;
  dateCode: any;
  monthCode: number;
  monthAlpha: string;
  yearCode: any;
  veelsPlusCorporateId: string;
  stateCode: string;
  veelsPlusBranchId: string;
  veelsUserTypePlusId: string;
  userRole: string = "2";
  businessTypeCode: string;
  veelsPlusCorporateID: any;
  personId: any;
  userId: any;
  addressId: any;
  dealerLoginVPId: any;
  customerIdforReg: any;
  kycId: any;
  corporateIdforReg: any;
  veelsplususerId: any;
  isNumberFound: boolean = false;
  searchedCorpId: any;
  ftcorpId: any;
  isActive: any;
  thrLimit: any;
  personIdLoginUser: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;


  searchBox: FormControl = new FormControl();
  customerLength: any = [];
  searchTerm: any = "";
  customerData: any = [];
  customerDetail: any = [];
  customerDetailData: any = [];
  isAdd: boolean = false;
  corpWalletEntityId: any;
  corpWalletCompanyName: any;
  isUpdate: boolean;
  corpWalletLQId: any;
  corpWalletAccNo: any;
  corpWalletIFSC: any;
  corpWalletUPI: any;
  pumpCity: any;
  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  managerName: string;
  dealerLoginId: any;
  companyName: any;
  oilCompanyName: any;
  brandName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  filterForm: any;
  selected: string;
  dealerAccess: boolean;
  headerName1: any;
  headerName3: string;
  GSTNumber: string;
  countLube: any = 1;
  addArrayLube: any = [];
  CreditRequestLube = new lubricants();
  isShowLubeSubmit: boolean = false;
  createdBy: string;
  lubricantList: any = [];

  constructor(private excelService: ExcelService, private modalService: NgbModal,
    private spinner: NgxSpinnerService, private post: Adv_TablesService,
    private cd: ChangeDetectorRef,) {
    this.searchBox.valueChanges

  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.accessGroup = element.accessGroupId;
    // this.managerVPPersonId = element.veelsPlusId
    // this.managerPersonId = element.personId
    this.managerName = element.firstName + ' ' + element.lastName
    if (element.accessGroupId == 12 || element.accessGroupId == 14) {
      this.createdBy = element.firstName + ' ' + element.lastName
      this.pumpCity = dealerData.city
      this.userId = element.userId;
      this.dealerLoginId = element.veelsPlusCorporateID;
      this.companyName = dealerData.companyName
      this.oilCompanyName = dealerData.brandName
      this.brandName = dealerData.brandName
      this.state = dealerData.state
      this.pin = dealerData.pin
      this.city = dealerData.city
      this.phone1 = dealerData.hostPhone
      if (element.accessGroupId == 12 || element.accessGroupId == 14) {
        this.dealerAccess = true
      }
      this.headerName1 = this.companyName;
      // this.headerName2 = res.data[0].address1+', '+res.data[0].address2+', '+res.data[0].city;
      this.headerName3 = this.state + '-' + this.pin + '  ' + "GST: " + this.GSTNumber;

    }
    this.addFormRequestLube();
    this.cd.detectChanges()
  }

  addFormRequestLube1(i: any) {
    this.countLube = this.countLube + 1;

    if (this.countLube < 12) {
      if (this.addArrayLube[i].lubricantsName && this.addArrayLube[i].lubricantsUnit
        && this.addArrayLube[i].lubricantsHsnSacNumber) {
        this.isShowLubeSubmit = false;
        this.CreditRequestLube = new lubricants();
        this.addArrayLube.push(this.CreditRequestLube);
      } else {
        alert("please enter valid details..!");
        this.isShowLubeSubmit = false;
      }
      this.cd.detectChanges()
    }
    else {
      this.countLube = 11;
      alert("Please save 10 entries, before adding more entries..!")
      this.cd.detectChanges()
    }
  }

  checkValidationLubricant(i: any) {
    if (this.addArrayLube[i].lubricantsName && this.addArrayLube[i].lubricantsUnit
      && this.addArrayLube[i].lubricantsHsnSacNumber) {
      this.isShowLubeSubmit = true;
      this.addArrayLube[i + 1].lubricantsUnit = ''
    } else {
      this.isShowLubeSubmit = false;
    }
  }

  removeFormRequestLube(i: number) {
    this.addArrayLube.splice(i, 1);
    this.countLube = this.countLube - 1;
  }

  addLubricants() {
    this.spinner.show()
    let data = {
      fuelDealerId: this.fuelDealerId,
      addArray: this.addArrayLube,
      lubricantsCreatedBy: this.createdBy,

    }
    this.post.addLubricantPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          alert("Lubricant added successfully..!")
          this.getLubricants(this.fuelDealerId);
          this.addArrayLube.length = 0;
          this.addFormRequestLube();
          this.isShowLubeSubmit = false;
          this.spinner.hide();
        } else {
          alert("Error to Add..!")
          this.spinner.hide();
        }
      })
  }

  addFormRequestLube() {

    this.countLube = this.countLube + 1;
    this.CreditRequestLube = new lubricants();
    this.addArrayLube.push(this.CreditRequestLube);
    this.addArrayLube[0].lubricantsUnit = ''
  }

  lubeClear() {
    this.addArrayLube.length = 0
    this.addFormRequestLube();
  }

  getLubricants(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getLubricantsPOST(data)
      .subscribe((res: { status: string; data: any; }) => {
        if (res.status == 'OK') {
          this.lubricantList = res.data;
        }
      })
  }
}
