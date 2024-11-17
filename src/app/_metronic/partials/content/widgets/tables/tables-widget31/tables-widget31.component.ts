import { ChangeDetectorRef, Component, Injectable, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { WidgetService } from '../../widgets.services';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExcelService } from 'src/app/pages/excel.service';
import { FormControl, FormGroup } from '@angular/forms';

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
  selector: 'app-tables-widget31',
  templateUrl: './tables-widget31.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget31Component {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  p: number = 1;
  p1: number = 1;
  total: number = 0;

  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  });
  dealerLoginVPId: any;
  dealerAccess: boolean = false;
  liteAccess: boolean = false;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  crOutstanding2: number;
  mappingAccData2: any = [];
  mappingAccSearchData2: any = [];
  advanceAmt: number;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private excelService: ExcelService,
    private modalService: NgbModal,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    if (element.accessGroupId == 12 || element.accessGroupId == 14 || element.accessGroupId == 19 || element.accessGroupId == 21) {
      this.dealerAccess = true
      if (element.accessGroupId == 19 || element.accessGroupId == 21) {
        this.liteAccess = true
      }
    }
    this.getCorporateById(this.dealerLoginVPId);
    this.cd.detectChanges()
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  // get Corporate DetailsBy VP-Id
  getCorporateById(dealerLoginVPId: any) {
    let data = {
      veelsplusCorporateId: dealerLoginVPId
    }
    this.post.getBranchByVeelsplusIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            // this.headerName1 = res.data[0].companyName;
            // this.headerName2 = res.data[0].address1 + ', ' + res.data[0].address2 + ', ' + res.data[0].city;
            // this.headerName3 = res.data[0].state + '-' + res.data[0].pin + '  ' + "GST: " + res.data[0].GSTNumber;
            this.loginSQLCorporateId = res.data[0].corporateId;
            this.getfuelDealerIdByCorporateId(this.loginSQLCorporateId);
            this.cd.detectChanges()
          }
          else {
            alert("Getting Error..! Please Logout & Login again..!")
            this.cd.detectChanges()
          }
        }
      })
  }

  // getfuelDealerIdByDealerCorporateId
  getfuelDealerIdByCorporateId(loginSQLCorporateId: any) {
    let data = {
      corporateId: loginSQLCorporateId
    }
    this.post.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          // this.getMappingAccount(this.fuelDealerId);
          // this.getFuelPriceByProductDateDealer(this.fuelDealerId);
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
        }
      })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    // this.getMappingAccount(this.fuelDealerId);
  }

  getMapAccountOSDetailsByDate(){
    if(this.filterForm.value.startDate && this.filterForm.value.endDate) {
      
    this.spinner.show();
    this.mappingAccData2 = [];
    this.mappingAccSearchData2 = [];
    this.crOutstanding2 = 0
    this.advanceAmt = 0
    let data = {
      fuelDealerId: this.fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    }
    this.post.getMappingAccByFuelDealerIdPOST(data)
    .subscribe(res => {
      if (res.status == "OK") {        
        this.mappingAccData2 = res.data;
        this.mappingAccSearchData2= res.data;
        this.spinner.hide();
        res.data.map((res: { netOS: any; })=>{      
            this.crOutstanding2 = this.crOutstanding2 + (Number(res.netOS)) 
          if((Number(res.netOS)) < 0){ 
            this.advanceAmt = this.advanceAmt + (Number(res.netOS)) 
          } 
        }) 
      } else {
        this.spinner.hide();
      }
    })
    } else {
      alert("Please select Date Range..!")
    }
  }
  
clearFilterForm(){
  this.filterForm.controls["startDate"].setValue("");
  this.filterForm.controls["endDate"].setValue("");
  // this.getMappingAccount(this.fuelDealerId)
}

// sendSms(fuelDealerCustomerMapId: any, numbers: any, amount: any,isMappingSMS: any,isMappingEmail: any) {

   
//   let data = {
//     fuelDealerCustomerMapId: fuelDealerCustomerMapId,
//     numbers: numbers,
//     amount: amount,
//     pumpName: this.dealerName,
//     city: this.city,
//     isMappingSMS:isMappingSMS,
//     isMappingEmail:isMappingEmail
//   }

//   this.post.sendSmsToMappedCorpNewPOST(data)
//     .subscribe(res => {
//       if (res.status == "OK") {  
//       alert(res.msg)
//       // this.getMappingAccount(this.fuelDealerId);
      
//       }else{
//         alert("SMS not send!")
//       }
//     })
// }
}
