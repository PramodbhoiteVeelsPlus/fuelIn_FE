import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { MixedService } from '../../mixed/mixed.services';
import { StatsService } from '../../stats/stats.services';
import { ListWidgetService } from '../listWidget.services';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { ExcelService } from 'src/app/pages/excel.service';
import { Router } from '@angular/router';

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
  selector: 'app-lists-widget2',
  templateUrl: './lists-widget2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget2Component {
  filterForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  lubeDetailsList: any = [];
  TotalAmount: number;
  lubeDetailsList1: any = [];
  allCreditAccByCorporateIdList: any;
  allCreditAccByCorporateIdLength: any;
  lubeDetailsListExcel: any = [];
  mappingCustomerNameAdd: any;
  fuelcreditCGSTAdd: string;
  fuelcreditSGSTAdd: string;
  fuelcreditIGSTAdd: string;
  totalAmountAddExcel: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  fuelcreditGST1: string;
  fuelcreditGSTAmount1: string;
  fuelcreditHsnSacNumber1: string;
  mappingPreviousStatus1: string;
  mappingCustomerName1: string;
  hostName1: string;
  hostPhone1: string;
  rowNumber: any;
  show: boolean = false;
  fuelCreditIdDelete: any;
  modalRefpass: any;
  closeResult: string;
  password: any;
  userId: any;
  searchCustName: FormControl = new FormControl();
  searchTermm: any;

  constructor(
    private post: ListWidgetService,
    private post1: StatsService,
    private post2: MixedService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private router: Router,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
    
    this.searchCustName.valueChanges
    .subscribe((termm) => {
      this.searchTermm = termm;
      this.search();
    })
  }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    this.accessGroup = element.accessGroupId;
    this.userId = element.userId;
    this.getLubeTaxDetailsByDealerIdPost()
    this.cd.detectChanges()
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getLubeTaxDetailsByDealerIdPost();
  }

  getLubeTaxDetailsByDealerIdPost() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.lubeDetailsList.length = 0;
      let data = {
        fuelDealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD')
      };

      this.post.getLubeTaxDetailsByDealerId(data).subscribe((res) => {
        if (res.data.length) {
          this.lubeDetailsList = res.data;
          this.TotalAmount = Number(res.data[0].fuelcreditBeforeTax) + Number(res.data[0].fuelcreditGSTAmount)
          this.cd.detectChanges()
        } else {
          alert("Data Not Found..!")
          this.cd.detectChanges()
        }
      });
    } else {
      this.lubeDetailsList.length = 0;
      let data = {
        fuelDealerId: this.fuelDealerId,
      };
      this.post.getLubeTaxDetailsByDealerId(data).subscribe((res) => {
        if (res.data.length) {
          this.lubeDetailsList1 = res;
          this.allCreditAccByCorporateIdList = res;
          this.allCreditAccByCorporateIdLength = res.data;

          res.data.map((res1: { estimatedRefuelDate: string; mappingPreviousStatus: string; companyName: string; lubeName: string; manualCrNumber: string; fuelcreditHsnSacNumber: string; vehicleNumber: string; fuelcreditGST: string; fuelcreditCGST: string; fuelcreditSGST: string; fuelcreditIGST: string; fuelcreditGSTAmount: number; fuelcreditTaxDetails: string; creditAmount: string; fuelCreditId: string; mappingCustomerName: string; mappingCompanyName: string; hostName: string; hostPhone: string; actualCreditQuantity: string; fuelcreditBeforeTax: number; }) => {
            const dataJson = {
              estimatedRefuelDate: '',
              mappingPreviousStatus: '',
              companyName: '',
              lubeName: '',
              manualCrNumber: '',
              fuelcreditHsnSacNumber: '',
              vehicleNumber: '',
              fuelcreditGST: '',
              fuelcreditBeforeTax: 0,
              fuelcreditCGST: '',
              fuelcreditSGST: '',
              fuelcreditIGST: '',
              fuelcreditGSTAmount: 0,
              fuelcreditTaxDetails: '',
              creditAmount: '',
              totalAmount: 0,
              totalAmount2: 0,
              fuelCreditId: '',
              mappingCustomerName: '',
              mappingCompanyName: '',
              hostName: '',
              hostPhone: '',
              actualCreditQuantity: '',
            };

            dataJson.estimatedRefuelDate = res1.estimatedRefuelDate;
            dataJson.mappingPreviousStatus = res1.mappingPreviousStatus;
            dataJson.companyName = res1.companyName;
            dataJson.lubeName = res1.lubeName;
            dataJson.manualCrNumber = res1.manualCrNumber;
            dataJson.fuelcreditHsnSacNumber = res1.fuelcreditHsnSacNumber;
            dataJson.vehicleNumber = res1.vehicleNumber;
            dataJson.fuelcreditGST = res1.fuelcreditGST;
            dataJson.fuelcreditCGST = res1.fuelcreditCGST;
            dataJson.fuelcreditSGST = res1.fuelcreditSGST;
            dataJson.fuelcreditIGST = res1.fuelcreditIGST;
            dataJson.fuelcreditGSTAmount = res1.fuelcreditGSTAmount;
            dataJson.fuelcreditTaxDetails = res1.fuelcreditTaxDetails;
            dataJson.creditAmount = res1.creditAmount;
            dataJson.fuelCreditId = res1.fuelCreditId;
            dataJson.mappingCustomerName = res1.mappingCustomerName;
            dataJson.mappingCompanyName = res1.mappingCompanyName;
            dataJson.hostName = res1.hostName;
            dataJson.hostPhone = res1.hostPhone;
            dataJson.actualCreditQuantity = res1.actualCreditQuantity;

            dataJson.fuelcreditBeforeTax = res1.fuelcreditBeforeTax;
            dataJson.totalAmount = Number(res1.fuelcreditBeforeTax) + Number(res1.fuelcreditGSTAmount);
            dataJson.totalAmount2 = Number(dataJson.fuelcreditBeforeTax) + Number(dataJson.fuelcreditGSTAmount);

            this.lubeDetailsList.push(dataJson);
            this.cd.detectChanges()
          })
        } else {
          alert("Data Not Found..!")
          this.cd.detectChanges()
        }
      });
    }
  }

  clearForm() {
    this.filterForm.reset();
    this.filterForm.controls["startDate"].setValue("");
    this.filterForm.controls["endDate"].setValue("");
    this.getLubeTaxDetailsByDealerIdPost();
  }

  excelDownload() {
    this.lubeDetailsListExcel.length = 0

    this.lubeDetailsList.map((res: { mappingPreviousStatus: string; mappingCustomerName: any; companyName: any; fuelcreditCGST: string; fuelcreditSGST: string; fuelcreditIGST: string; fuelcreditTaxDetails: string; creditAmount: any; fuelcreditBeforeTax: any; fuelcreditGSTAmount: any; estimatedRefuelDate: moment.MomentInput; lubeName: any; manualCrNumber: any; fuelcreditHsnSacNumber: any; vehicleNumber: any; }) => {
      if (res.mappingPreviousStatus == 'TRUE') {
        this.mappingCustomerNameAdd = res.mappingCustomerName
      } else {
        if (res.mappingPreviousStatus == 'FALSE') {
          this.mappingCustomerNameAdd = res.companyName
        }
      }

      if (res.fuelcreditCGST == '') {
        this.fuelcreditCGSTAdd = '-'
      } else {
        if (res.fuelcreditCGST == 'undefined') {
          this.fuelcreditCGSTAdd = '-'
        } else {
          if (res.fuelcreditCGST != '' && res.fuelcreditCGST != 'undefined') {
            this.fuelcreditCGSTAdd = res.fuelcreditCGST
          }
        }
      }

      if (res.fuelcreditSGST == '') {
        this.fuelcreditSGSTAdd = '-'
      } else {
        if (res.fuelcreditSGST == 'undefined') {
          this.fuelcreditSGSTAdd = '-'
        } else {
          if (res.fuelcreditSGST != '' && res.fuelcreditSGST != 'undefined') {
            this.fuelcreditSGSTAdd = res.fuelcreditSGST
          }
        }
      }

      if (res.fuelcreditIGST == '') {
        this.fuelcreditIGSTAdd = '-'
      } else {
        if (res.fuelcreditIGST == 'undefined') {
          this.fuelcreditIGSTAdd = '-'
        } else {
          if (res.fuelcreditIGST != '' && res.fuelcreditIGST != 'undefined') {
            this.fuelcreditIGSTAdd = res.fuelcreditIGST
          }
        }
      }

      if (res.fuelcreditTaxDetails == 'INCLUDE') {
        this.totalAmountAddExcel = res.creditAmount
      } else {
        if (res.fuelcreditTaxDetails == 'EXCLUDE') {
          this.totalAmountAddExcel = Number(res.fuelcreditBeforeTax) + Number(res.fuelcreditGSTAmount);
        }
      }


      let json = {
        Date: moment(res.estimatedRefuelDate).format("DD-MM-YYYY"),
        CustomerName: this.mappingCustomerNameAdd,
        LubeName: res.lubeName,
        BillRefNumber: res.manualCrNumber,
        HsnSacNumber: res.fuelcreditHsnSacNumber,
        VehicleNumber: res.vehicleNumber,
        fuelcreditGSTAmount: res.fuelcreditGSTAmount,
        fuelcreditBeforeTax: res.fuelcreditBeforeTax,
        CGST: this.fuelcreditCGSTAdd,
        SGST: this.fuelcreditSGSTAdd,
        IGST: this.fuelcreditIGSTAdd,
        TaxAmount: res.fuelcreditGSTAmount,
        TotalAmount: this.totalAmountAddExcel,
      };

      this.lubeDetailsListExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.lubeDetailsListExcel,
      "LubeTaxGSTsale"
    );
  }

  changeValue1(i: any, fuelcreditGST: any, fuelcreditGSTAmount: any, fuelcreditHsnSacNumber: any, mappingPreviousStatus: any, mappingCustomerName: any, hostName: any, hostPhone: any) {
    this.fuelcreditGST1 = '';
    this.fuelcreditGSTAmount1 = '';
    this.fuelcreditHsnSacNumber1 = '';
    this.mappingPreviousStatus1 = '';
    this.mappingCustomerName1 = '';
    this.hostName1 = '';
    this.hostPhone1 = '';

    if (i == this.rowNumber) {
      this.rowNumber = ''
      if (this.show == true) {
        this.show = false;
      } else {
        this.show = true;
        this.rowNumber = i
        this.fuelcreditGST1 = fuelcreditGST
        this.fuelcreditGSTAmount1 = fuelcreditGSTAmount
        this.fuelcreditHsnSacNumber1 = fuelcreditHsnSacNumber
        this.mappingPreviousStatus1 = mappingPreviousStatus
        this.mappingCustomerName1 = mappingCustomerName
        this.hostName1 = hostName
        this.hostPhone1 = hostPhone
      }
    } else {
      this.rowNumber = i
      this.show = true;
      this.fuelcreditGST1 = fuelcreditGST
      this.fuelcreditGSTAmount1 = fuelcreditGSTAmount
      this.fuelcreditHsnSacNumber1 = fuelcreditHsnSacNumber
      this.mappingPreviousStatus1 = mappingPreviousStatus
      this.mappingCustomerName1 = mappingCustomerName
      this.hostName1 = hostName
      this.hostPhone1 = hostPhone
    }

  }

  askForPass(PasswordTemplate: any, fuelCreditId: any) {

    this.fuelCreditIdDelete = fuelCreditId;
    this.modalRefpass = this.modalService.open(PasswordTemplate)
    this.modalRefpass.result.then((result: any) => {
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

  comparePasswordForDelete(fuelCreditIdDelete: any) {
    const data = {
      password: this.password,
      userId: this.userId
    };
    this.post.comparePasswordPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          alert(result.msg)
          this.closeResult
          this.modalRefpass.close('close')
          this.password = "";
          this.deleteLube(fuelCreditIdDelete);
        } else {
          alert(result.msg)
          this.password = "";
        }
      });
  }

  deleteLube(fuelCreditId: any) {
    let data = {
      fuelCreditId: fuelCreditId,
    }
    this.post.cancelFuelCreditReqPOST(data)
      .subscribe(res => {
        if (res) {
          alert("Details deleted successfully.")
          this.getLubeTaxDetailsByDealerIdPost()
        }
      })
  }

  viewBill(cashBillId: any) {
    this.post.setRoutingWithType1("lubeTaxBill", cashBillId)
    this.router.navigate(['/credit/cashBillInvoice']);
  }
  
search() {
  // console.log("search")
  let termm = this.searchTermm;

  this.lubeDetailsList = this.lubeDetailsList1.data.filter(function (res: { vehicleNumber: string | any[]; }) {
    return res.vehicleNumber.indexOf(termm) >= 0;
  });

  if(this.lubeDetailsList.length == 0){
    termm = this.searchTermm;
    this.lubeDetailsList = this.lubeDetailsList1.data.filter(function (res: { vehicleNumber: string | any[]; }) { 
        return res.vehicleNumber.indexOf(termm) >= 0;         
    });
  } 

  if(this.lubeDetailsList.length == 0){
    termm = this.searchTermm;
    this.lubeDetailsList = this.lubeDetailsList1.data.filter(function (res: { lubeName: string | any[]; }) { 
        return res.lubeName.indexOf(termm) >= 0;         
    });
  } 

  if(this.lubeDetailsList.length == 0){
    termm = this.searchTermm;
    this.lubeDetailsList = this.lubeDetailsList1.data.filter(function (res: { manualCrNumber: string | any[]; }) { 
        return res.manualCrNumber.indexOf(termm) >= 0;         
    });
  } 

  if(this.lubeDetailsList.length == 0){
    termm = this.searchTermm;
    this.lubeDetailsList = this.lubeDetailsList1.data.filter(function (res: { vehicleNumber: string | any[]; }) { 
        return res.vehicleNumber.indexOf(termm) >= 0;         
    });
  } 


  if(this.lubeDetailsList.length == 0){
    termm = this.searchTermm;
    this.lubeDetailsList = this.lubeDetailsList1.data.filter(function (res: { companyName: string | any[]; }) { 
        return res.companyName.indexOf(termm) >= 0;         
    });
  } 

  if(this.lubeDetailsList.length == 0){
    termm = this.searchTermm;
    this.lubeDetailsList = this.lubeDetailsList1.data.filter(function (res: { hostName: string | any[]; }) { 
        return res.hostName.indexOf(termm) >= 0;         
    });
  } 

  if(this.lubeDetailsList.length == 0){
    termm = this.searchTermm;
    this.lubeDetailsList = this.lubeDetailsList1.data.filter(function (res: { hostPhone: string | any[]; }) { 
        return res.hostPhone.indexOf(termm) >= 0;         
    });
  } 


}
}
