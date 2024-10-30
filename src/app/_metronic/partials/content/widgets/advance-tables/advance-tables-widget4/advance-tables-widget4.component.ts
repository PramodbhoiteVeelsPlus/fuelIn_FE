import { Component, OnInit, Injectable, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Adv_TablesService } from '../adv_tables.services';
import { ExcelService } from 'src/app/pages/excel.service';

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

type Tabs =
  | 'kt_advance-tables_widget_4_tab_1'
  | 'kt_advance-tables_widget_4_tab_2'
  | 'kt_advance-tables_widget_4_tab_3';

@Component({
  selector: 'app-advance-tables-widget4',
  templateUrl: './advance-tables-widget4.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class AdvanceTablesWidget4Component {

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
  GSTNumber1: string;
  city1: string;
  state1: string;
  pin1: string;
  email1new: string;
  isActive1: string;
  thrLimit1: string;
  vehicleSum1: string;
  customerId1: string;
  searchBox1: FormControl = new FormControl();
  searchBox2: FormControl = new FormControl();

  searchTerm1: any = "";
  searchTerm2: any = "";

  headOffice: any;
  customerId: any;
  onBoardStatus: any;

  veelsPlusPersonId: any;
  email11: string;
  onBoardingStatus1: string;
  payCorpStatus1: string;
  corporateId1: string;
  userId1: string;
  isEmail1: string;
  isSMS1: string;
  kycDataExcel: any = [];
  customerDetailDataList: any = [];
  customerDetailDataLength: any = [];
  isShow: boolean = false;
  kycData: any = [];
  kycDataOnboarding: any = [];
  kycRawData: any = [];
  rowNumber: any;
  show: boolean = false;
  modalReference: any;
  closeResult: string;
  waive: boolean = false;

  constructor(private excelService: ExcelService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal, 
    private post: Adv_TablesService,
    private cd: ChangeDetectorRef,) {
  }

  activeTab: Tabs = 'kt_advance-tables_widget_4_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '');
    this.personIdLoginUser = element.personId
    this.veelsPlusPersonId = element.veelsPlusId;
    this.kycDetails();
  }

  kycDetails() {
    this.post.getkycDetails()
      .subscribe(res => {
        this.kycRawData = res;
        this.kycRawData.data.map(
          (detail: any) => {
            this.kycData.push(detail)
            this.kycDataOnboarding.push(detail)
          })
          this.cd.detectChanges();
      })
  }

  search1() {
    let term = this.searchTerm1;
    this.kycData = this.kycDataOnboarding.filter(function (res: any) {
      return res.veelsPlusId.indexOf(term) >= 0;
    });
    if (this.kycData.length == 0) {
      term = this.searchTerm1;
      this.kycData = this.kycDataOnboarding.filter(function (res: any) {
        return res.veelsPlusId.indexOf(term) >= 0;
      });
    }
    if (this.kycData.length == 0) {
      term = this.searchTerm1;
      this.kycData = this.kycDataOnboarding.filter(function (res: any) {
        return res.firstName.indexOf(term) >= 0;
      });
    }
    if (this.kycData.length == 0) {
      term = this.searchTerm1;
      this.kycData = this.kycDataOnboarding.filter(function (res: any) {
        return res.lastName.indexOf(term) >= 0;
      });
    }
    if (this.kycData.length == 0) {
      term = this.searchTerm1;
      this.kycData = this.kycDataOnboarding.filter(function (res: any) {
        return res.hostPhone.indexOf(term) >= 0;
      });
    }
    if (this.kycData.length == 0) {
      term = this.searchTerm1;
      this.kycData = this.kycDataOnboarding.filter(function (res: any) {
        return res.companyName.indexOf(term) >= 0;
      });
    }
    if (this.kycData.length == 0) {
      term = this.searchTerm1;
      this.kycData = this.kycDataOnboarding.filter(function (res: any) {
        return res.onBoardingStatus.indexOf(term) >= 0;
      });
    }
  }

  downloadExcelCustomerOnboardList() {
    this.kycDataExcel.length = 0
    this.kycData.map((res: any) => {
      let json = {
        VeelsID: res.veelsPlusId,
        MappedDate: moment(res.corporateCreatedAt).format("DD-MM-YYYY"),
        CompanyName: res.companyName,
        OwnerName: res.firstName + ' ' + res.lastName,
        ContactNumber: res.hostPhone,
        Email: res.email1,
        GST: res.GSTNumber,
        AddressLine1: res.address1,
        AddressLine2: res.address2,
        City: res.city,
        State: res.state,
        Pin: res.pin,
        OnboardingStatus: res.onBoardingStatus,
        PaymentStatus: res.payCorpStatus,
        SMSStatus: res.isSMS,
        MailStatus: res.isEmail,
      };
      this.kycDataExcel.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.kycDataExcel,
      "CustomerOnboardList"
    );
  }


  changeValue1(i: any, email1: string, onBoardingStatus: string, payCorpStatus: string, corporateId: string, userId: string, isSMS: string, isEmail: string) {
    this.email11 = ''
    this.onBoardingStatus1 = ''
    this.payCorpStatus1 = ''
    this.corporateId1 = ''
    this.userId1 = ''
    this.isSMS1 = ''
    this.isEmail1 = ''
    if (i == this.rowNumber) {
      this.rowNumber = ''
      if (this.show == true) {
        this.show = false;
      } else {
        this.show = true;
        this.rowNumber = i
        this.email11 = email1
        this.onBoardingStatus1 = onBoardingStatus
        this.payCorpStatus1 = payCorpStatus
        this.corporateId1 = corporateId
        this.userId1 = userId
        this.isSMS1 = isSMS
        this.isEmail1 = isEmail
      }
    } else {
      this.rowNumber = i
      this.show = true;
      this.email11 = email1
      this.onBoardingStatus1 = onBoardingStatus
      this.payCorpStatus1 = payCorpStatus
      this.corporateId1 = corporateId
      this.userId1 = userId
      this.isSMS1 = isSMS
      this.isEmail1 = isEmail
    }
  }

  open(contentOnBoard: any, ele: any, userId: any, personId: any,) {
    this.onBoardStatus = ele;
    this.userId = userId;
    this.personId = personId;
    this.modalReference = this.modalService.open(contentOnBoard, { size: 'sm' })
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getDismissReason(reason: any) {
    throw new Error('Method not implemented.');
  }

  onBoard() {
    let data = {
      userId: this.userId,
      onBoardingStatus: this.onBoardStatus,
      approvedBy: this.veelsPlusPersonId,
      personId: this.personId,
      headOffice: this.headOffice,
      customerId: this.customerId,
    }
    this.post.userOnBoard(data)
      .subscribe(res => {
        alert(res.msg)
        this.modalReference.close('close')
        this.kycDetails();
      })
  }

  waiveOffPaymentEnable(status: any, corporateId: any, userId: any, paymentuserstatus: any) {
    var paymentStatus = "";
    if (paymentuserstatus == "unpaid") {
      if (status.target.checked) {
        paymentStatus = "waiveOff";
        let data = {
          paymentStatus: paymentStatus,
          userId: userId,
          corporateId: corporateId
        }
        this.post.waiveoffPaymentUpdateURLPost(data)
          .subscribe(res => {
            if (res) {
              alert(res.msg)
              this.kycDetails();
            }
          })
      }
    } else if (paymentuserstatus == "waiveOff") {
      paymentStatus = "unpaid";
      let data = {
        paymentStatus: paymentStatus,
        userId: userId,
        corporateId: corporateId
      }
      this.post.waiveoffPaymentUpdateURLPost(data)
        .subscribe(res => {
          if (res) {
            alert(res.msg)
            this.kycDetails();
          }
        })
    } else {
      alert("Please Select unpaid or WaiveOff Status");
      this.kycDetails();
    }
  }

  sMSEnableTransport(status: any, corporateId: any, userId: any, smsStatus: any) {
    if (smsStatus == "TRUE") {
      if (status.target.checked) {
        smsStatus = "FALSE";
        let data = {
          smsStatus: smsStatus,
          userId: userId,
          corporateId: corporateId,
          fueldealerSmsSend: "FALSE",
          accessGroup: "2"
        }
        this.post.updateSmsStatusPost(data)
          .subscribe(res => {
            if (res) {
              alert(res.msg)
              this.kycDetails();
            }
          })
      }
    } else if (smsStatus == "FALSE") {
      smsStatus = "TRUE";
      let data = {
        smsStatus: smsStatus,
        userId: userId,
        corporateId: corporateId,
        accessGroup: "2"
      }
      this.post.updateSmsStatusPost(data)
        .subscribe(res => {
          if (res) {
            alert(res.msg)
            this.kycDetails();
          }
        })
    } else {
      alert("Please Select unpaid or WaiveOff Status");
      this.kycDetails();
    }
  }

  emailEnableTransport(status: any, corporateId: any, userId: any, emailStatus: any) {
    if (emailStatus == "TRUE") {
      if (status.target.checked) {
        emailStatus = "FALSE";
        let data = {
          emailStatus: emailStatus,
          userId: userId,
          corporateId: corporateId,
          accessGroup: "2"
        }
        this.post.updateemailStatusPost(data)
          .subscribe(res => {
            if (res) {
              alert(res.msg)
              this.kycDetails();
            }

          })
      }
    } else if (emailStatus == "FALSE") {
      emailStatus = "TRUE";

      let data = {
        emailStatus: emailStatus,
        userId: userId,
        corporateId: corporateId,
        accessGroup: "2"

      }

      this.post.updateemailStatusPost(data)
        .subscribe(res => {
          if (res) {
            alert(res.msg)
            this.kycDetails();
          }

        })
    } else {
      alert("Please Select");
      this.kycDetails();
    }

  }

}
