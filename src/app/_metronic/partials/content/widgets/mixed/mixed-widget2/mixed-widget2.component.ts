import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { MixedService } from '../mixed.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreditRequestLube } from 'src/app/pages/dealer/credit/creditRequestLube.modal';
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
  selector: 'app-mixed-widget2',
  templateUrl: './mixed-widget2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class MixedWidget2Component implements OnInit {
  @ViewChild("myinput") myInputField: ElementRef;
  chartOptions: any = {};

  requestTransporterLube = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    creditQuantity: new FormControl(),
    creditAmount: new FormControl(),
    estimatedRefuelDate: new FormControl(),
    actualCreditAmount: new FormControl(),
    actualCreditQuantity: new FormControl(),
    requestType: new FormControl(),
    requestTypeCR: new FormControl(),
    mobile: new FormControl(),
    vehicleNumber: new FormControl(),
    productPrice: new FormControl('', [Validators.required]),
    priceDate: new FormControl(),
    selectPersonId: new FormControl('', [Validators.required]),
    manualCrNumber: new FormControl(),
    productName1: new FormControl(),
    nameLube: new FormControl(),
    unitLube: new FormControl(),
  });

  requestTransporter1 = new FormGroup({
    dealerName: new FormControl(),
    dealerLocation: new FormControl(),
    personName: new FormControl(),
    personPhone1: new FormControl(),
    selectedCorp: new FormControl('', [Validators.required]),
  });

  fuelDealerId: any;
  dealerCorporateId: any;
  dealerLoginVPId: any;
  acceesGroup: any;
  managerVPPersonId: any;
  managerName: string;
  managerPersonId: any;
  dealerAccess: boolean = false;
  liteAccess: boolean = false;
  viewCorpFlag: any = [];
  isAlert: boolean = false;
  fuelDealerCustomerMapId: any;
  isSelected1: boolean = false;
  mappingPreviousStatus: any;
  dealerName: any;
  personName: string;
  gstNumber: any;
  dealerLocation: string;
  islastCRDate: boolean = false;
  lastCRDate: any;
  personId: any;
  fuelDealerSQLId: any;
  PANno: any;
  smsMappingStatus: any;
  emailMappingStatus: any;
  updateCorporateId: any;
  personPhone1: any;
  fuelDealerCorpMapIdNew: any;
  rangeFrom: any = 0;
  rangeTo: any = 0;
  corporateList: any = [];
  calOutstanding: number;
  modalRef: any;
  closeResult: string;
  autoManualStatus: any = 'FALSE';
  countLube: any = 1;
  count: any = 1;
  CreditRequestLube = new CreditRequestLube()
  autoManualNumberLube: any;
  CreditRequestDataLube: any = [];
  lubricantList: any = [];
  combineManualNumber: string;
  isVehSelectLube: boolean = false;
  indexFuelLube: number;
  closeRequestDate = moment(new Date()).format("DD-MM-YYYY");
  todayDate = moment(new Date()).format("DD-MM-YYYY");
  isBalance1: boolean = false;
  isCRQUANTITY: boolean = false;
  isQUANTITY: boolean = false;
  @ViewChild('content') content: any;
  fuelDealerStaffId: any;
  isVehicleViewed: boolean = false;
  isTable1: boolean = false;
  isTable: boolean = false;
  isTable2: boolean = false;

  constructor(
    private post: MixedService,
    private post1: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.acceesGroup = element.accessGroupId;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.managerName = element.firstName + ' ' + element.lastName
    if (element.accessGroupId == 12 || element.accessGroupId == 14 || element.accessGroupId == 19 || element.accessGroupId == 21) {
      this.dealerAccess = true
      if (element.accessGroupId == 19 || element.accessGroupId == 21) {
        this.liteAccess = true
      }
    }

    if(element.accessGroupId == '12'){
      this.autoManualStatus = dealerData.autoManualStatus;
      this.autoManualNumberLube = dealerData.assignedAutoManualNumberLube;
    } 
    
    if(element.accessGroupId == '14'){
      var managerData = JSON.parse(localStorage.getItem('managerData') || '{}');
      this.autoManualNumberLube = managerData.assignedAutoManualNumberLube;
      this.autoManualStatus = managerData.autoManualStatus;
    } 
    this.requestTransporterLube.controls["estimatedRefuelDate"].setValue(this.todayDate);
    this.getCorporateMappedListByDealerId(this.fuelDealerId);
    this.getLubricants(this.fuelDealerId)
    this.addFormRequestLube();
    this.getFuelStaffIdByfuelDealerId(this.fuelDealerId);
    this.cd.detectChanges()
  }


  getFuelStaffIdByfuelDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
    }
    this.post1.getFuelStaffIdByfuelDealerIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.fuelDealerStaffId = res.data[0].fuelDealerStaffId;
        }
        else {

        }
      })
  }
  
  getFlagStatusByCorpId(corporateIdForFlag: any) {
    let data = {
      corporateIdForFlag: corporateIdForFlag
    }
    this.post1.getFlagStatusByCorpIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.viewCorpFlag = res.data
          this.isAlert = true;
          this.openModal();
          setTimeout(() => {
            this.isAlert = false;;
          }, 2000);
          setTimeout(() => {
            this.isAlert = true;;
          }, 4000);
          setTimeout(() => {
            this.isAlert = false;;
          }, 6000);
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
        }
      });
  }

  getDetailsByfuelDealerCustomerMapIdId(id: any) {
    if (id.target.value) {
      this.fuelDealerCustomerMapId = id.target.value;
      this.getCorporateInfoByfuelDealerCustomerMapId(this.fuelDealerCustomerMapId);
      this.cd.detectChanges()
    }
    else {
      alert("Please select customer")
      this.cd.detectChanges()
    }
  }

  getCorporateInfoByfuelDealerCustomerMapId(customerName: any) {
    let data = {
      fuelDealerId: this.fuelDealerId,
      customerName: customerName,
    }
    this.post1.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.isSelected1 = true;
          this.mappingPreviousStatus = res.data[0].mappingPreviousStatus;
          if (res.data[0].mappingPreviousStatus == "FALSE") {
            this.dealerName = res.data[0].companyName;
            this.personName = res.data[0].firstName + ' ' + res.data[0].lastName;
            this.gstNumber = res.data[0].GSTNumber;
          }
          else {
            this.dealerName = res.data[0].mappingCompanyName;
            this.personName = res.data[0].mappingCustomerName;
            this.gstNumber = res.data[0].mappingGST;
          }
          if (res.data[0].city == '' || res.data[0].city == 'undefined') {
            this.dealerLocation = ''
          } else {
            let cityarea = res.data[0].cityArea
            if (cityarea) {
              this.dealerLocation = res.data[0].cityArea + ',' + res.data[0].city;
            } else {
              this.dealerLocation = res.data[0].city;

            }
          }
          if (res.data[0].lastCRDate) {
            this.lastCRDate = res.data[0].lastCRDate;
            this.islastCRDate = true;
          } else {
            this.islastCRDate = false;
          }

          this.fuelDealerSQLId = res.data[0].fuelDealerId;
          this.PANno = res.data[0].PANno;
          this.smsMappingStatus = res.data[0].isMappingSMS;
          this.emailMappingStatus = res.data[0].isMappingEmail;
          this.updateCorporateId = res.data[0].corporateId;
          this.personPhone1 = res.data[0].phone1;
          this.fuelDealerCorpMapIdNew = res.data[0].fuelDealerCustomerMapId;
          this.rangeFrom = res.data[0].manualNumberStart;
          this.rangeTo = res.data[0].manualNumberEnd;
          this.getFlagStatusByCorpId(res.data[0].corporateId)
          this.getOutstandingBuCustMapId(this.fuelDealerCorpMapIdNew);
          this.requestTransporter1.controls["dealerName"].setValue(res.data[0].companyName);
          this.requestTransporter1.controls["dealerLocation"].setValue(res.data[0].cityArea + ',' + res.data[0].city);
          this.requestTransporter1.controls["personName"].setValue(res.data[0].firstName + ' ' + res.data[0].lastName);
          this.requestTransporter1.controls["personPhone1"].setValue(res.data[0].phone1);
          this.personId = res.data[0].personId;
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
        }
      });
  }

  getCorporateMappedListByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getCorporatesAllMappedRequestByDealerPOST(data)
      .subscribe(res => {
        if (res) {
          this.corporateList = res.data;

        } else {
        }
      }
      );
  }

  getOutstandingBuCustMapId(fuelDealerCustomerMapId: any) {

    let data = {
      custMapId: fuelDealerCustomerMapId
    }
    this.post1.getOutstandingByCustMapIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.calOutstanding = Number(res.data[0].netOS)
          this.cd.detectChanges()
        }
      })
  }

  viewFlag(viewFlagModel: any) {

    this.modalRef = this.modalService.open(viewFlagModel, { size: 'lg' });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  addFormRequestLube() {
    if (this.autoManualStatus == 'TRUE') {
      this.countLube = this.countLube + 1;

      this.CreditRequestLube = new CreditRequestLube();
      this.CreditRequestLube.manualNumberLube = this.autoManualNumberLube
      this.CreditRequestDataLube.push(this.CreditRequestLube);
    } else {
      this.countLube = this.countLube + 1;
      if (this.countLube < 12) {
        this.CreditRequestLube = new CreditRequestLube();
        this.CreditRequestDataLube.push(this.CreditRequestLube);
      }
      else {
        this.countLube = 11;
        alert("Please save 10 credit entries, before adding more credit entries for a customer (max entries allowed per submit is currently capped at 5)")
      }
    }
  }

  getLubeDetails(id: any, i: any) {
    this.spinner.show();
    let data = {
      lubricantsId: id.target.value,
    }
    this.post.getLubricantByIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data.length) {
            this.CreditRequestDataLube[i].unitLube = res.data[0].lubricantsUnit;
            this.CreditRequestDataLube[i].nameLube = res.data[0].lubricantsName;
            this.spinner.hide();
            this.setNameLube();
            this.setunitLube();
          } else {
            alert("Error..!")
            this.setNameLube()
            this.spinner.hide();
          }
        }
      })
  }

  setNameLube() {
    this.requestTransporterLube.controls["nameLube"].setValue(this.CreditRequestLube.nameLube)
  }

  setunitLube() {
    this.requestTransporterLube.controls["unitLube"].setValue(this.CreditRequestLube.unitLube)
  }

  getLubricants(fuelDealerSQLId: any) {
    let data = {
      fuelDealerId: fuelDealerSQLId
    }
    this.post.getLubricantsPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.lubricantList = res.data;
        }
      })
  }

  setManualNumberLube(i: any) {
    if (Number(this.CreditRequestLube.manualNumberLube) >= Number(this.rangeFrom) && Number(this.CreditRequestLube.manualNumberLube) <= Number(this.rangeTo) || Number(this.rangeTo) == 0) {
      if (Number(this.rangeTo) == 0) {
        this.requestTransporterLube.controls["manualCrNumber"].setValue(this.CreditRequestLube.manualNumberLube)
        this.checkManualNumRangeForNotAssign(this.CreditRequestLube.manualNumberLube, i, 'LUBE')
      } else {
        this.requestTransporterLube.controls["manualCrNumber"].setValue(this.CreditRequestLube.manualNumberLube)
        this.checkBillnameLube(this.CreditRequestLube.manualNumberLube, i)
      }
    } else {
      if (this.autoManualStatus == 'TRUE') {
        this.requestTransporterLube.controls["manualCrNumber"].setValue(this.CreditRequestLube.manualNumberLube)
      } else {
        alert('manual number exceed limit!')
        this.CreditRequestDataLube[i].manualNumberLube = '';
        this.requestTransporterLube.controls["manualCrNumber"].setValue('')
      }
    }
  }

  checkManualNumRangeForNotAssign(manualNumber: any, i: string | number, purpose: string) {
    let data = {
      manualNumber: manualNumber,
      fuelDealerId: this.fuelDealerId,
    }
    this.post1.checkManualNumRangeForNotAssignPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          alert('Manual number series already Assign To Other Customer')
          this.combineManualNumber = '';
          this.requestTransporterLube.controls["manualCrNumber"].setValue('')

          if (this.CreditRequestDataLube.length) {
            this.CreditRequestDataLube[i].manualNumberLube = '';
          }
        } else {
          if (purpose == 'LUBE') {
            this.checkBillnameLube(this.CreditRequestLube.manualNumberLube, i)
          }
        }
      })
  }

  checkBillnameLube(manualNumber: any, i: string | number) {
    let data = {
      manualNumber: manualNumber,
      fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
      fuelDealerId: this.fuelDealerId,
      purpose: "LUBE"
    }
    this.post1.getManualNumberPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          alert('Manual number already exist')
          this.CreditRequestDataLube[i].manualNumberLube = '';
          this.requestTransporterLube.controls["manualCrNumber"].setValue('')
          this.requestTransporterLube.controls["manualCrNumber"].setValue('')
          this.CreditRequestDataLube[i].manualNumberLube = '';
        }
      })
  }

  setVehicleNumberLube() {
    this.isVehSelectLube = true;
    this.requestTransporterLube.controls["vehicleNumber"].setValue(this.CreditRequestLube.vehicleNumberLube)
    if (this.autoManualStatus == 'TRUE') {
      this.requestTransporterLube.controls["manualCrNumber"].setValue(this.CreditRequestLube.manualNumberLube)
    }
  }

  setAmountLube() {
    this.requestTransporterLube.controls["creditAmount"].setValue(this.CreditRequestLube.creditAmountLube)
  }

  setQuantityLube() {
    this.requestTransporterLube.controls["creditQuantity"].setValue(this.CreditRequestLube.creditQuantityLube)
  }

  removeFormRequestLube(i: number, removeTable: any) {
    this.indexFuelLube = i;
    this.modalRef = this.modalService.open(removeTable, { size: 'md' });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  submitByDealerForLube() {
    if (this.acceesGroup == 12 || this.acceesGroup == 19) {
      this.spinner.show()
      if (this.requestTransporterLube.value.estimatedRefuelDate) {
        if (this.requestTransporterLube.value.creditAmount || this.requestTransporterLube.value.creditQuantity) {
          if (this.fuelDealerCorpMapIdNew) {
            if (this.requestTransporterLube.value.creditQuantity) {
              if (this.personId) {
                if (this.requestTransporterLube.value.nameLube) {
                  if (this.requestTransporterLube.value.manualCrNumber) {
                    if (this.requestTransporterLube.value.unitLube) {

                      let data = {
                        lubeAllData: this.CreditRequestDataLube,
                        lubricantsFuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                        reqQuantity: this.requestTransporterLube.value.actualCreditQuantity,
                        reqCreditAmount: this.requestTransporterLube.value.actualCreditAmount,
                        estimatedRefuelDate: moment(this.requestTransporterLube.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                        fuelDealerId: this.fuelDealerSQLId,
                        lubricantsFuelCorporateId: this.dealerCorporateId,
                        creditSource: "DEALER",
                        PANno: this.PANno,
                        lubricantsTransDateTime: moment(this.closeRequestDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                        lubricantsTransactionTime: moment(new Date()).format('hh:mm:ss'),
                        creditAmount: this.requestTransporterLube.value.actualCreditAmount,
                        transactionStatus: 'COMPLETE',
                        fuelDealerStaffId: this.fuelDealerStaffId,
                        actualCreditQuantity: this.requestTransporterLube.value.actualCreditQuantity,
                        createdAt: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                        productRate: this.requestTransporterLube.value.productPrice,
                        vehicleNumber: this.requestTransporterLube.value.vehicleNumber,
                        manualCrNumber: this.requestTransporterLube.value.manualCrNumber,
                        personId: this.personId,
                        isMappingSMS: this.smsMappingStatus,
                        isMappingEmail: this.emailMappingStatus,
                        autoManualStatus: this.autoManualStatus
                      }
                      this.post.addCreditLubeReqByDealerForAllPOST(data)
                        .subscribe(res => {
                          if (res.status == "OK") {
                            alert("Credit Added Sccessfully!");
                            this.isBalance1 = false;
                            this.isSelected1 = false;
                            this.CreditRequestDataLube = [];
                            this.countLube = 1;
                            this.closeModal()
                            this.spinner.hide();
                            // this.cd.detectChanges()
                            if (this.autoManualStatus == 'TRUE') {
                              this.myInputField.nativeElement.focus();
                              this.updateAssignedAutoManualNumber('LUBE', res.count)
                              this.isCRQUANTITY = false;
                              this.isQUANTITY = false;
                              this.CreditRequestDataLube = [];
                              this.countLube = 1;
                              this.addFormRequestLube()
                              this.closeModal()
                              this.checkDates(this.fuelDealerCorpMapIdNew, moment(this.requestTransporterLube.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                              this.requestTransporterLube.controls["requestType"].setValue("showamount");
                              this.requestTransporterLube.controls["requestTypeCR"].setValue("showamount");
                              this.requestTransporterLube.controls["priceDate"].setValue(this.todayDate);

                              this.requestTransporterLube.controls["manualCrNumber"].setValue("");
                              this.requestTransporterLube.controls["creditQuantity"].setValue("");
                              this.requestTransporterLube.controls["creditAmount"].setValue("");
                              this.requestTransporterLube.controls["vehicleNumber"].setValue("");
                            } else {
                              this.isCRQUANTITY = false;
                              this.isQUANTITY = false;
                              this.CreditRequestDataLube = [];
                              this.countLube = 1;
                              this.addFormRequestLube()
                              this.checkDates(this.fuelDealerCorpMapIdNew,moment(this.requestTransporterLube.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                              this.requestTransporterLube.controls["requestType"].setValue("showamount");
                              this.requestTransporterLube.controls["requestTypeCR"].setValue("showamount");
                              this.requestTransporterLube.controls["priceDate"].setValue(this.todayDate);

                              this.requestTransporterLube.controls["manualCrNumber"].setValue("");
                              this.requestTransporterLube.controls["creditQuantity"].setValue("");
                              this.requestTransporterLube.controls["creditAmount"].setValue("");
                              this.requestTransporterLube.controls["vehicleNumber"].setValue("");
                            }

                          } else {
                            alert("Error to Created Request!")
                            this.isBalance1 = false;
                            this.spinner.hide();
                            this.cd.detectChanges()
                          }
                        });
                    }
                    else {
                      alert("Please select unit!")
                      this.spinner.hide();
                      this.cd.detectChanges()
                    }
                  } else {
                    alert("Please Enter Bill / Ref Number!")
                    this.spinner.hide();
                    this.cd.detectChanges()
                  }
                } else {
                  alert("Please enter lubricant name!")
                  this.spinner.hide();
                  this.cd.detectChanges()
                }
              } else {
                this.spinner.hide();
                this.cd.detectChanges()
              }
            }
            else {
              alert("Please Enter Quantity!")
              this.spinner.hide();
              this.cd.detectChanges()
            }
          }
          else {
            alert("Please Select customer!")
            this.spinner.hide();
            this.cd.detectChanges()
          }
        }
        else {
          alert("Please Enter Amount or Quantity!")
          this.spinner.hide();
          this.cd.detectChanges()
        }
      }
      else {
        alert("Please Select Date!")
        this.spinner.hide();
        this.cd.detectChanges()
      }
    } else {
      if (this.acceesGroup == 14 || this.acceesGroup == 21) {
        this.spinner.show()
        if (this.requestTransporterLube.value.estimatedRefuelDate) {
          if (this.requestTransporterLube.value.creditAmount || this.requestTransporterLube.value.creditQuantity) {
            if (this.fuelDealerCorpMapIdNew) {
              if (this.requestTransporterLube.value.creditQuantity) {
                if (this.personId) {
                  if (this.requestTransporterLube.value.nameLube) {
                    if (this.requestTransporterLube.value.manualCrNumber) {
                      if (this.requestTransporterLube.value.unitLube) {

                        let data = {
                          lubeAllData: this.CreditRequestDataLube,
                          lubricantsFuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                          reqQuantity: this.requestTransporterLube.value.actualCreditQuantity,
                          reqCreditAmount: this.requestTransporterLube.value.actualCreditAmount,
                          estimatedRefuelDate: moment(this.requestTransporterLube.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                          fuelDealerId: this.fuelDealerSQLId,
                          lubricantsFuelCorporateId: this.dealerCorporateId,
                          creditSource: "DEALER",
                          PANno: this.PANno,
                          lubricantsTransDateTime: moment(this.closeRequestDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                          lubricantsTransactionTime: moment(new Date()).format('hh:mm:ss'),
                          creditAmount: this.requestTransporterLube.value.actualCreditAmount,
                          transactionStatus: 'COMPLETE',
                          fuelDealerStaffId: this.fuelDealerStaffId,
                          actualCreditQuantity: this.requestTransporterLube.value.actualCreditQuantity,
                          createdAt: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                          productRate: this.requestTransporterLube.value.productPrice,
                          vehicleNumber: this.requestTransporterLube.value.vehicleNumber,
                          manualCrNumber: this.requestTransporterLube.value.manualCrNumber,
                          personId: this.personId,
                          managerVPPersonId: this.managerVPPersonId,
                          managerPersonId: this.managerPersonId,
                          managerName: this.managerName,
                          autoManualStatus: this.autoManualStatus
                        }
                        this.post.addCreditLubeReqByDealerForAllPOST(data)
                          .subscribe(res => {
                            if (res.status == "OK") {
                              alert("Credit Added Sccessfully!");
                              this.isBalance1 = false;
                              this.isSelected1 = false;
                              this.CreditRequestDataLube = [];
                              // this.CreditRequestDataLube.length = 0;
                              this.countLube = 1;
                              this.closeModal()
                              this.spinner.hide();
                              // this.cd.detectChanges()
                              if (this.autoManualStatus == 'TRUE') {
                                this.myInputField.nativeElement.focus();
                                this.updateAssignedAutoManualNumber('LUBE',res.count)
                                this.checkDates(this.fuelDealerCorpMapIdNew,moment(this.requestTransporterLube.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                                this.isCRQUANTITY = false;
                                this.isQUANTITY = false;
                                this.CreditRequestDataLube = [];
                                this.countLube = 1;
                                this.requestTransporterLube.controls["requestType"].setValue("showamount");
                                this.requestTransporterLube.controls["requestTypeCR"].setValue("showamount");
                                // this.closeRequestForm.controls["requestTypeClose"].setValue("showamount");
                                this.requestTransporterLube.controls["priceDate"].setValue(this.todayDate);
                                this.requestTransporterLube.controls["manualCrNumber"].setValue("");
                                this.requestTransporterLube.controls["creditQuantity"].setValue("");
                                this.requestTransporterLube.controls["creditAmount"].setValue("");
                                this.requestTransporterLube.controls["vehicleNumber"].setValue("");
                              } else {
                                this.checkDates(this.fuelDealerCorpMapIdNew,moment(this.requestTransporterLube.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                                this.isCRQUANTITY = false;
                                this.isQUANTITY = false;
                                this.CreditRequestDataLube = [];
                                this.countLube = 1;
                                this.addFormRequestLube()
                                this.requestTransporterLube.controls["requestType"].setValue("showamount");
                                this.requestTransporterLube.controls["requestTypeCR"].setValue("showamount");
                                // this.closeRequestForm.controls["requestTypeClose"].setValue("showamount");
                                this.requestTransporterLube.controls["priceDate"].setValue(this.todayDate);
                                this.requestTransporterLube.controls["manualCrNumber"].setValue("");
                                this.requestTransporterLube.controls["creditQuantity"].setValue("");
                                this.requestTransporterLube.controls["creditAmount"].setValue("");
                                this.requestTransporterLube.controls["vehicleNumber"].setValue("");
                              }
                            } else {
                              alert("Error to Created Request!")
                              this.isBalance1 = false;
                              this.spinner.hide();
                            this.cd.detectChanges()
                            }
                          })
                      } else {
                        alert("Please select unit!")
                        this.spinner.hide();
                        this.cd.detectChanges()
                      }
                    } else {
                      alert("Please Enter Bill / Ref Number!")
                      this.spinner.hide();
                      this.cd.detectChanges()
                    }
                  } else {
                    alert("Please enter lubricant name!")
                    this.spinner.hide();
                    this.cd.detectChanges()
                  }
                }
                else {
                  this.spinner.hide();
                  this.cd.detectChanges()
                }
              }
              else {
                alert("Please Enter Amount or Quantity!")
                this.spinner.hide();
                this.cd.detectChanges()
              }
            }
            else {
              alert("Please Select Customer!")
              this.spinner.hide();
              this.cd.detectChanges()
            }
          }
          else {
            alert("Please Enter Amount or Quantity!")
            this.spinner.hide();
            this.cd.detectChanges()
          }
        }
        else {
          alert("Please Select Date!")
          this.spinner.hide();
          this.cd.detectChanges()
        }
      }
    }
  }

  closeModal() {
    this.personPhone1 = '';
    this.personName = '';
    this.dealerLocation = '';
    this.dealerName = '';
    this.requestTransporter1.controls["selectedCorp"].setValue('');
    this.CreditRequestLube.nameLube = '';
    this.CreditRequestLube.manualNumberLube = '';
    this.CreditRequestLube.vehicleNumberLube = '';
    this.CreditRequestLube.creditAmountLube = '';
    this.CreditRequestLube.creditQuantityLube = '';
    this.CreditRequestLube.unitLube = '';

    this.CreditRequestDataLube.length = 0;
    this.countLube = 1;
    this.isSelected1 = false;
    this.addFormRequestLube();
  }

  removeLubeIndex() {
    this.CreditRequestDataLube.splice(this.indexFuelLube, 1);
    this.countLube = this.countLube - 1;
    this.modalRef.close()
    console.log("COUNT:", this.countLube)
  }
  
  openModal() {
    this.modalRef = this.modalService.open(this.content, { centered: true });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }
  
  checkDates(mapId: any,date: any){ 
    if(this.islastCRDate = true){       
   this.spinner.show();
    var g1 = new Date(date);
   var g2 = new Date(this.lastCRDate);
   if (g1.getTime() >= g2.getTime()){
       const oneDay = 24 * 60 * 60 * 1000
       const diffDays = Math.round(Math.abs((g1.getTime() - g2.getTime()) / oneDay))
       this.spinner.hide();
       this.fuelDealerCorpMapIdNew = ''
       this.lastCRDate = ''
       this.isVehicleViewed = false
     }
   else {        
       let data={
         mapId:mapId,
         date:date
       }
       this.post.updateLastCRDateByMapIdPOST(data)
       .subscribe(res => {
           if (res.status == 'OK') {
             this.spinner.hide();
             this.updateDateByMapId(mapId)
             this.isTable = false
             this.isTable1 = false
             this.isTable2 = false
             this.lastCRDate = ''
             this.isVehicleViewed = false
           } else {
             this.spinner.hide();
             this.updateDateByMapId(mapId)
             this.isTable = false
             this.isTable1 = false
             this.isTable2 = false
             this.lastCRDate = ''
             this.isVehicleViewed = false
           }
         });
    } 
   }else{
     this.spinner.show();
     let data={
       mapId:mapId,
       date:date
     }
     this.post.updateLastCRDateByMapIdPOST(data)
     .subscribe(res => {
         if (res.status == 'OK') {
           this.updateDateByMapId(mapId)
           this.spinner.hide();   
             this.isTable = false
             this.isTable1 = false
             this.isTable2 = false
             this.lastCRDate = ''
             this.isVehicleViewed = false
         } else {
           this.spinner.hide();
           this.updateDateByMapId(mapId)
             this.isTable = false
             this.isTable1 = false
             this.isTable2 = false
             this.lastCRDate = ''
             this.isVehicleViewed = false
         }
       });
   }

 }
 
updateDateByMapId(fuelDealerCustomMapId: any){
  let data1 = {
    mapId:fuelDealerCustomMapId
  }
  this.post.updateLastCRDateMapIdWisePOST(data1)
  .subscribe((res) => {
    if (res.status == 'OK') {
      this.fuelDealerCorpMapIdNew = ''
    }else{
      this.fuelDealerCorpMapIdNew = ''
    }
  })
}

updateAssignedAutoManualNumber(status: string,count: any){
 if (status =="LUBE") {
    let data = {
      fuelDealerId:this.fuelDealerId,
      assignedAutoManualNumber:Number(this.autoManualNumberLube) + Number(count),
      status:status
    }
    this.post.updateAssignedAutoManualNumberPOST(data)
    .subscribe(res=>{
      // this.getfuelDealerIdByCorporateIdForCalling(status)
  
    })
    
  } 
  else {
    
  }
    }
}
