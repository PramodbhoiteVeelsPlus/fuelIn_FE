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
  customerId: any;
  dealerName: any;
  city: any;
  searchData: any;
  acceesGroup: number;
  netOutstanding1: number;
  netOutstanding: any;
  headerName2: any;
  headerName3: any;
  headerName1: any;
  allCreditAccByDealerListDetails: any = [];
  mappingAccExcelData: any = [];
  netOS: any;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private excelService: ExcelService,
    private modalService: NgbModal,
    private router: Router,) {
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
            this.customerId = res.data[0].customerId;
            this.headerName1 = res.data[0].companyName;
            this.headerName2 = res.data[0].address1+', '+res.data[0].address2+', '+res.data[0].city;
            this.headerName3 = res.data[0].state+'-'+res.data[0].pin+'  '+"GST: "+res.data[0].GSTNumber;
            this.loginSQLCorporateId = res.data[0].corporateId;
            this.getfuelDealerIdByCorporateId(this.loginSQLCorporateId);
            this.searchDealerBycustomerId(this.customerId)
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
          this.getMappingAccount(this.fuelDealerId);
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
  
  searchDealerBycustomerId(customerId: any) {    

    let data = {
      customerId: customerId,
    };
    this.post.getCustomerByCustomerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {                      
          this.dealerName = res.data[0].companyName;
          this.city = res.data[0].city;            
          
        } else {
          this.spinner.hide();
        }
      });
}

  getMappingAccount(fuelDealerId: any) {
    this.spinner.show();
    this.mappingAccData2 = []
    this.mappingAccSearchData2 = []
    this.crOutstanding2 = 0
    this.advanceAmt = 0
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getMappingAccByFuelDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.mappingAccData2 = res.data;
          this.mappingAccSearchData2 = res.data;
          res.data.map((res: { netOS: any; }) => {
            this.crOutstanding2 = this.crOutstanding2 + (Number(res.netOS))
            if ((Number(res.netOS)) < 0) {
              this.advanceAmt = this.advanceAmt + (Number(res.netOS))
            }
          })
          this.spinner.hide();
        } else {
          this.mappingAccData2 = [];
          this.spinner.hide();
        }
      })
  }

  getMapAccountOSDetailsByDate() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {

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
            this.mappingAccSearchData2 = res.data;
            this.spinner.hide();
            res.data.map((res: { netOS: any; }) => {
              this.crOutstanding2 = this.crOutstanding2 + (Number(res.netOS))
              if ((Number(res.netOS)) < 0) {
                this.advanceAmt = this.advanceAmt + (Number(res.netOS))
              }
            })
            this.cd.detectChanges()
          } else {
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
    } else {
      alert("Please select Date Range..!")
    }
  }

  clearFilterForm() {
    this.filterForm.controls["startDate"].setValue("");
    this.filterForm.controls["endDate"].setValue("");
    // this.getMappingAccount(this.fuelDealerId)
  }

  sendSms(fuelDealerCustomerMapId: any, numbers: any, amount: any,isMappingSMS: any,isMappingEmail: any) {
    let data = {
      fuelDealerCustomerMapId: fuelDealerCustomerMapId,
      numbers: numbers,
      amount: amount,
      pumpName: this.dealerName,
      city: this.city,
      isMappingSMS:isMappingSMS,
      isMappingEmail:isMappingEmail
    }

    this.post.sendSmsToMappedCorpNewPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {  
        alert(res.msg)
        this.getMappingAccount(this.fuelDealerId);
        }else{
          alert("SMS not send!")
        }
      })
  }
  
  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query    
    this.mappingAccData2 = this.mappingAccSearchData2.filter((item: { companyName: any; }) =>
      item.companyName.toLowerCase().includes(query)
    );
  }
  
downloadPDF() {
  if(this.acceesGroup == 2){
  var cols = [["Mapped Date", "Pump Name", "Oil Company Name","Key Person Name", "Key Person Mobile", "Total Purchase","Total Payment","Total Discount","Net Outstanding"]];
  var rows = [];
  for (var key in this.mappingAccData2) {

    if(this.mappingAccData2[key].netOS < 0){
      this.netOutstanding1 = ((Number(this.mappingAccData2[key].netOS)) * (-1)) 
      this.netOutstanding = Number(this.netOutstanding1).toFixed(2) + 'CR'
      console.log(this.netOutstanding)
    } else{ 
      this.netOutstanding = Number(this.mappingAccData2[key].netOS).toFixed(2)
    }

    var temp = [
      moment(this.mappingAccData2[key].mappingCreatedDate).format("DD-MM-YYYY"),
      this.mappingAccData2[key].companyName,
      this.mappingAccData2[key].brandName,
      this.mappingAccData2[key].hostName,
      this.mappingAccData2[key].hostPhone,
      this.mappingAccData2[key].totalPurchaseAmt.toFixed(2),
      this.mappingAccData2[key].totalPaymentAmt.toFixed(2),
      this.netOutstanding
      ];
      rows.push(temp);
  }

  var doc = new jsPDF('l', 'pt');
 
  doc.setFontSize(12);  
  doc.text(this.headerName1,40, 25 ); 
  doc.setFontSize(8);  
  doc.text(this.headerName2,40, 40 );   
  doc.text(this.headerName3,40, 55 ); 
  doc.setFontSize(12);  
  doc.text("Active Pumps Report",350, 35 );   

   autoTable(doc, {
    columnStyles: {
      0: {cellWidth: 60},     // 
      1: {cellWidth: 130},    // 
      2: {cellWidth: 110},     //
      3: {cellWidth: 80},     //
      4: {cellWidth: 70},     //
      5: {cellWidth: 70},     //
      6: {cellWidth: 60},     //
      7: {cellWidth: 70},     //
      8: {cellWidth: 80},     //

    },
    
    margin: {top: 80},
    head: cols,
    body: rows,
    theme: 'grid',
    didDrawCell: (data) => { },
});
  doc.save("ActivePumpsReport.pdf");

}else{

  var cols = [["Mapped Date", "Customer Name", "Key Person Name", "Key Person Mobile", "Credit Limit","Total Purchase","Total Payment","Net Outstanding","Pending Days"]];
  var rows = [];
  for (var key in this.mappingAccData2) {

    if((Number(this.mappingAccData2[key].netOS)) < 0){ 
      this.netOutstanding1 = ((Number(this.mappingAccData2[key].netOS)) * (-1)) 
      this.netOutstanding = Number(this.netOutstanding1).toFixed(2) + 'CR'
    }else{
      this.netOutstanding = Number(this.mappingAccData2[key].netOS).toFixed(2)
    } 
    
    var temp = [
      moment(this.mappingAccData2[key].mappingCreatedDate).format("DD-MM-YYYY"),
      this.mappingAccData2[key].companyName,
      this.mappingAccData2[key].hostName,
      this.mappingAccData2[key].hostPhone,
      this.mappingAccData2[key].maxCreditAmount,
      (Number(this.mappingAccData2[key].totalPurchaseAmt)).toFixed(2),
      (Number(this.mappingAccData2[key].totalPaymentAmt)).toFixed(2),
      this.netOutstanding,
      Number(this.mappingAccData2[key].pendingDays),
      ];
      rows.push(temp);
  }

  var doc = new jsPDF('l', 'pt');

  
  doc.setFontSize(12);  
  doc.text(this.headerName1,40, 25 ); 
  doc.setFontSize(8);  
  doc.text(this.headerName2,40, 40 );   
  doc.text(this.headerName3,40, 55 );
  doc.setFontSize(12);  
  doc.text("All Customers Report",350, 35 );  

   autoTable(doc, {
    columnStyles: {
      0: {cellWidth: 60},     // 
      1: {cellWidth: 130},    // 
      2: {cellWidth: 110},     //
      3: {cellWidth: 80},     //
      4: {cellWidth: 70},     //
      5: {cellWidth: 70},     //
      6: {cellWidth: 60},     //
      7: {cellWidth: 80},     //
      8: {cellWidth: 80},     //

    },
    
    margin: {top: 80},
    head: cols,
    body: rows,
    theme: 'grid',
    didDrawCell: (data) => { },
});
  doc.save("AllCustomersReport.pdf");
}

}

downloadExcel(){
  if(this.acceesGroup == 2){

    this.allCreditAccByDealerListDetails.length = 0
  
    this.mappingAccData2.map((res: { netOS: any; mappingCreatedDate: moment.MomentInput; companyName: any; brandName: any; hostName: any; hostPhone: any; totalPurchaseAmt: any; totalPaymentAmt: any; }) => {

      if(Number(res.netOS) < 0){
        this.netOutstanding1 = (Number(res.netOS) * (-1))  ;
        this.netOutstanding = Number(this.netOutstanding1).toFixed(2)+'CR'
      }else{
        this.netOutstanding1 = Number(res.netOS)  ; 
        this.netOutstanding = Number(this.netOutstanding1).toFixed(2)    
      }      

      var json = {
        MappedDate: moment(res.mappingCreatedDate).format("DD-MM-YYYY"),
        PumpName: res.companyName,
        OilCompanyName: res.brandName,
        KeyPersonName: res.hostName,
        KeyPersonMobile: res.hostPhone,
        TotalPurchase: Number(res.totalPurchaseAmt).toFixed(2),
        TotalPayment: Number(res.totalPaymentAmt).toFixed(2),
        NetOutstanding: this.netOutstanding,
      };
      this.allCreditAccByDealerListDetails.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.allCreditAccByDealerListDetails,
      "ActivePumpsReport"
    );
  
  }
    else{

      this.mappingAccExcelData = [];
      this.mappingAccData2.map((res: { netOS: any; mappingCreatedDate: moment.MomentInput; companyName: any; hostName: any; hostPhone: any; maxCreditAmount: any; totalPurchaseAmt: any; totalPaymentAmt: any; pendingDays: any; }) => {
        if((Number(res.netOS)) < 0){
          this.netOutstanding1 = ((Number(res.netOS)) * (-1))  ;
          this.netOutstanding = Number(this.netOutstanding1).toFixed(2)+'CR'
        }else{
          this.netOutstanding1 = (Number(res.netOS))  ; 
          this.netOutstanding = Number(this.netOutstanding1).toFixed(2)    
        }  
  
        var json = {
          MappedDate: moment(res.mappingCreatedDate).format("DD-MM-YYYY"),
          CustomerName: res.companyName,
          KeyPersonName: res.hostName,
          KeyPersonMobile: res.hostPhone,
          CreditLimit: res.maxCreditAmount,
          TotalPurchase: Number(res.totalPurchaseAmt).toFixed(2),
          TotalPayment: Number(res.totalPaymentAmt).toFixed(2), 
          NetOutstanding: this.netOutstanding,
          PendingDays: res.pendingDays,
        };
        this.mappingAccExcelData.push(json);
      });
  
      this.excelService.exportAsExcelFile(
        this.mappingAccExcelData,
        "All Customers Report"
      ); 
    }
  
}
 
printPdf(){
  this.post.setRouteForActiveCustomer('activeCustomer', this.mappingAccData2,this.filterForm.value.startDate, this.filterForm.value.endDate, this.netOS, this.crOutstanding2)
  this.router.navigate(['/credit/viewAccountDetails']);
}
}
