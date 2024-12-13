import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { ListWidgetService } from '../listWidget.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreditRequestLubeTax } from 'src/app/pages/dealer/credit/creditRequestLubeTax.model';
import { MixedService } from '../../mixed/mixed.services';
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
  selector: 'app-lists-widget1',
  templateUrl: './lists-widget1.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget1Component {
  requestTransporterLubeTax = new FormGroup({
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
    gst: new FormControl()
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
  accessGroup: any;
  viewCorpFlag: any = [];
  fuelDealerCustomerMapId: any;
  personId: any;
  isSelected1: boolean = false;
  mappingPreviousStatus: any;
  dealerName: any;
  personName: string;
  gstNumber: any;
  dealerLocation: string;
  lastCRDate: any;
  islastCRDate: boolean;
  fuelDealerSQLId: any;
  PANno: any;
  smsMappingStatus: any;
  emailMappingStatus: any;
  updateCorporateId: any;
  personPhone1: any;
  fuelDealerCorpMapIdNew: any;
  rangeFrom: any;
  rangeTo: any;
  corporateList: any = [];
  modalRef: any;
  closeResult: string;
  updateGST: any;
  modalUpdateName: any;
  countLubeTax: any = 1;
  countLube: any = 1;
  CreditRequetLubeTax = new CreditRequestLubeTax();
  CreditRequestDataLubeTax: any = [];
  count: any = 1;
  unitTax: any;
  isQuantityRatio: boolean = false;
  quantityRatio: any;
  lubricantList: any = [];
  subGST: string;
  gstDetails: any = [];
  combineManualNumber: string;
  isVehSelectLube: boolean = false;
  closeRequestDate = moment(new Date()).format("DD-MM-YYYY");
  todayDate = moment(new Date()).format("DD-MM-YYYY");
  isBalance1: boolean;
  isCRQUANTITY: boolean;
  isQUANTITY: boolean;
  acceesGroup: number;
  loginCorporateId: any;
  fuelDealerStaffId: any;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: any;
  CreditRequestDataLube: never[];
  closeRequestForm: any;
  isTable: boolean = false;
  isTable1: boolean = false;
  isTable2: boolean = false;
  isVehicleViewed: boolean = false;

  constructor(
    private post: ListWidgetService,
    private post1: StatsService,
    private post2: MixedService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    this.accessGroup = element.accessGroupId;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.managerName = element.firstName + ' '+ element.lastName
    this.requestTransporterLubeTax.controls["estimatedRefuelDate"].setValue(this.todayDate);
    this.getCorporateMappedListByDealerId(this.fuelDealerId)
    this.getFuelStaffIdByfuelDealerId(this.fuelDealerId)
    this.getLubricants(this.fuelDealerId)
    this.getGSTDetails()
    this.addFormRequestLubeTax()
    console.log(this.isSelected1, "isSelected1")
    this.cd.detectChanges()
  }

  getDetailsByfuelDealerCustomerMapIdId(id: any) {
    if (id.target.value) {
      this.fuelDealerCustomerMapId = id.target.value;
      this.getCorporateInfoByfuelDealerCustomerMapId(this.fuelDealerCustomerMapId);
    }
    else {
      alert("Please select customer")
    }
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

  getCorporateInfoByfuelDealerCustomerMapId(customerName: any) {

    let data = {
      fuelDealerId: this.fuelDealerId,
      customerName: customerName,
    }
    this.post1.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.isSelected1 = true;
          console.log(this.isSelected1, "isSelected1")
          this.mappingPreviousStatus = res.data[0].mappingPreviousStatus;
          if (res.data[0].mappingPreviousStatus == "FALSE") {
            this.dealerName = res.data[0].companyName;
            this.personName = res.data[0].firstName + ' ' + res.data[0].lastName;
            this.gstNumber = res.data[0].GSTNumber;
            // this.checkGST()
          }
          else {
            this.dealerName = res.data[0].mappingCompanyName;
            this.personName = res.data[0].mappingCustomerName;
            this.gstNumber = res.data[0].mappingGST;
            // this.checkGST()
          }
          if (res.data[0].city == '' || res.data[0].city == 'undefined') {
            this.dealerLocation = ''
          } else {
            this.dealerLocation = res.data[0].cityArea + ',' + res.data[0].city;
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
          // this.getFuelCreditRequestByfuelDealerIdByDate(this.fuelDealerSQLId, this.fuelDealerCorpMapIdNew)
          // this.getLubeByfuelDealerIdByDate(this.fuelDealerSQLId, this.fuelDealerCorpMapIdNew)
          // this.getAdvAmtByfuelDealerIdByDate(this.fuelDealerSQLId, this.fuelDealerCorpMapIdNew)
          this.requestTransporter1.controls["dealerName"].setValue(res.data[0].companyName);
          this.requestTransporter1.controls["dealerLocation"].setValue(res.data[0].cityArea + ',' + res.data[0].city);
          this.requestTransporter1.controls["personName"].setValue(res.data[0].firstName + ' ' + res.data[0].lastName);
          this.requestTransporter1.controls["personPhone1"].setValue(res.data[0].phone1);
          this.personId = res.data[0].personId;
        } else {
        }
      });

  }

  getFlagStatusByCorpId(dealerCorporateId: any) {
    let data = {
      corporateIdForFlag: dealerCorporateId
    }
    this.post1.getFlagStatusByCorpIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.viewCorpFlag = res.data
        } else {
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

  updateNameByMapId() {
    let data = {
      fuelDealerCorpMapId: this.fuelDealerCorpMapIdNew,
      gstNumber: this.updateGST,
      mappingPreviousStatus: this.mappingPreviousStatus,
      corporateId: this.updateCorporateId
    }
    this.post.updateCompanyGSTPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
          this.updateGST = "";
          this.modalUpdateName.close('close')
          this.getCorporateInfoByfuelDealerCustomerMapId(this.fuelDealerCustomerMapId);
        }
      })
  }

  closeModalUpdate() {
    this.modalUpdateName.close('close')
  }

  addFormRequestLubeTax() {
    this.countLubeTax = this.countLubeTax + 1;
    if (this.countLube < 12) {
      this.CreditRequetLubeTax = new CreditRequestLubeTax();
      this.CreditRequestDataLubeTax.push(this.CreditRequetLubeTax);
    }
    else {
      this.count = 11;
      alert("Please save 10 credit entries, before adding more credit entries for a customer (max entries allowed per submit is currently capped at 5)")
    }
  }

  getLubeDetails(id: any, i: any) {
    let data = {
      lubricantsId: id.target.value,
    }
    this.post2.getLubricantByIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data.length) {
            this.CreditRequestDataLubeTax[i].nameLube = res.data[0].lubricantsName
            this.requestTransporterLubeTax.controls["nameLube"].setValue(res.data[0].lubricantsName)
            this.requestTransporterLubeTax.controls["unitLube"].setValue(res.data[0].lubricantsUnit)

            this.CreditRequestDataLubeTax[i].unitLube = res.data[0].lubricantsUnit
            this.CreditRequestDataLubeTax[i].lubeId = id.target.value
            this.CreditRequestDataLubeTax[i].hsnSacNumber = res.data[0].lubricantsHsnSacNumber
            this.unitTax = res.data[0].lubricantsUnit
          } else {
            this.CreditRequestDataLubeTax[i].nameLube = ''
            this.CreditRequestDataLubeTax[i].unitLube = ''
            this.CreditRequestDataLubeTax[i].hsnSacNumber = ''
            this.unitTax = ''
          }

          if (res.data1.length) {
            this.isQuantityRatio = true;
            this.quantityRatio = res.data1[0].quantityRatio;
          } else {
            this.isQuantityRatio = false;
          }
        }
      })
  }

  getLubricants(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post2.getLubricantsPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.lubricantList = res.data;
        }
      })
  }

  gstCalculation1(i: string | number) {
    this.requestTransporterLubeTax.controls["creditAmount"].setValue(this.CreditRequetLubeTax.creditAmountLube)
    this.requestTransporterLubeTax.controls["gst"].setValue(this.CreditRequestDataLubeTax[i].gst)
    if (this.CreditRequestDataLubeTax[i].creditAmountLube) {
      if (this.CreditRequestDataLubeTax[i].taxDetails == 'INCLUDE') {
        this.CreditRequestDataLubeTax[i].gstAmount = Number(Number(this.CreditRequestDataLubeTax[i].creditAmountLube) - (Number(this.CreditRequestDataLubeTax[i].creditAmountLube) * (100 / (100 + Number(this.CreditRequestDataLubeTax[i].gst))))).toFixed(2)
        this.CreditRequestDataLubeTax[i].totalAmount = Number(this.CreditRequestDataLubeTax[i].creditAmountLube)
        this.CreditRequestDataLubeTax[i].totalWOGSTAmount = Number(this.CreditRequestDataLubeTax[i].creditAmountLube) - Number(this.CreditRequestDataLubeTax[i].gstAmount)
        if (this.subGST == 'CGST') {
          this.CreditRequestDataLubeTax[i].cgst = Number(this.CreditRequestDataLubeTax[i].gst) / 2;
          this.CreditRequestDataLubeTax[i].igst = '';
        } else {
          this.CreditRequestDataLubeTax[i].cgst = ''
          this.CreditRequestDataLubeTax[i].igst = Number(this.CreditRequestDataLubeTax[i].gst)
        }
      } else {
        this.CreditRequestDataLubeTax[i].gstAmount = Number((Number(this.CreditRequestDataLubeTax[i].creditAmountLube) * Number(this.CreditRequestDataLubeTax[i].gst)) / 100).toFixed(2)
        this.CreditRequestDataLubeTax[i].totalAmount = (Number(this.CreditRequestDataLubeTax[i].creditAmountLube) + Number(this.CreditRequestDataLubeTax[i].gstAmount))
        this.CreditRequestDataLubeTax[i].totalWOGSTAmount = Number(this.CreditRequestDataLubeTax[i].creditAmountLube)
        if (this.subGST == 'CGST') {
          this.CreditRequestDataLubeTax[i].cgst = Number(this.CreditRequestDataLubeTax[i].gst) / 2;
          this.CreditRequestDataLubeTax[i].igst = ''
        } else {
          this.CreditRequestDataLubeTax[i].cgst = ''
          this.CreditRequestDataLubeTax[i].igst = Number(this.CreditRequestDataLubeTax[i].gst)
        }
      }

      if (this.CreditRequestDataLubeTax[i].creditQuantityLube) {
        this.CreditRequestDataLubeTax[i].productPrice = Number(Number(this.CreditRequestDataLubeTax[i].creditAmountLube) / Number(this.CreditRequestDataLubeTax[i].creditQuantityLube)).toFixed(2)
      }
    }
  }

  getGSTDetails() {
    let data = {
    }
    this.post1.getGSTDataPOST(data)
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

  setManualNumberLubeTax(i: string | number) {
    if (Number(this.CreditRequetLubeTax.manualNumberLube) >= Number(this.rangeFrom) && Number(this.CreditRequetLubeTax.manualNumberLube) <= Number(this.rangeTo) || Number(this.rangeTo) == 0) {
      if (Number(this.rangeTo) == 0) {
        this.requestTransporterLubeTax.controls["manualCrNumber"].setValue(this.CreditRequetLubeTax.manualNumberLube)
        this.checkManualNumRangeForNotAssign(this.CreditRequetLubeTax.manualNumberLube, i)
      } else {
        this.requestTransporterLubeTax.controls["manualCrNumber"].setValue(this.CreditRequetLubeTax.manualNumberLube)
        this.checkBillnameLube(this.CreditRequetLubeTax.manualNumberLube, i)
      }
    } else {
      alert('manual number exceed limit!')
      this.CreditRequestDataLubeTax[i].manualNumberLube = '';
      this.requestTransporterLubeTax.controls["manualCrNumber"].setValue('')
    }
  }

  checkManualNumRangeForNotAssign(manualNumber: any, i: string | number) {
    let data = {
      manualNumber: manualNumber,
      fuelDealerId: this.fuelDealerId,
    }
    this.post1.checkManualNumRangeForNotAssignPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          alert('Manual number series already Assign To Other Customer')
          this.combineManualNumber = '';
          this.requestTransporterLubeTax.controls["manualCrNumber"].setValue('')
          if (this.CreditRequestDataLubeTax.length) {
            this.CreditRequestDataLubeTax[i].manualNumberLube = '';
          }

        } else {
          this.checkBillnameLube(this.CreditRequetLubeTax.manualNumberLube, i)
        }
      })
  }

  checkBillnameLube(manualNumber: any, i: string | number) {
    let data = {
      manualNumber: manualNumber,
      fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
      purpose: "LUBE",
      fuelDealerId: this.fuelDealerId
    }
    this.post1.getManualNumberPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          alert('Manual number already exist')
          this.CreditRequestDataLubeTax[i].manualNumberLube = '';
          this.requestTransporterLubeTax.controls["manualCrNumber"].setValue('')
          this.requestTransporterLubeTax.controls["manualCrNumber"].setValue('')
          this.CreditRequestDataLubeTax[i].manualNumberLube = '';
        }
      })
  }

  setVehicleNumberLube() {
    this.isVehSelectLube = true;
    this.requestTransporterLubeTax.controls["vehicleNumber"].setValue(this.CreditRequetLubeTax.vehicleNumberLube)
  }

  getQuantityByPieces(i: string | number) {
    if (this.isQuantityRatio) {
      this.CreditRequestDataLubeTax[i].creditQuantityLube = Number(this.quantityRatio) * Number(this.CreditRequestDataLubeTax[i].quantityInPieces)
    }
  }

  setQuantityLubeTax() {
    this.requestTransporterLubeTax.controls["creditQuantity"].setValue(this.CreditRequetLubeTax.creditQuantityLube)
  }

  removeFormRequestLubeTax(i: number) {
    this.CreditRequestDataLubeTax.splice(i, 1);
    this.countLubeTax = this.countLubeTax - 1;
  }

  submitByDealerForLubeTax() {
    if (this.accessGroup == 12) {
      this.spinner.show()
      if (this.requestTransporterLubeTax.value.estimatedRefuelDate) {
        if (this.requestTransporterLubeTax.value.gst) {
          if (this.requestTransporterLubeTax.value.creditAmount || this.requestTransporterLubeTax.value.creditQuantity) {
            if (this.fuelDealerCorpMapIdNew) {
              if (this.requestTransporterLubeTax.value.creditQuantity) {
                if (this.personId) {
                  if (this.requestTransporterLubeTax.value.nameLube) {
                    if (this.requestTransporterLubeTax.value.manualCrNumber) {
                      if (this.requestTransporterLubeTax.value.unitLube) {

                        let data = {
                          lubeAllData: this.CreditRequestDataLubeTax,
                          lubricantsFuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                          // reqQuantity: this.requestTransporterLubeTax.value.reqQuantity,
                          // reqCreditAmount: this.requestTransporterLubeTax.value.reqCreditAmount,
                          estimatedRefuelDate: moment(this.requestTransporterLubeTax.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                          fuelDealerId: this.fuelDealerSQLId,
                          lubricantsFuelCorporateId: this.dealerCorporateId,
                          creditSource: "DEALER",
                          PANno: this.PANno,
                          lubricantsTransDateTime: moment(this.closeRequestDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                          lubricantsTransactionTime: moment(new Date()).format('hh:mm:ss'),
                          creditAmount: this.requestTransporterLubeTax.value.actualCreditAmount,
                          transactionStatus: 'COMPLETE',
                          fuelDealerStaffId: this.fuelDealerStaffId,
                          actualCreditQuantity: this.requestTransporterLubeTax.value.actualCreditQuantity,
                          createdAt: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                          productRate: this.requestTransporterLubeTax.value.productPrice,
                          vehicleNumber: this.requestTransporterLubeTax.value.vehicleNumber,
                          manualCrNumber: this.requestTransporterLubeTax.value.manualCrNumber,
                          personId: this.personId,
                          isMappingSMS: this.smsMappingStatus,
                          isMappingEmail: this.emailMappingStatus
                        }
                        this.post.addCreditLubeReqByDealerForTaxPOST(data)
                          .subscribe(res => {
                            if (res.status == "OK") {
                              alert("Credit Added Sccessfully!");
                              // this.getLubeTaxDetailsByDealerIdPost()
                              this.isBalance1 = false;
                              this.spinner.hide();
                              this.isCRQUANTITY = false;
                              this.isQUANTITY = false;
                              this.CreditRequestDataLubeTax = [];
                              this.countLube = 1;
                              this.checkDates(this.fuelDealerCorpMapIdNew, moment(this.requestTransporterLubeTax.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                              this.requestTransporterLubeTax.controls["requestType"].setValue("AMOUNT");
                              this.requestTransporterLubeTax.controls["requestTypeCR"].setValue("AMOUNT");
                              this.requestTransporterLubeTax.controls["priceDate"].setValue(this.todayDate);
                              this.addFormRequestLubeTax()
                              this.requestTransporterLubeTax.controls["manualCrNumber"].setValue("");
                              this.requestTransporterLubeTax.controls["creditQuantity"].setValue("");
                              this.requestTransporterLubeTax.controls["creditAmount"].setValue("");
                              this.requestTransporterLubeTax.controls["vehicleNumber"].setValue("");
                            } else {
                              alert("Error to Created Request!")
                              this.isBalance1 = false;
                              this.spinner.hide();
                            }
                          });

                      }
                      else {
                        alert("Please select unit!")
                        this.spinner.hide();
                      }

                    } else {
                      alert("Please Enter Bill / Ref Number!")
                      this.spinner.hide();
                    }
                  } else {
                    alert("Please enter lubricant name!")
                    this.spinner.hide();
                  }
                } else {
                  this.spinner.hide();
                }
              }
              else {
                alert("Please Enter Quantity!")
                this.spinner.hide();
              }

            }
            else {
              alert("Please Select customer!")
              this.spinner.hide();
            }

          }
          else {
            alert("Please Enter Amount or Quantity!")
            this.spinner.hide();
          }
        }
        else {
          alert("Please select gst!")
          this.spinner.hide();
        }
      }
      else {
        alert("Please Select Date!")
        this.spinner.hide();
      }


    } else {
      if (this.accessGroup == 14) {

        this.spinner.show()

        if (this.requestTransporterLubeTax.value.estimatedRefuelDate) {
          if (this.requestTransporterLubeTax.value.creditAmount || this.requestTransporterLubeTax.value.creditQuantity) {
            if (this.fuelDealerCorpMapIdNew) {
              if (this.requestTransporterLubeTax.value.creditQuantity) {
                if (this.personId) {
                  if (this.requestTransporterLubeTax.value.nameLube) {
                    if (this.requestTransporterLubeTax.value.manualCrNumber) {
                      if (this.requestTransporterLubeTax.value.unitLube) {

                        let data = {
                          lubeAllData: this.CreditRequestDataLubeTax,
                          lubricantsFuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                          // reqQuantity: this.requestTransporterLubeTax.value.reqQuantity,
                          // reqCreditAmount: this.requestTransporterLubeTax.value.reqCreditAmount,
                          estimatedRefuelDate: moment(this.requestTransporterLubeTax.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                          fuelDealerId: this.fuelDealerSQLId,
                          lubricantsFuelCorporateId: this.dealerCorporateId,
                          creditSource: "DEALER",
                          PANno: this.PANno,
                          lubricantsTransDateTime: moment(this.closeRequestDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                          lubricantsTransactionTime: moment(new Date()).format('hh:mm:ss'),
                          creditAmount: this.requestTransporterLubeTax.value.actualCreditAmount,
                          transactionStatus: 'COMPLETE',
                          fuelDealerStaffId: this.fuelDealerStaffId,
                          actualCreditQuantity: this.requestTransporterLubeTax.value.actualCreditQuantity,
                          createdAt: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                          productRate: this.requestTransporterLubeTax.value.productPrice,
                          vehicleNumber: this.requestTransporterLubeTax.value.vehicleNumber,
                          manualCrNumber: this.requestTransporterLubeTax.value.manualCrNumber,
                          personId: this.personId,
                          managerVPPersonId: this.managerVPPersonId,
                          managerPersonId: this.managerPersonId,
                          managerName: this.managerName,
                        }
                        this.post.addCreditLubeReqByDealerForTaxPOST(data)
                          .subscribe(res => {
                            if (res.status == "OK") {
                              alert("Credit Added Sccessfully!");
                              // this.getLubeTaxDetailsByDealerIdPost()
                              this.isBalance1 = false;
                              this.spinner.hide();
                              this.checkDates(this.fuelDealerCorpMapIdNew, moment(this.requestTransporterLubeTax.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                              this.isCRQUANTITY = false;
                              this.isQUANTITY = false;
                              this.CreditRequestDataLube = [];
                              this.countLube = 1;
                              this.requestTransporterLubeTax.controls["requestType"].setValue("AMOUNT");
                              this.requestTransporterLubeTax.controls["requestTypeCR"].setValue("AMOUNT");
                              this.closeRequestForm.controls["requestTypeClose"].setValue("AMOUNT");
                              this.requestTransporterLubeTax.controls["priceDate"].setValue(this.todayDate);
                              this.requestTransporterLubeTax.controls["manualCrNumber"].setValue("");
                              this.requestTransporterLubeTax.controls["creditQuantity"].setValue("");
                              this.requestTransporterLubeTax.controls["creditAmount"].setValue("");
                              this.requestTransporterLubeTax.controls["vehicleNumber"].setValue("");
                            } else {
                              alert("Error to Created Request!")
                              this.isBalance1 = false;
                              this.spinner.hide();
                            }
                          })
                      } else {
                        alert("Please select unit!")
                        this.spinner.hide();
                      }
                    } else {
                      alert("Please Enter Bill / Ref Number!")
                      this.spinner.hide();
                    }
                  } else {
                    alert("Please enter lubricant name!")
                    this.spinner.hide();
                  }
                }
                else {
                  this.spinner.hide();
                }
              }
              else {
                alert("Please Enter Amount or Quantity!")
                this.spinner.hide();
              }
            }
            else {
              alert("Please Select Customer!")
              this.spinner.hide();
            }
          }
          else {
            alert("Please Enter Amount or Quantity!")
            this.spinner.hide();
          }
        }
        else {
          alert("Please Select Date!")
          this.spinner.hide();
        }
      }
    }
  }

  checkDates(mapId: any, date: string | number | Date) {
    if (this.islastCRDate = true) {
      this.spinner.show();
      var g1 = new Date(date);
      var g2 = new Date(this.lastCRDate);
      if (g1.getTime() >= g2.getTime()) {
        const oneDay = 24 * 60 * 60 * 1000
        const diffDays = Math.round(Math.abs((g1.getTime() - g2.getTime()) / oneDay))
        this.spinner.hide();
        this.fuelDealerCorpMapIdNew = ''
        this.isSelected1 = false
        this.requestTransporter1.controls["selectedCorp"].setValue('');
        this.isTable = false
        this.isTable1 = false
        this.isTable2 = false
        this.lastCRDate = ''
        this.isVehicleViewed = false
      }
      else {
        let data = {
          mapId: mapId,
          date: date
        }
        this.post.updateLastCRDateByMapIdPOST(data)
          .subscribe(res => {
            if (res.status == 'OK') {
              this.spinner.hide();
              //  this.updateDateByMapId(mapId)
              this.isSelected1 = false
              this.requestTransporter1.controls["selectedCorp"].setValue('');
              this.isTable = false
              this.isTable1 = false
              this.isTable2 = false
              this.lastCRDate = ''
              this.isVehicleViewed = false
            } else {
              this.spinner.hide();
              //  this.updateDateByMapId(mapId)
              this.isSelected1 = false
              this.requestTransporter1.controls["selectedCorp"].setValue('');
              this.isTable = false
              this.isTable1 = false
              this.isTable2 = false
              this.lastCRDate = ''
              this.isVehicleViewed = false
            }
          });
      }
    } else {
      this.spinner.show();
      let data = {
        mapId: mapId,
        date: date
      }
      this.post.updateLastCRDateByMapIdPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            //  this.updateDateByMapId(mapId)
            this.spinner.hide();
            this.isSelected1 = false
            this.requestTransporter1.controls["selectedCorp"].setValue('');
            this.isTable = false
            this.isTable1 = false
            this.isTable2 = false
            this.lastCRDate = ''
            this.isVehicleViewed = false
          } else {
            this.spinner.hide();
            //  this.updateDateByMapId(mapId)
            this.isSelected1 = false
            this.requestTransporter1.controls["selectedCorp"].setValue('');
            this.isTable = false
            this.isTable1 = false
            this.isTable2 = false
            this.lastCRDate = ''
            this.isVehicleViewed = false
          }
        });
    }
  }
}
