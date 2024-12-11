import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { MixedService } from '../mixed.services';
import { StatsService } from '../../stats/stats.services';
import { CreditVehicleRequest } from 'src/app/pages/dealer/credit/creditVehicleRequest.modal';

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
  selector: 'app-mixed-widget1',
  templateUrl: './mixed-widget1.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class MixedWidget1Component {
  @ViewChild("myinput") myInputField: ElementRef;
  @Input() color: string = '';
  dealerLoginVPId: any;
  dealerAccess: boolean = false;
  liteAccess: boolean = false;

  requestVehicle = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    reqQuantity: new FormControl(),
    reqCreditAmount: new FormControl(),
    estimatedRefuelDate: new FormControl(),
    actualCreditAmount: new FormControl(),
    actualCreditQuantity: new FormControl(),
    requestType: new FormControl(),
    requestTypeCR: new FormControl(),
    mobile: new FormControl(),
    vehicleNumber: new FormControl(),
    productPrice: new FormControl(),
    priceDate: new FormControl(),
    selectPersonId: new FormControl('', [Validators.required]),
    manualCrNumber: new FormControl(),
    productName1: new FormControl(),
  });

  unitForm = new FormGroup({
    buyPricePerUnit: new FormControl(''),
    product: new FormControl('', [Validators.required]),
    productPriceDate: new FormControl(''),
  });

  CreditRequestDataArray: any = [];
  fuelProductId: any;
  fuelDealerId: any;
  isSelected2: boolean = false;
  productPriceDetails: any = [];
  todayDate = moment(new Date()).format("DD-MM-YYYY");
  productInfo: any = [];
  settingRate: any;
  productPrice: any;
  allProductPriceList: any = [];
  acceesGroup: any;
  managerPersonId: any;
  managerVPPersonId: any;
  managerName: string;
  CreditVehicleRequestDataArray: any = [];
  mappingCompanyNameForVehicle: string;
  autoManualStatus: any = 'FALSE';
  countVehicle: any = 1;
  CreditVehicleRequest = new CreditVehicleRequest()
  autoManualNumberAdvance: any;
  allVehicleData: any = [];
  isAlert: boolean = false;
  viewCorpFlag: any = [];
  modalRef: any;
  content: any;
  closeResult: string;
  isVehicleViewed: boolean = false;
  isCustomerSelect: boolean = false;
  customerVehicleList: any = [];
  vehicleMapId: any;
  fuelVehicleNumber: any;
  idfuelCreditVehicle: any;
  vehicleAmtType: boolean = true;
  rangeFrom: any = 0;
  rangeTo: any = 0;
  combineManualNumber: string;
  fuelDealerCorpMapIdNew: any;
  CreditRequest: any;
  indexFuelVehicle: number;
  dealerCorporateId: any;
  closeRequestDate = moment(new Date()).format("DD-MM-YYYY");
  fuelDealerStaffId: any;
  isBalance1: boolean = false;
  isCRQUANTITY: boolean = false;
  isQUANTITY: boolean = false;
  autoManualNumber: any;
  autoManualNumberLube: any;
  autoManualNumberVehicle: any;

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

  ngOnInit() {
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
    this.requestVehicle.controls["requestType"].setValue("showamount");
    this.requestVehicle.controls["requestType"].setValue("showamount");
    this.requestVehicle.controls["estimatedRefuelDate"].setValue(this.todayDate);
    this.requestVehicle.controls["priceDate"].setValue(this.todayDate);
    this.addFormVehicleRequest();
    this.getProductsByDealerId(this.fuelDealerId)
    this.getAllVehicle()
    this.cd.detectChanges()
  }


  getPriceVehicle(id: any, setFuelPrice: any) {

    if (this.requestVehicle.value.priceDate) {
      this.CreditRequestDataArray.length = 0;
      // this.addFormVehicleRequest()
      this.fuelProductId = id.target.value;
      let data = {
        dealerId: this.fuelDealerId,
        fuelProductId: this.fuelProductId,
        date: moment(this.requestVehicle.value.priceDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getPriceByDealerProductIdByDatePOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.isSelected2 = true;
            this.productPriceDetails = res.data;
            this.requestVehicle.controls["productPrice"].setValue(res.data[0].productSellingPrice);
            this.requestVehicle.controls["productPrice"].setValue(res.data[0].productSellingPrice);
            this.requestVehicle.controls["productName1"].setValue(res.data[0].productCategory + '-' + res.data[0].productName);
            this.requestVehicle.controls["estimatedRefuelDate"].setValue(this.requestVehicle.value.priceDate);
            this.requestVehicle.controls["productPrice"].setValue(res.data[0].productSellingPrice);

            this.cd.detectChanges()
          } else {
            alert("Please Set Fuel Price first for Selected Date..!")
            this.cd.detectChanges()
          }
        })
    } else {
      this.fuelProductId = id.target.value;
      let data = {
        dealerId: this.fuelDealerId,
        fuelProductId: this.fuelProductId,
        date: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getPriceByDealerProductIdByDatePOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.productPriceDetails = res.data;
            this.requestVehicle.controls["productPrice"].setValue(res.data[0].productSellingPrice);
            this.requestVehicle.controls["estimatedRefuelDate"].setValue(this.requestVehicle.value.priceDate);
          } else {
            alert("Please Set Fuel Price first for Selected Date..!")
          }
        })
    }
  }

  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getFuelProductIdByDealerIdPOST(data).subscribe(res => {
      if (res) {
        this.productInfo = res.data;
        this.allProductPriceList = res.data;
      }
    })
  }

  setPrice(id: any) {
    this.settingRate = id.target.value;
    this.productPrice = this.settingRate;
  }

  addFuelPrice() {
    if (this.acceesGroup == 12 || this.acceesGroup == 19) {
      this.spinner.show()
      let data = {
        allProductPriceList: this.allProductPriceList,
        sellingSetBy: this.fuelDealerId,
        productPriceTime: moment(new Date()).format("hh:mm:ss"),
        productPriceDate: moment(this.unitForm.value.productPriceDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post1.addFuelPriceByDealerIdPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("Fuel Price Set Successfully!");
            this.allProductPriceList.length = 0;
            this.spinner.hide();
          } else {
            alert("Getting Error!");
            this.spinner.hide();
          }

        })
    }
    else {
      if (this.acceesGroup == 14 || this.acceesGroup == 21) {
        this.spinner.show()
        let data = {
          allProductPriceList: this.allProductPriceList,
          sellingSetBy: this.fuelDealerId,
          productPriceTime: moment(new Date()).format("hh:mm:ss"),
          productPriceDate: moment(this.unitForm.value.productPriceDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          managerVPPersonId: this.managerVPPersonId,
          managerPersonId: this.managerPersonId,
          managerName: this.managerName,
        }
        this.post1.addFuelPriceByDealerIdPOST(data)
          .subscribe(res => {
            if (res.status == 'OK') {
              alert("Fuel Price Set Successfully!");
              this.allProductPriceList.length = 0;
              this.spinner.hide();
            } else {
              alert("Getting Error!");
              this.spinner.hide();
            }

          })
      }
      else {

      }
    }
  }

  getDetailsOfVehicleByfuelDealerCustomerMapIdId(id: any) {
    if (id.target.value) {
      this.CreditVehicleRequestDataArray = [];
      this.mappingCompanyNameForVehicle = ""
      this.addFormVehicleRequest()
      this.getvehicleInfoByfuelDealerIdAndName(id.target.value);
      this.cd.detectChanges()
    }
    else {
      alert("Please select vehicle")
      this.cd.detectChanges()
    }
  }

  addFormVehicleRequest() {
    if (this.autoManualStatus == 'TRUE') {
      this.countVehicle = this.countVehicle + 1;
      this.CreditVehicleRequest = new CreditVehicleRequest();
      this.CreditVehicleRequest.manualNumber = this.autoManualNumberAdvance
      this.CreditVehicleRequestDataArray.push(this.CreditVehicleRequest);
      this.cd.detectChanges()
    } else {
      this.countVehicle = this.countVehicle + 1;
      if (this.countVehicle < 12) {
        this.CreditVehicleRequest = new CreditVehicleRequest();
        this.CreditVehicleRequestDataArray.push(this.CreditVehicleRequest);
      }
      else {
        this.countVehicle = 11;
        alert("Please save 10 credit entries, before adding more credit entries for a customer (max entries allowed per submit is currently capped at 5)")
      }
      this.cd.detectChanges()
    }

  }

  getAllVehicle() {
    let creditArr;
    let data = {
      fuelDealerId: this.fuelDealerId
    }

    this.post.getfuelCreditVehicleByfuelDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          creditArr = Object.values(res.data.reduce((acc: any, cur: { vehicleNumber: any; }) => Object.assign(acc, { [cur.vehicleNumber]: cur }), {}))

          this.allVehicleData = creditArr
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
        } else {
        }
      });
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

  getvehicleInfoByfuelDealerIdAndName(vehicleNumber: any) {
    let data = {
      fuelDealerId: this.fuelDealerId,
      vehicleNumber: vehicleNumber,
    }
    this.post.checkVehicleByfuelDealerIdAndNumberPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.customerVehicleList = res.data;
          if (this.customerVehicleList.length == 1) {
            this.isVehicleViewed = true;
            this.isCustomerSelect = true;
            this.vehicleMapId = res.data[0].fuelDealerCustomerMapId
            this.fuelVehicleNumber = vehicleNumber,
              this.idfuelCreditVehicle = res.data[0].idfuelCreditVehicle
            if (res.data[0].mappingPreviousStatus == 'TRUE') {
              this.mappingCompanyNameForVehicle = res.data[0].mappingCompanyName
            } else {
              this.mappingCompanyNameForVehicle = res.data[0].companyName
            }
            this.cd.detectChanges()
          } else {
            this.isVehicleViewed = true;
            this.isCustomerSelect = false;
            this.cd.detectChanges()
          }


        } else {
        }
      });

  }

  getvehicleDetailsForCR(mapId: any, vehicleNumber: any, idfuelCreditVehicle: any, mappingPreviousStatus: string, mappingCompanyName: string, companyName: string) {
    this.isCustomerSelect = true;
    this.vehicleMapId = mapId,
      this.fuelVehicleNumber = vehicleNumber,
      this.idfuelCreditVehicle = idfuelCreditVehicle
    if (mappingPreviousStatus == 'TRUE') {
      this.mappingCompanyNameForVehicle = mappingCompanyName
    } else {
      this.mappingCompanyNameForVehicle = companyName
    }

  }

  changeVehicleAmountToQuantity() {
    this.vehicleAmtType = true;
  }

  changeVehicleQuantityToAmount() {
    this.vehicleAmtType = false;
  }

  setManualNumberVehicle(i: any) {
    if (Number(this.CreditVehicleRequest.manualNumber) >= Number(this.rangeFrom) && Number(this.CreditVehicleRequest.manualNumber) <= Number(this.rangeTo) || Number(this.rangeTo) == 0) {
      if (Number(this.rangeTo) == 0) {
        this.requestVehicle.controls["manualCrNumber"].setValue(this.CreditVehicleRequest.manualNumber)
        this.checkManualNumRangeForNotAssign(this.CreditVehicleRequest.manualNumber, i, 'CREDIT')
      } else {
        this.requestVehicle.controls["manualCrNumber"].setValue(this.CreditVehicleRequest.manualNumber)
        this.checkBillManualNumber(this.CreditVehicleRequest.manualNumber, i)
      }
    } else {
      if (this.autoManualStatus == 'TRUE') {
        this.requestVehicle.controls["manualCrNumber"].setValue(this.CreditVehicleRequest.manualNumber)
      } else {
        alert('manual number exceed limit!')
        this.CreditVehicleRequestDataArray[i].manualNumber = '';
        this.requestVehicle.controls["manualCrNumber"].setValue('')
      }
    }
  }

  checkManualNumRangeForNotAssign(manualNumber: any, i: any, purpose: any) {
    let data = {
      manualNumber: manualNumber,
      fuelDealerId: this.fuelDealerId,
    }
    this.post1.checkManualNumRangeForNotAssignPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          alert('Manual number series already Assign To Other Customer')
          this.combineManualNumber = '';
          if (this.CreditRequestDataArray.length) {
            this.CreditRequestDataArray[i].manualNumber = '';
          }
        } else {
          if (purpose == 'CREDIT') {
            this.checkBillManualNumber(this.CreditVehicleRequest.manualNumber, i)
          }
          if (purpose == 'COMBINE') {
            this.checkBillnameCombine(this.combineManualNumber)
          }
        }
      })
  }

  checkBillManualNumber(manualNumber: any, i: string | number) {
    let data = {
      manualNumber: manualNumber,
      fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
      fuelDealerId: this.fuelDealerId,
      purpose: 'CREDIT'

    }
    this.post1.getManualNumberPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          alert('Manual number already exist')
          this.CreditRequestDataArray[i].manualNumber = '';
          this.CreditVehicleRequestDataArray[i].manualNumber = '';
          this.requestVehicle.controls["manualCrNumber"].setValue('')
        }
      })
  }

  checkBillnameCombine(manualNumber: string) {
    let data = {
      manualNumber: manualNumber,
      fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
      fuelDealerId: this.fuelDealerId,


    }
    this.post1.getManualNumberPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          alert('Manual number already exist')
          this.combineManualNumber = '';
        }
      })

  }

  amountCalculateVehicle(i: number) {
    if (this.requestVehicle.value.productPrice) {
      if (this.CreditVehicleRequestDataArray[i].creditAmount) {
        if (this.CreditVehicleRequestDataArray[i].creditAmount > 0) {
          this.CreditVehicleRequestDataArray[i].creditQuantity = Number((this.CreditVehicleRequestDataArray[i].creditAmount) / (this.requestVehicle.value.productPrice)).toFixed(2)
          this.requestVehicle.controls["reqQuantity"].setValue(this.CreditVehicleRequestDataArray[i].creditQuantity)
          this.requestVehicle.controls["reqCreditAmount"].setValue(this.CreditVehicleRequestDataArray[i].creditAmount)
          this.requestVehicle.controls["actualCreditQuantity"].setValue(this.CreditVehicleRequestDataArray[i].creditQuantity)
          this.requestVehicle.controls["actualCreditAmount"].setValue(this.CreditVehicleRequestDataArray[i].creditAmount)
        } else {

        }
      } else {
      }
    } else {
      alert("Please Select product Price")
    }
  }

  quantityCalculateVehicle(i: number) {
    if (this.requestVehicle.value.productPrice) {
      if (this.CreditVehicleRequestDataArray[i].creditQuantity) {
        if (this.CreditVehicleRequestDataArray[i].creditQuantity > 0) {
          this.CreditVehicleRequestDataArray[i].creditAmount = Number((this.CreditVehicleRequestDataArray[i].creditQuantity) * (this.requestVehicle.value.productPrice)).toFixed(2)
          this.requestVehicle.controls["reqQuantity"].setValue(this.CreditVehicleRequestDataArray[i].creditQuantity)
          this.requestVehicle.controls["reqCreditAmount"].setValue(this.CreditVehicleRequestDataArray[i].creditAmount)
          this.requestVehicle.controls["actualCreditQuantity"].setValue(this.CreditVehicleRequestDataArray[i].creditQuantity)
          this.requestVehicle.controls["actualCreditAmount"].setValue(this.CreditVehicleRequestDataArray[i].creditAmount)
        } else {

        }
      } else {
      }
    } else {
      alert("Please Select product Price")
    }

  }

  removeFormRequestVehicle(i: number, removeTable: any) {
    this.indexFuelVehicle = i;
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

  submitByDealerForVehicle() {
    if (this.acceesGroup == 12 || this.acceesGroup == 19) {
      this.spinner.show()
      if (this.requestVehicle.value.estimatedRefuelDate) {
        if (this.requestVehicle.value.actualCreditAmount || this.requestVehicle.value.reqQuantity) {
          if (this.vehicleMapId) {
            if (this.requestVehicle.value.manualCrNumber) {

              let data = {
                idfuelCreditVehicle: this.idfuelCreditVehicle,
                fuelVehicleNumber: this.fuelVehicleNumber,
                customerVehicleList: this.CreditVehicleRequestDataArray,
                fuelDealerVehicleMapId: this.vehicleMapId,
                estimatedRefuelDate: moment(this.requestVehicle.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                fuelDealerId: this.fuelDealerId,
                fuelProductId: this.requestVehicle.value.productName,
                lubricantsFuelCorporateId: this.dealerCorporateId,
                creditSource: "DEALER",
                // PANno: this.PANno,
                vehicleTransDateTime: moment(this.closeRequestDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                vehicleTransactionTime: moment(new Date()).format('hh:mm:ss'),
                creditAmount: this.requestVehicle.value.actualCreditAmount,
                transactionStatus: 'COMPLETE',
                fuelDealerStaffId: this.fuelDealerStaffId,
                actualCreditQuantity: this.requestVehicle.value.actualCreditQuantity,
                createdAt: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                productRate: this.requestVehicle.value.productPrice,
                // personId: this.personId,
                // isMappingSMS: this.smsMappingStatus,
                // isMappingEmail: this.emailMappingStatus,
                autoManualStatus: this.autoManualStatus
              }
              this.post.addCreditVehicleReqByDealerForAllPOST(data)
                .subscribe(res => {
                  if (res.status == "OK") {
                    alert("Credit Added Sccessfully!");
                    this.isBalance1 = false;
                    this.spinner.hide();
                    this.myInputField.nativeElement.focus();
                    // this.checkDates(this.vehicleMapId, moment(this.requestVehicle.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                    this.isCRQUANTITY = false;
                    this.isQUANTITY = false;
                    this.CreditVehicleRequestDataArray = [];
                    this.countVehicle = 1;
                    if (this.autoManualStatus == 'TRUE') {

                      this.updateAssignedAutoManualNumber('VEHICLE', res.count)
                    } else {
                      this.addFormVehicleRequest()
                    }

                    this.mappingCompanyNameForVehicle = "";
                  } else {
                    alert("Error to Created Request!")
                    this.isBalance1 = false;
                    this.spinner.hide();
                  }
                });
            } else {
              alert("Please Enter Bill / Ref Number!")
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
        alert("Please Select Date!")
        this.spinner.hide();
      }


    } else {
      if (this.acceesGroup == 14 || this.acceesGroup == 21) {
        this.spinner.show()
        if (this.requestVehicle.value.estimatedRefuelDate) {
          if (this.requestVehicle.value.actualCreditAmount || this.requestVehicle.value.reqQuantity) {
            if (this.vehicleMapId) {
              if (this.requestVehicle.value.productName) {
                // if (this.personId) {
                if (this.requestVehicle.value.manualCrNumber) {

                  let data = {
                    idfuelCreditVehicle: this.idfuelCreditVehicle,
                    fuelVehicleNumber: this.fuelVehicleNumber,
                    customerVehicleList: this.CreditVehicleRequestDataArray,
                    fuelDealerVehicleMapId: this.vehicleMapId,
                    estimatedRefuelDate: moment(this.requestVehicle.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                    fuelDealerId: this.fuelDealerId,
                    fuelProductId: this.requestVehicle.value.productName,
                    lubricantsFuelCorporateId: this.dealerCorporateId,
                    creditSource: "DEALER",
                    // PANno: this.PANno,
                    vehicleTransDateTime: moment(this.closeRequestDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                    vehicleTransactionTime: moment(new Date()).format('hh:mm:ss'),
                    transactionStatus: 'COMPLETE',
                    fuelDealerStaffId: this.fuelDealerStaffId,
                    createdAt: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                    productRate: this.requestVehicle.value.productPrice,
                    manualCrNumber: this.requestVehicle.value.manualCrNumber,
                    // personId: this.personId,
                    managerVPPersonId: this.managerVPPersonId,
                    managerPersonId: this.managerPersonId,
                    managerName: this.managerName,
                    autoManualStatus: this.autoManualStatus
                  }
                  this.post.addCreditVehicleReqByDealerForAllPOST(data)
                    .subscribe(res => {
                      if (res.status == "OK") {
                        alert("Credit Added Sccessfully!");
                        this.isBalance1 = false;
                        this.spinner.hide();
                        this.myInputField.nativeElement.focus();
                        // this.checkDates(this.vehicleMapId, moment(this.requestVehicle.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                        this.isCRQUANTITY = false;
                        this.isQUANTITY = false;
                        this.countVehicle = 1;
                        if (this.autoManualStatus == 'TRUE') {

                          this.updateAssignedAutoManualNumber('VEHICLE', res.count)
                        } else {
                          this.addFormVehicleRequest()
                        }
                        this.requestVehicle.controls["requestType"].setValue("showamount");
                        // this.closeRequestForm.controls["requestTypeClose"].setValue("showamount");
                      } else {
                        alert("Error to Created Request!")
                        this.isBalance1 = false;
                        this.spinner.hide();
                      }

                    })

                } else {
                  alert("Please Enter Bill / Ref Number!")
                  this.spinner.hide();
                }
              }
              // else {                
              //   this.spinner.hide();
              // }
            }
            else {
              alert("Please Select Product!")
              this.spinner.hide();
            }
          }
          else {
            alert("Please Select Customer!")
            this.spinner.hide();
          }
        }
        else {
          alert("Please Enter Amount & Quantity..!")
          this.spinner.hide();
        }
      }
      else {
        alert("Please Select Date!")
        this.spinner.hide();
      }
    }
  }

  updateAssignedAutoManualNumber(status: string, count: any) {
    if (status == "VEHICLE") {
      let data = {
        fuelDealerId: this.fuelDealerId,
        assignedAutoManualNumber: Number(this.autoManualNumberVehicle) + Number(count),
        status: status
      }
      this.post.updateAssignedAutoManualNumberPOST(data)
        .subscribe(res => {
          // this.getfuelDealerIdByCorporateIdForCalling(status)
        })

    }
    else {

    }
  }

  closeModal() {
    this.productPrice = '';
    this.productPriceDetails.length = 0;
    this.isSelected2 = false;
    this.isVehicleViewed = false
    this.requestVehicle.controls["vehicleNumber"].setValue('');
    this.requestVehicle.controls["productPrice"].setValue('');
    this.requestVehicle.controls["productName"].setValue('');

  }

  removeVehicleIndex() {
    this.CreditVehicleRequestDataArray.splice(this.indexFuelVehicle, 1);
    this.countVehicle = this.countVehicle - 1;
    this.modalRef.close()

  }
}

