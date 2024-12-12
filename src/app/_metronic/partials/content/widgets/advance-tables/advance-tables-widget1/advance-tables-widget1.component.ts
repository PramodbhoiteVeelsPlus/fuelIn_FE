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
  | 'kt_advance-tables_widget_1_tab_1'
  | 'kt_advance-tables_widget_1_tab_2'
  | 'kt_advance-tables_widget_1_tab_3';

@Component({
  selector: 'app-advance-tables-widget1',
  templateUrl: './advance-tables-widget1.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class AdvanceTablesWidget1Component {
  filterCustomerList = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });
  selectedCList: any;
  getVishUserCustList2: any = [];
  getVishUserCustList3: any = [];
  getVishUserCustList1: any = []
  getVishUserCustList2Excel: any = [];
  modalReference: any;
  closeResult: string;
  vistUserId: any;
  veelsUserId: any;
  vendorDetails: any = [];
  userCrInfo: any;
  onBoardUid: any;
  onBoardVid: any;
  vid: any;
  accountNumber: any;
  beneficiaryName: any;
  ifscCode: any;
  searchBoxAllCustomerList: FormControl = new FormControl();
  searchTermAllCustomerList: any = "";
  p: number = 1;
  p1: number = 1;
  total: number = 0;

  constructor(private post: Adv_TablesService, private excelService: ExcelService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private cd: ChangeDetectorRef,
  ) { }

  activeTab: Tabs = 'kt_advance-tables_widget_1_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit() {
    this.getAllvishUserCustomerList();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getAllvishUserCustomerList();
  }

  //getAllvishUserCustomerList
  getAllvishUserCustomerList() {
    this.getVishUserCustList2 = []
    this.getVishUserCustList3 = []

    this.post.getAllvishUserCustomerList()
      .subscribe(res => {
        this.getVishUserCustList1 = res;
        this.getVishUserCustList1.data.map(
          (detail: any) => {
            this.getVishUserCustList2.push(detail);
            this.getVishUserCustList3.push(detail);
          })
        this.cd.detectChanges();
      })
  }

  exportToExcelAllCustomerList() {
    this.getVishUserCustList2Excel.length = 0
    this.getVishUserCustList2.map((res: any) => {
      let json = {
        MappedDate: moment(res.vishUserCreatedAt).format("DD-MM-YYYY"),
        OwnerName: res.vishUserFirstName + ' ' + res.vishUserLastName,
        ContactNumber: res.vishUserMobile,
        EmailId: res.vishUserMail,
        OwnedVehicleCount: res.vehicleSum,
        CreatedBy: res.vishUserCreatedBy,
      };
      this.getVishUserCustList2Excel.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.getVishUserCustList2Excel,
      "All Customer List"
    );
  }

  // FILTER LIST CUSTOMER
  getAllCustomerListByDateRange() {
    this.getVishUserCustList2 = []
    let data = {
      startDate: moment(this.filterCustomerList.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "00:00:01",
      endDate: moment(this.filterCustomerList.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "23:59:59",
    }
    this.post.getAllCustomerListDateRangePOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.getVishUserCustList2 = res.data;
        } else {
          alert("Data not found..")
        }
      })
  }

  clearFilterAllCustomerList() {
    this.selectedCList = '';
    this.filterCustomerList.reset();
    this.getAllvishUserCustomerList()
  }

  updateVyanaModal(contentOnBoard: any, vistUserId: any, veelsUserId: any) {
    this.getvendorDetails(vistUserId)
    this.vistUserId = vistUserId;
    this.veelsUserId = veelsUserId;
    this.modalReference = this.modalService.open(contentOnBoard, { size: 'lg' })
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getvendorDetails(vistUserId: any) {
    this.vendorDetails = [];
    let data = {
      vistUserId: vistUserId,
    }
    this.post.getvendorDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.vendorDetails = res.data
          this.cd.detectChanges();
        }
      })
  }

  viewCreditStatusModal(creditStatusModal: any, uId: any) {
    let data = {
      customerId: uId
    }
    this.post.creditStatusPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.statusCode == 400) {
            alert(res.data.errorMessage)
          } else {
            this.userCrInfo = JSON.parse(res.data)
            this.modalReference = this.modalService.open(creditStatusModal)
            this.modalReference.result.then((result: any) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason: any) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
            this.cd.detectChanges();
          }
        }
      })
  }

  vendorOnboardingModal(vendorOnboarding: any, vishUserId: any, uId: any, vId: any) {
    this.getvendorDetails(vishUserId);
    this.modalReference = this.modalService.open(vendorOnboarding, { size: 'lg' })
    this.onBoardUid = uId
    this.onBoardVid = vId
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  inputToVid() {
    this.vid = this.accountNumber
  }

  updateVyanaByVistUserId() {
    this.spinner.show();
    let data = {
      vistUserId: this.vistUserId,
      uid: this.veelsUserId,
      vid: this.vid,
      accountNumber: this.accountNumber,
      beneficiaryName: this.beneficiaryName,
      ifscCode: this.ifscCode
    }
    this.post.updateVyanaByVistUserIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
          this.vid = '',
            this.accountNumber = '',
            this.beneficiaryName = '',
            this.ifscCode = ''
          this.getvendorDetails(this.vistUserId)
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      })
  }

  addVendorOnboarding(info: any) {
    this.spinner.show();
    let data = {
      vendorDetailsId: info.vendorDetailsId,
      customerid: info.vendorDetailsUID,
      vendorid: info.vendorDetailsVID,
      name: info.vendorVyanaBeneficiaryName,
      accountname: info.vendorVyanaAccountName,
      accountnumber: info.vendorVyanaAccountNumber,
      ifsc: info.vendorVyanaIfscCode,
      pan: info.vendorDetailsPan,
      gstIn: info.vendorDetailsGST,
      email: info.vendorDetailsEmail,
      phone: info.vendorDetailsPhone,
      address: info.vendorDetailsAddress,
      city: info.vendorDetailsCity,
      zipcode: info.vendorDetailsZipCode
    }
    this.post.vendoronboardingPOST(data)
      .subscribe(res => {
        if (res.data.statusCode == 200) {
          alert(res.data.data)
          this.getvendorDetails(this.vistUserId)
          this.spinner.hide();
          this.modalReference.close('close')
        } else {
          alert(res.data.errorMessage)
          this.getvendorDetails(this.vistUserId)
          this.spinner.hide();
        }
      })
  }

  searchAllCustomerList1() {
    this.searchBoxAllCustomerList.valueChanges
      // .distinctUntilChanged()
      .subscribe((termAllCustomerList: any) => {
        this.searchTermAllCustomerList = termAllCustomerList;
        this.searchAllCustomerList();
      })
  }

  searchAllCustomerList() {
    let term = this.searchTermAllCustomerList;
    this.getVishUserCustList2 = this.getVishUserCustList3.filter(function (res: any) {
      return res.vishUserFirstName.indexOf(term) >= 0;
    });
    if (this.getVishUserCustList2.length == 0) {
      term = this.searchTermAllCustomerList;
      this.getVishUserCustList2 = this.getVishUserCustList3.filter(function (res: any) {
        return res.vishUserFirstName.indexOf(term) >= 0;
      });
    }
    if (this.getVishUserCustList2.length == 0) {
      term = this.searchTermAllCustomerList;
      this.getVishUserCustList2 = this.getVishUserCustList3.filter(function (res: any) {
        return res.vishUserLastName.indexOf(term) >= 0;
      });
    }
    if (this.getVishUserCustList2.length == 0) {
      term = this.searchTermAllCustomerList;
      this.getVishUserCustList2 = this.getVishUserCustList3.filter(function (res: any) {
        return res.vishUserMobile.indexOf(term) >= 0;
      });
    }
    if (this.getVishUserCustList2.length == 0) {
      term = this.searchTermAllCustomerList;
      this.getVishUserCustList2 = this.getVishUserCustList3.filter(function (res: any) {
        return res.vishUserMail.indexOf(term) >= 0;
      });
    }
    if (this.getVishUserCustList2.length == 0) {
      term = this.searchTermAllCustomerList;
      this.getVishUserCustList2 = this.getVishUserCustList3.filter(function (res: any) {
        return res.vishUserCreatedBy.indexOf(term) >= 0;
      });
    }

  }
}
