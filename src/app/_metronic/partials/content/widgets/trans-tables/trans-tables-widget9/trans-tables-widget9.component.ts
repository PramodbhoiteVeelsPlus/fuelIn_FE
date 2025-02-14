import { Component, OnInit, Input, Injectable, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { LayoutService } from '../../../../../layout';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TilesService } from '../../tiles/tiles.services';
import { TransTablesService } from '../trans-tables.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { ExcelService } from 'src/app/pages/excel.service';

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
  selector: 'app-trans-tables-widget9',
  templateUrl: './trans-tables-widget9.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TransTablesWidget9Component implements OnInit {
  filterForm = new FormGroup({
    customerName: new FormControl(''),
    year: new FormControl("", Validators.required),
    month: new FormControl("", Validators.required),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  });

  @Input() fromDate: any;
  @Input() toDate: any;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
  hoveredDate: any;
  fromNGDate: any;
  toNGDate: any;
  selected: any;
  hidden: boolean = true;
  crPaymentDetails2: any = [];
  crPaymentDetails: any = [];
  crPaymentDetailsData: any = [];
  showHeading: boolean = false;
  crPaymentDetails1: any = [];
  fuelDealerCorpMapIdNew: any;
  paymentDetails: any = [];
  createdBy: any;
  ownerName: string;
  customerName: any;
  fuelDealerCorpMapId: string;
  isAccountNameTableShow: boolean = false;
  isSelectedAccountName: boolean = false;
  accountNameList: any = [];
  allCorporateList: any = [];
  transactionData: any = [];
  transactionDataEXCEL: any = [];
  quantity: string;
  selectedAcc: any;
  selectedAccHost: any;
  paymentData: any;
  transitionwiseDetails: any;
  transitionwiseData: any;
  crData: any;
  billData: any = [];
  totalDiscount: any = 0;
  previousPendingOutstanding: number;
  lastOpOutstanding: number;

  /**
* @param date date obj
*/
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  /**
 * @param date date obj
 */
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

  /**
  * Is hovered over date
  * @param date date obj
  */
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }

  /**
   * on date selected
   * @param date date object
   */
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
      // console.log('11111111');
      // console.log(this.selected);

    } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      // this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();

      this.selected = moment(this.fromDate.toLocaleDateString()).format("DD-MM-YYYY") + ' - ' + moment(this.toDate.toLocaleDateString()).format("DD-MM-YYYY")
      this.filterForm.controls["startDate"].setValue(moment(this.fromDate.toLocaleDateString()).format("DD-MM-YYYY"));
      this.filterForm.controls["endDate"].setValue(moment(this.toDate.toLocaleDateString()).format("DD-MM-YYYY"));


      this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });
      // console.log('2222222222');
      // console.log(this.selected);

      this.fromDate = null;
      this.toDate = null;
      this.fromNGDate = null;
      this.toNGDate = null;

    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';

      // console.log('33333333');
      // console.log(this.selected);

    }
  }


  fuelDealerId: any;
  accessGroup: any;
  transporterCorpId: any;

  p: number = 1;
  p1: number = 1;
  total: number = 0;
  brandName: any;

  constructor(private cd: ChangeDetectorRef,
    private post: TransTablesService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private modalService: NgbModal,
    config: NgbDatepickerConfig,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';

  }


  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.transporterCorpId = localStorage.getItem('transporterCorpId');
    this.ownerName = element.firstName + ' ' + element.lastName
    this.accessGroup = element.accessGroupId
    this.getFuelCreditPumpByCorporateId(this.transporterCorpId)
    this.cd.detectChanges()
  }

  getDetailsByCustomerMapName(id: any) {
    this.filterForm.controls["customerName"].setValue(id.target.value)
    if (this.filterForm.value.customerName) {
      this.customerName = id.target.value;
      this.getCorporateInfoByfuelDealerCustomerMapId(this.customerName);
    } else {
      this.fuelDealerCorpMapId = '';
      this.filterForm.controls['customerName'].setValue('');
    }
  }


  getCorporateInfoByfuelDealerCustomerMapId(customerName: any) {
    if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {
      let data = {
        fuelDealerId: this.fuelDealerId,
        customerName: customerName,
      }
      this.post.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.fuelDealerCorpMapId = res.data[0].fuelDealerCustomerMapId;
          } else {
            this.filterForm.controls['customerName'].setValue('');
          }
        });
    } else {
      this.fuelDealerCorpMapId = ''
      this.isAccountNameTableShow = false
      this.isSelectedAccountName = false
      let data = {
        corporateId: this.transporterCorpId,
        customerName: customerName,
      }
      this.post.getCorporateInfoByCorporateCustomerMapIdPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            // console.log("ARR_LENGTH ",res.data.length)
            if (res.data.length == 1) {
              this.fuelDealerCorpMapId = res.data[0].fuelDealerCustomerMapId;
            } else {
              this.isAccountNameTableShow = true
              this.accountNameList = res.data;
            }
          } else {
            this.filterForm.controls['customerName'].setValue('');
          }
        });
    }

  }

  getFuelCreditPumpByCorporateId(transporterCorpId: any) {
    let data = {
      corporateId: transporterCorpId
    }
    this.post.getFuelCreditDealersByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.allCorporateList = res.data;
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
        }
      });
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getTransactionWiseLedger();
  }

  getTransactionWiseLedger() {
    if (this.fuelDealerCorpMapId) {
      if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
        this.transactionData = []
        this.spinner.show()
        let data = {
          fuelDealerCustomerMapId: this.fuelDealerCorpMapId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD" + " " + "23:59:59"),
        }

        this.post.getTransactionWiseLedgerPOST(data)
          .subscribe(res => {
            if (res.status == "OK" && res.data.length) {
              this.transactionData = res.data;
              this.spinner.hide()
              this.cd.detectChanges()
            } else {
              alert("No Data Found..!")
              this.spinner.hide()
              this.cd.detectChanges()
            }
          })
      } else {
        this.transactionData = []
        this.spinner.show()
        let data = {
          fuelDealerCustomerMapId: this.fuelDealerCorpMapId
        }

        this.post.getTransactionWiseLedgerPOST(data)
          .subscribe(res => {
            if (res.status == "OK" && res.data.length) {
              this.transactionData = res.data;
              this.spinner.hide()
              this.cd.detectChanges()
            } else {
              alert("No Data Found..!")
              this.spinner.hide()
              this.cd.detectChanges()
            }
          })
      }

    } else {
      alert("Please Select Name..!")
    }

  }

  exportexcel() {
    if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {
      this.transactionDataEXCEL.length = 0

      this.transactionData.map((res: { quantity: string; date: moment.MomentInput; companyName: any; hostName: any; hostPhone: any; description: any; purchase: any; payment: any; balance: any; }) => {

        if (res.quantity) {
          this.quantity = res.quantity + ' ' + 'Ltrs'
        } else {
          this.quantity = ' '
        }

        let json = {
          Date: moment(res.date).format("DD-MM-YYYY"),
          PumpName: res.companyName,
          KeyPersonName: res.hostName,
          KeyPersonMobile: res.hostPhone,
          Description: res.description,
          Quantity: this.quantity,
          Debit_Purchase: Number(res.purchase).toFixed(2),
          Credit_Payment: Number(res.payment).toFixed(2),
          Balance_Outstanding: res.balance,
        };

        this.transactionDataEXCEL.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.transactionDataEXCEL,
        "TransactionWiseReport"
      );

    } else {
      this.transactionDataEXCEL.length = 0

      this.transactionData.map((res: { quantity: string; date: moment.MomentInput; companyName: any; hostName: any; hostPhone: any; description: any; purchase: any; payment: any; balance: any; }) => {

        if (res.quantity) {
          this.quantity = res.quantity + ' ' + 'Ltrs'
        } else {
          this.quantity = ' '
        }
        let json = {
          Date: moment(res.date).format("DD-MM-YYYY"),
          PumpName: res.companyName,
          KeyPersonName: res.hostName,
          KeyPersonMobile: res.hostPhone,
          Description: res.description,
          Quantity: this.quantity,
          Debit_Purchase: Number(res.purchase).toFixed(2),
          Credit_Payment: Number(res.payment).toFixed(2),
          Balance_Outstanding: res.balance,
        };

        this.transactionDataEXCEL.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.transactionDataEXCEL,
        "TransactionWiseReport"
      );

    }
  }

  getSelectedMapId(fuelDealerCustomerMapId: string,companyName: any,hostName: any){
    this.fuelDealerCorpMapId = fuelDealerCustomerMapId;
    this.isSelectedAccountName = true;
    this.selectedAcc = companyName;
    this.selectedAccHost = hostName;
  }
  
  getTransactionwiseByfuelDealerId(fuelDealerId: any) {
    this.crData.length = 0;
    this.paymentData.length = 0;
    this.transitionwiseData.length = 0;
    this.transitionwiseDetails.length = 0;

    let data = {
      fuelDealerId: fuelDealerId,
      corporateId: this.transporterCorpId,
      startDate:moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),  //startDate,
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    }
    this.post.getTransactionwiseLedgerByDealerCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if(res.data.length || res.data1.length){
                
            this.crData = res.data;
            this.paymentData = res.data1;

            this.crData.map((bill: { estimatedRefuelDate: string; productName: string; vehicleNumber: string; purpose: string; creditAmount: number; companyName: string; hostName: string; hostPhone: string; actualCreditQuantity: string; lubeUnit: string; }) => {
              const dataCRJson = {
                transactionDate: '',
                productType: '',
                vehicleNumber: '',
                purpose:'',
                debitAmount: 0,
                payType: '',
                creditAmount: 0,
                companyName:'',
                hostName:'',
                hostPhone:'',
                quantity:'',
                lubeUnit:'',
              };
              
                dataCRJson.transactionDate = bill.estimatedRefuelDate;
                dataCRJson.productType = bill.productName;
                dataCRJson.vehicleNumber = bill.vehicleNumber;
                dataCRJson.purpose = bill.purpose;
  
                dataCRJson.debitAmount = bill.creditAmount;
                dataCRJson.payType = '';
  
                dataCRJson.creditAmount = 0;
                dataCRJson.companyName = bill.companyName;
                dataCRJson.hostName = bill.hostName;
                dataCRJson.hostPhone = bill.hostPhone;
                dataCRJson.quantity = bill.actualCreditQuantity;
                dataCRJson.lubeUnit = bill.lubeUnit;

                this.billData.push(dataCRJson);
            })
            this.paymentData.map((bill: { transacDate: moment.MomentInput; paymentMethod: string; chequeNO: string; grandTotalAmount: number; companyName: string; hostName: string; hostPhone: string; }) => {
              const dataPAYJson = {
                transactionDate: '',
                productType: '',
                vehicleNumber: '',
                purpose:'',
                debitAmount: 0,
                payType: '',
                creditAmount: 0,
                companyName:'',
                hostName:'',
                hostPhone:'',
                quantity:'',
                lubeUnit:'',
              };

                dataPAYJson.transactionDate = moment(bill.transacDate).format("YYYY-MM-DD");
                dataPAYJson.productType = '';
                dataPAYJson.vehicleNumber = '';
                dataPAYJson.purpose = 'PAYMENT';
  
                dataPAYJson.debitAmount = 0;
                dataPAYJson.payType = bill.paymentMethod+'-'+bill.chequeNO;
  
                dataPAYJson.creditAmount = bill.grandTotalAmount;
                dataPAYJson.companyName = bill.companyName;
                dataPAYJson.hostName = bill.hostName;
                dataPAYJson.hostPhone = bill.hostPhone;

                this.billData.push(dataPAYJson);
            })


            this.transitionwiseData = this.billData.sort((a: { transactionDate: number; }, b: { transactionDate: number; }) => (a.transactionDate < b.transactionDate ? -1 : 1 ))
            this.getFinalArray(this.transitionwiseData)
            
            
            if(res.data2.length){
              this.totalDiscount = res.data2[0].totalDiscount;
            }        
                   
          }else{
            alert("Data not found!")
            this.spinner.hide();
          }            
        } else {
          this.spinner.hide();
        }
      });
  }

  totalPendingoutstanding() {
    this.previousPendingOutstanding = 0;
    this.lastOpOutstanding = 0;
    if(this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 ||this.accessGroup == 21){
    this.spinner.show();
    if(this.fuelDealerCorpMapId){
      if(this.filterForm.value.startDate && this.filterForm.value.endDate){
        this.transitionwiseDetails.length = 0;
    const data = {
      fuelDealerCustomerMapId: this.fuelDealerCorpMapId,
    };
    this.post.getFuelCorpIdByMapIdPOST(data).subscribe((res) => {
      if (res) {
        this.previousPendingOutstanding = Number(res.data[0].previousOutstand);
        // this.getOutStanding(this.previousPendingOutstanding)
        
      }
    });
  }else{
    alert("Please select date")
    this.spinner.hide();
  }
  }else{
    if(this.filterForm.value.startDate && this.filterForm.value.endDate){
      this.transitionwiseDetails.length = 0;
  const data = {
    fuelDealerId: this.fuelDealerId,
  };
  this.post.getPreviousOutstandingByDealerIdPOST(data).subscribe((res) => {
    if (res) {
      this.previousPendingOutstanding = Number(res.data[0].previousOutstand);
      // this.getOutStanding1(this.previousPendingOutstanding)
      
    }
  });
}else{
  alert("Please select date")
  this.spinner.hide();
}
  }}else{
    this.spinner.show();
    if(this.fuelDealerCorpMapId){
      if(this.filterForm.value.startDate && this.filterForm.value.endDate){
        this.transitionwiseDetails.length = 0;
    const data = {
      fuelDealerCustomerMapId: this.fuelDealerCorpMapId,
    };
    this.post.getFuelCorpIdByMapIdPOST(data).subscribe((res) => {
      if (res) {
        this.previousPendingOutstanding = Number(res.data[0].previousOutstand);
        // this.getOutStanding(this.previousPendingOutstanding)
        
      }
    });
  }else{
    alert("Please select date")
    this.spinner.hide();
  }
  }else{
    alert("Please Select name!")
    this.spinner.hide();
  }
  }

  }
  
  getFinalArray(transitionwiseData: any[]){
    let debit = 0;
    transitionwiseData.map(bill => {
      const dataJson = {
        transactionDate: '',
        productType: '',
        purpose:'',
        vehicleNumber: '',
        debitAmount: 0,
        payType: '',
        creditAmount: 0,
        totalBalance: 0,
        companyName:'',
        hostName:'',
        hostPhone:'',
        quantity:'',
        lubeUnit:'',
      };
        debit = debit + (Number(bill.debitAmount) - (Number(bill.creditAmount)))
      
        dataJson.transactionDate = bill.transactionDate;
        dataJson.productType = bill.productType;
        dataJson.vehicleNumber = bill.vehicleNumber;
        dataJson.purpose = bill.purpose;

        dataJson.debitAmount = bill.debitAmount;
        dataJson.payType = bill.payType;

        dataJson.creditAmount = Number(bill.creditAmount);
        dataJson.totalBalance = this.lastOpOutstanding + debit;
        dataJson.companyName = bill.companyName;
        dataJson.hostName = bill.hostName;
        dataJson.hostPhone = bill.hostPhone;
        dataJson.lubeUnit = bill.lubeUnit;
        dataJson.quantity = bill.quantity;



        this.transitionwiseDetails.push(dataJson);
        this.spinner.hide(); 
        //console.log("ARRAY_NEW ",this.transitionwiseDetails)
    })
  }
}

