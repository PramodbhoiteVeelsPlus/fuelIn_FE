import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { MixedService } from '../../mixed/mixed.services';
import { StatsService } from '../../stats/stats.services';
import { ListWidgetService } from '../listWidget.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';

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
  selector: 'app-lists-widget5',
  templateUrl: './lists-widget5.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget5Component {
  addShiftForm = new FormGroup({
    date: new FormControl(''),
    operatorStaffId: new FormControl('', Validators.required),
    startTime: new FormControl(''),
    stopTime: new FormControl(''),
    shiftTimeId: new FormControl('1', Validators.required),
  });

  updateShiftForm = new FormGroup({
    date: new FormControl(''),
    operatorStaffId: new FormControl('', Validators.required),
    startTime: new FormControl(''),
    stopTime: new FormControl(''),
    closeDate: new FormControl(''),
    shiftTimeId: new FormControl('', Validators.required),
  });

  fuelDealerId: any;
  dealerCorporateId: any;
  dealerData: any;
  accessGroup: any;
  selectedDate: string;
  allShift: any = [];
  modalRef: any;
  closeResult: string;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  active: number;
  isADDEDIT: boolean = false;
  isVIEW: boolean = false;
  shiftIdUpdate: any;
  CreditRequestDataArrayUpdate: any;
  nozzleDetailsUpdate: any;
  shiftTimeId: any;
  shiftTimeDetail: string;
  pumpInfraUpdate: boolean;
  nozzleCountUpdate: any;
  operatorName: string;
  performStatus: any;
  staffId: any;
  noTally: boolean;
  tallyTableId: any;
  totalCreditTallyUpdate: any;
  totalCashTallyUpdate: any;
  totalDigitalTallyUpdate: any;
  expenseAmountUpdate: any;
  shortamountUpdate: any;
  totalAmountUpdate: string;
  totalCreditTally: any;
  totalCreditTally1: any;
  totalCashTally: any;
  totalDigitalTally: any;
  expenseAmount: any;
  shortamount: any;
  totalAmount: string;
  expenseAmtDetails: any;
  meterSalesUpdate: string;
  meterSales: string;
  shiftId: any;
  modalRefpass: any;
  fuelShiftId: string;
  fuelDealerStaffId: any;
  operatorVPID: any;
  operatorPersonID: any;
  operatorVPIDLength: any;
  operatorVPIDLastThree: any;
  operatorNAME: string;
  managerName: string;
  pumpCity: any;
  fuelShiftDetailsId: any;
  nozzleCount: any;
  entryProduct1: boolean;
  entryProduct2: boolean;
  entryProduct3: boolean;
  entryProduct4: boolean;
  entryProduct5: boolean;
  productName: string;
  meterSaleQuantity: string;
  meterSaleAmount: string;
  productName1: string;
  meterSaleQuantity1: string;
  meterSaleAmount1: string;
  productName2: string;
  meterSaleQuantity2: string;
  meterSaleAmount2: string;
  productName3: string;
  meterSaleQuantity3: string;
  meterSaleAmount3: string;
  productName4: string;
  meterSaleQuantity4: string;
  meterSaleAmount4: string;
  isStart: boolean;
  nozzleDetails: any;
  difference: number;
  isPumpNozzle: boolean;
  staffDetails: any = [];
  fuelShiftTimeDetails: any = [];
  password: any;
  userId: any;
  modalDeleteShift: any;

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
  }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    this.dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.accessGroup = element.accessGroupId;
    this.managerName = element.firstName + ' ' + element.lastName;
    this.pumpCity = this.dealerData.city
    this.userId = element.userId;
    this.addShiftForm.controls['date'].setValue(moment(new Date()).format('DD-MM-YYYY'));
    this.getAllAttendantsByDid(this.fuelDealerId)
    this.getShiftDetails(this.fuelDealerId)
    this.cd.detectChanges()
  }

  getAllOngoingShift(fuelDealerId: any) {
    this.selectedDate = moment(this.addShiftForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
    // this.requestTransporterLube.controls["estimatedRefuelDate"].setValue(this.addShiftForm.value.date);
    // this.requestTransporter.controls["estimatedRefuelDate"].setValue(this.addShiftForm.value.date);
    // this.requestTransporter.controls["priceDate"].setValue(this.addShiftForm.value.date);  
    // this.cashBillLubricantForm.controls["priceDate"].setValue(this.addShiftForm.value.date); 
    // this.digitalLubricantForm.controls["priceDate"].setValue(this.addShiftForm.value.date);  

    const data = {
      dealerId: this.fuelDealerId,
      date: moment(this.addShiftForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),

    };
    this.post.getShiftOngoingDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.allShift = res.data;
          this.post.setRouting(this.selectedDate)
          console.log("data1", this.selectedDate)
          // this.router.navigate(['/credit/cashBillInvoice']);
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
    // this.shiftReport()
  }

  shiftReport() {
    // this.getAllOngoingShiftForClose(this.fuelDealerId)
    // this.getDigitalTotalByDate(this.loginCorporateId);    
    // this.getFuelCreditPaymentByDate( this.loginCorporateId)
    // this.getTotalMeterSalesAndTallyEntery(this.fuelDealerId);
    // this.getTallyDetails(this.fuelDealerId);
    // this.getFuelCreditByDate(this.fuelDealerId);
    // this.getSalesDetailsProductWise(this.fuelDealerId);
    // this.getCRDetailsProductWise(this.fuelDealerId);
    // this.getShiftWiseDetails(this.fuelDealerId);
    // this.getNzWise(this.fuelDealerId);
    // this.getTotalCreditSalesPaymentByDay(this.fuelDealerId);
  }

  addNewShiftModal(startShift: any) {
    this.modalRef = this.modalService.open(startShift, { size: 'lg' });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  getShiftDetailsByShiftIdUpdate(idfuelShiftDetails: any, EDIT: string) {
    if (EDIT == 'EDIT') {
      this.active = 2
      this.isADDEDIT = true;
      this.isVIEW = false;
    } else {
      this.active = 3
      this.isADDEDIT = false;
      this.isVIEW = true;
    }

    this.shiftIdUpdate = idfuelShiftDetails;
    this.CreditRequestDataArrayUpdate.length = 0
    this.nozzleDetailsUpdate.length = 0
    const data = {
      fuelShiftId: idfuelShiftDetails,
    };
    this.post.getShiftDetailsByShiftIdPOST(data).subscribe((res) => {
      if (res.status == 'OK') {

        this.shiftTimeId = res.data[0].shiftTimeId
        this.updateShiftForm.controls["shiftTimeId"].setValue(res.data[0].shiftTimeId)
        this.shiftTimeDetail = res.data[0].fuelShiftTimeDetails + ' ' + res.data[0].fuelShiftTimeShiftName
        if (res.data2.length) {
          this.pumpInfraUpdate = true;
          this.CreditRequestDataArrayUpdate = res.data2;
          this.nozzleDetailsUpdate = res.data2;
          this.nozzleCountUpdate = res.data2.length
        } else {
          this.pumpInfraUpdate = false;
          this.nozzleCountUpdate = '0'
        }

        this.updateShiftForm.controls["date"].setValue(moment(res.data[0].openDate).format("DD-MM-YYYY"))
        this.updateShiftForm.controls["startTime"].setValue(res.data[0].openTime)
        if (res.data[0].performStatus == 'OPEN') {
          this.updateShiftForm.controls["stopTime"].setValue(moment(new Date()).format('HH:mm:ss'))
          this.updateShiftForm.controls["closeDate"].setValue(moment(new Date()).format('YYYY-MM-DD'))
        } else {
          this.updateShiftForm.controls["stopTime"].setValue(res.data[0].closeTime)
          this.updateShiftForm.controls["closeDate"].setValue(res.data[0].closeDate)
        }
        this.updateShiftForm.controls["operatorStaffId"].setValue(res.data[0].firstName + ' ' + res.data[0].lastName)
        this.operatorName = res.data[0].firstName + ' ' + res.data[0].lastName

        this.performStatus = res.data[0].performStatus
        this.staffId = res.data[0].fuelDealerStaffId

        //  this.getOperatorVPId(this.staffId);
        //   this.getAllFuelCreditByStaffIdDate(this.staffId)
        if (res.data1.length) {
          this.noTally = false;
          this.tallyTableId = res.data1[0].fuelShiftTallySalesId
          this.totalCreditTallyUpdate = res.data1[0].totalCreditTally;
          this.totalCashTallyUpdate = res.data1[0].totalCashTally;
          this.totalDigitalTallyUpdate = res.data1[0].paytmTotalAmount;
          this.expenseAmountUpdate = res.data1[0].expenseAmount;
          this.shortamountUpdate = res.data1[0].shortamount;
          this.totalAmountUpdate = Number(res.data1[0].totalAmountTally).toFixed(2);
          this.totalCreditTally = res.data1[0].totalCreditTally;
          this.totalCreditTally1 = res.data1[0].totalCreditTally;
          this.totalCashTally = res.data1[0].totalCashTally;
          this.totalDigitalTally = res.data1[0].paytmTotalAmount;
          this.expenseAmount = res.data1[0].expenseAmount;
          this.shortamount = res.data1[0].shortamount;
          this.totalAmount = Number(res.data1[0].totalAmountTally).toFixed(2);
          this.expenseAmtDetails = res.data1[0].expenseAmtDetails;
        } else {
          this.noTally = true;
        }

        this.meterSalesUpdate = Number(res.data3[0].meterSaleAmount).toFixed(2)
        this.meterSales = Number(res.data3[0].meterSaleAmount).toFixed(2)


        //  this.getDigitalEntryDetailsByShiftIdUpdate(this.shiftId);
        //  this.getCASHDetailsByShiftIdUpdate(this.shiftId);
        //  this.getTotalTallyUpdate() 
      } else {
      }
    });

    //  this.getDigitalEntryDetailsByShiftId(idfuelShiftDetails)
    //  this.getCASHDetailsByShiftId(idfuelShiftDetails)
    //  // this.getLubeCashBillByShiftId(idfuelShiftDetails)
    //  this.getDigitalLubeByShiftId(idfuelShiftDetails)
  }

  askForPass(PasswordTemplate: any, idfuelShiftDetails: any) {
    this.shiftId = idfuelShiftDetails
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

  pageChangeEvent(event: number) {
    this.p = event;
    this.getAllOngoingShift(this.fuelDealerId);
  }

  createShiftId() {
    // this.clearTallyModal();
    this.spinner.show();
    if (this.addShiftForm.value.operatorStaffId) {
      if (this.addShiftForm.value.date) {

        this.fuelShiftId =
          moment(this.addShiftForm.value.date, [
            'DD-MM-YYYY',
          ]).format('DDMMYYYY') +
          moment(new Date()).format('HH') +
          this.operatorVPIDLastThree;

        // console.log('fuelShiftId ', this.fuelShiftId);
        this.startShift();

      } else {
        alert('Please Select Date..');
        this.spinner.hide();
      }
    } else {
      alert('Please Select Operator..');
      this.spinner.hide();
    }
  }

  checkOperatorShift(id: any) {
    this.spinner.show();
    this.fuelDealerStaffId = id.target.value;
    const data = {
      fuelDealerStaffId: this.fuelDealerStaffId,
    };
    this.post.checkOperatorShiftPOST(data).subscribe((res) => {
      if (res.data.length) {
        alert(
          'This Operator is Already on Shift ' +
          res.data[0].fuelShiftId +
          '...'
        );
        this.addShiftForm.controls['operatorStaffId'].setValue('');
        this.spinner.hide();
      } else {
        this.getOperatorVPId(this.fuelDealerStaffId);
      }
    });
  }

  getOperatorVPId(fuelDealerStaffId: any) {
    const data = {
      fuelDealerStaffId: fuelDealerStaffId,
    };
    this.post.getOperatorVPIdPOST(data).subscribe((res) => {
      if (res.data.length) {
        this.operatorVPID = res.data[0].veelsPlusId;
        this.operatorPersonID = res.data[0].personId;
        this.operatorNAME = res.data[0].firstName + ' ' + res.data[0].lastName;
        this.operatorVPIDLength = this.operatorVPID.length;
        this.operatorVPIDLastThree = this.operatorVPID.substring(
          Number(this.operatorVPIDLength) - 3,
          Number(this.operatorVPIDLength)
        );
        this.spinner.hide();
      } else {
        alert(
          'Sorry..Something going wrong.. Please Refresh page or Re-Login..'
        );
        this.spinner.hide();
      }
    });
  }

  startShift() {
    if (this.accessGroup == 12) {
      const data = {
        fuelDealerStaffId: this.addShiftForm.value.operatorStaffId,
        fuelDealerId: this.fuelDealerId,
        fuelShiftId: this.fuelShiftId, // Create Id
        openDate: moment(this.addShiftForm.value.date, [
          'DD-MM-YYYY',
        ]).format('YYYY-MM-DD'),
        openTime: moment(new Date()).format('HH:mm:ss'),
        locatinAddress: this.pumpCity,
        createdBy: 'OWNER',
        createdByName: this.managerName,
        shiftTimeId: this.addShiftForm.value.shiftTimeId,
      };
      this.post
        .startShiftFromPORATALPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {
            alert('Shift start successfully...');
            this.fuelShiftDetailsId = res.data.insertId;
            this.getAllOngoingShift(this.fuelDealerId)
            this.modalRef.close('close');
            this.addShiftForm.controls["operatorStaffId"].setValue("");
            this.addShiftForm.controls["shiftTimeId"].setValue("1");
            this.spinner.hide();
          } else {
            alert('Please enter valid details..');
            this.spinner.hide();
          }
        });
    } else {
      if (this.accessGroup == 14) {
        const data = {
          fuelDealerStaffId: this.addShiftForm.value.operatorStaffId,
          fuelDealerId: this.fuelDealerId,
          fuelShiftId: this.fuelShiftId, // Create Id
          openDate: moment(this.addShiftForm.value.date, [
            'DD-MM-YYYY',
          ]).format('YYYY-MM-DD'),
          openTime: moment(new Date()).format(
            'HH:mm:ss'
          ),
          locatinAddress: this.pumpCity,
          createdBy: 'MANAGER',
          createdByName: this.managerName,
          shiftTimeId: this.addShiftForm.value.shiftTimeId,
        };
        this.post
          .startShiftFromPORATALPOST(data)
          .subscribe((res) => {
            if (res.status == 'OK') {
              alert('Shift start successfully...');
              this.fuelShiftDetailsId = res.data.insertId;
              this.getAllOngoingShift(this.fuelDealerId)
              this.modalRef.close('close');
              this.addShiftForm.controls["operatorStaffId"].setValue("");
              this.addShiftForm.controls["shiftTimeId"].setValue("1");
              this.spinner.hide();
            } else {
              alert('Please enter valid details..');
              this.spinner.hide();
            }
          });
      }
    }
  }

  StopShift() {
    this.spinner.show();
    const data = {
      fuelShiftDetailsId: this.fuelShiftDetailsId,
      closeDate: moment(new Date()).format('YYYY-MM-DD'),
      closeTime: moment(new Date()).format('HH:mm:ss'),
      nozzelCount: this.nozzleCount,
    };
    this.post
      .closeShiftFromPORTALPOST(data)
      .subscribe((res) => {
        if (res.status == 'OK') {
          alert('Shift Details Added successfully...');
          // this.clearTallyModal();
          this.addShiftForm.controls['operatorStaffId'].setValue('');
          this.entryProduct1 = false;
          this.entryProduct2 = false;
          this.entryProduct3 = false;
          this.entryProduct4 = false;
          this.entryProduct5 = false;
          this.productName = ''
          this.meterSaleQuantity = ''
          this.meterSaleAmount = ''
          this.productName1 = ''
          this.meterSaleQuantity1 = ''
          this.meterSaleAmount1 = ''
          this.productName2 = ''
          this.meterSaleQuantity2 = ''
          this.meterSaleAmount2 = ''
          this.productName3 = ''
          this.meterSaleQuantity3 = ''
          this.meterSaleAmount3 = ''
          this.productName4 = ''
          this.meterSaleQuantity4 = ''
          this.meterSaleAmount4 = ''
          this.spinner.hide();
          this.isStart = false;
          this.fuelShiftDetailsId = ''
          this.nozzleDetails.length = 0
          this.difference = 0
          this.isPumpNozzle = false;
          window.location.reload();
        } else {
          alert('Error to Stop. Please Re-Login..');
          this.spinner.hide();
        }
      });
  }

  getInfraDetailsByShiftId(idfuelShiftDetails: any) {
    const data = {
      shiftId: idfuelShiftDetails,
    };
    this.post.getInfraDetailsByShiftIdPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.data1.length) {
          this.nozzleCount = res.data1[0].nozzleCount;
          this.meterSales = Number(res.data1[0].meterSales).toFixed(2);
          // this.getDifference();
        }
      }
    });
  }

  getAllAttendantsByDid(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getAllAttendantsByDidPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.staffDetails = res.data;
        this.cd.detectChanges()
      } else {
        this.cd.detectChanges()
      }
    });
  }

  getShiftDetails(fuelDealerId: any) {
    this.fuelShiftTimeDetails.length = 0;
    let data = {
      fuelShiftTimeDealerId: fuelDealerId
    }

    this.post.getFuelShiftTimeDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.fuelShiftTimeDetails = res.data;
            this.cd.detectChanges()
          } else {
            this.fuelShiftTimeDetails.length = 0;
            this.cd.detectChanges()
          }
        }
        else {
        }
      })
  }

  comparePasswordForDelete(deleteShift: any) {
    // var cancelReq
    const data = {
      password: this.password,
      userId: this.userId
    };
    this.post.comparePasswordPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          this.modalRefpass.close('close')
          this.password = "";
          this.deleteShiftModal(deleteShift)
        } else {
          alert(result.msg)
          this.password = "";
        }
      });
  }

  deleteShiftModal(deleteShift: any) {
    this.modalDeleteShift = this.modalService.open(deleteShift, { size: 'sm' })
    this.modalDeleteShift.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteShiftById() {
    if (this.shiftId) {
      let data = {
        shiftId: this.shiftId,
      }
      this.post.deleteShiftByShiftIdPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("Shift Deleted successfully..!")
            this.modalDeleteShift.close('close')
            this.getAllOngoingShift(this.fuelDealerId);
          } else {
            alert("Error to Delete..")
          }
        });
    } else {
      alert("Error to Delete..")
    }
  }
  
  closeModal(){
    this.modalDeleteShift.close('close') 
  }
}
