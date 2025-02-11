import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../stats.services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { CreditRequest } from 'src/app/pages/dealer/credit/creditRequest.modal';
import { MixedService } from '../../mixed/mixed.services';

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
  selector: 'app-stats-widget16',
  templateUrl: './stats-widget16.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class StatsWidget16Component {
  @ViewChild('content') content: any;
  @ViewChild("myinput") myInputField: ElementRef;
  isAlert: boolean = false;
  dealerMobile: any;
  fuelDealerId: any;

  CreditRequest = new CreditRequest();
  requestTransporter = new FormGroup({
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

  requestTransporter1 = new FormGroup({
    dealerName: new FormControl(),
    dealerLocation: new FormControl(),
    personName: new FormControl(),
    personPhone1: new FormControl(),
    selectedCorp: new FormControl('', [Validators.required]),
  });

  acceesGroupId: any;
  error = '';
  isCarrierFound: boolean = false;
  customerId: any;
  viewCorpFlag: any = [];
  modalRef: any;
  closeResult: string;
  CreditRequestDataArray: any = [];
  fuelProductId: any;
  productPriceDetails: any = [];
  isSelected2: boolean = false;
  todayDate = moment(new Date()).format("DD-MM-YYYY");
  productPrice: any;
  autoManualStatus: any = 'FALSE';
  count: any = 1;
  autoManualNumber: any;
  productInfo: any = [];
  dealerLoginVPId: any;
  dealerCorporateId: any;
  settingRate: any;
  allProductPriceList: any = [];
  acceesGroup: any;
  managerPersonId: any;
  managerName: string;
  managerVPPersonId: any;
  productName1: any;
  fuelDealerCustomerMapId: any;
  isSelected1: boolean = false;
  mappingPreviousStatus: any;
  dealerName: any;
  personName: string;
  gstNumber: any;
  dealerLocation: string;
  lastCRDate: any;
  islastCRDate: boolean = false;
  fuelDealerSQLId: any;
  PANno: any;
  smsMappingStatus: any;
  emailMappingStatus: any;
  updateCorporateId: any;
  personPhone1: any;
  fuelDealerCorpMapIdNew: any;
  rangeFrom: any;
  rangeTo: any;
  personId: any;
  corporateList: any = [];
  calOutstanding: number;
  showamount: boolean = false;
  combineManualNumber: string;
  isFuelVehicles: boolean = false;
  fuelVehicles: any = [];
  isVehSelect: boolean = false;
  vehicleId: any;
  vehicleVPStatus: string;
  indexFuelCr: number;
  closeRequestDate = moment(new Date()).format("DD-MM-YYYY");
  fuelDealerStaffId: any;
  isBalance1: boolean = false;
  isCRQUANTITY: boolean = false;
  isQUANTITY: boolean = false;
  fleetStatus: any;
  isTable: boolean = false;
  isTable1: boolean = false;
  isTable2: boolean = false;
  isVehicleViewed: boolean = false;

  constructor(
    private modalService: NgbModal,
    private post: StatsService,
    private post1: MixedService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerCorporateId = localStorage.getItem('dealerCorporateId');
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.managerName = element.firstName + ' ' + element.lastName
    this.acceesGroup = element.accessGroupId;
    this.requestTransporter.controls["requestType"].setValue("showamount");
    this.requestTransporter.controls["requestType"].setValue("showamount");
    this.requestTransporter.controls["estimatedRefuelDate"].setValue(this.todayDate);
    this.requestTransporter.controls["priceDate"].setValue(this.todayDate);
    this.requestTransporter.controls["productPrice"].setValue("");
    this.getfuelDealerIdByCorporateId(this.dealerCorporateId);
    this.getFuelStaffIdByfuelDealerId(this.fuelDealerId);
    this.cd.detectChanges()
  }

  // getfuelDealerIdByDealerCorporateId
  getfuelDealerIdByCorporateId(dealerCorporateId: any) {
    let data = {
      corporateId: dealerCorporateId
    }
    this.post.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.getProductsByDealerId(this.fuelDealerId);
          this.getCorporateMappedListByDealerId(this.fuelDealerId);
          this.addFormRequest()
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
        }
      })
  }

  getPrice(id: any, setFuelPrice: any) {
    if (this.requestTransporter.value.priceDate) {
      this.CreditRequestDataArray.length = 0;
      this.addFormRequest()
      this.fuelProductId = id.target.value;
      let data = {
        dealerId: this.fuelDealerId,
        fuelProductId: this.fuelProductId,
        date: moment(this.requestTransporter.value.priceDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getPriceByDealerProductIdByDatePOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.isSelected2 = true;
            this.productPriceDetails = res.data;
            this.requestTransporter.controls["productPrice"].setValue(res.data[0].productSellingPrice);
            // this.requestVehicle.controls["productPrice"].setValue(res.data[0].productSellingPrice);
            this.requestTransporter.controls["productName1"].setValue(res.data[0].productCategory + '-' + res.data[0].productName);
            this.requestTransporter.controls["estimatedRefuelDate"].setValue(this.requestTransporter.value.priceDate);
            // this.requestTransporterAdvance.controls["productPrice"].setValue(res.data[0].productSellingPrice);

            // this.productName1 = res.data[0].productName;
            // this.productName11 = res.data[0].productCategory;
            this.productPrice = res.data[0].productSellingPrice;
            this.cd.detectChanges()
          } else {
            alert("Please Set Fuel Price first for Selected Date..!")
            // this.unitForm.controls["productPriceDate"].setValue(this.requestTransporter.value.priceDate)
            this.opensetFuelPrice(setFuelPrice)
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
            this.requestTransporter.controls["productPrice"].setValue(res.data[0].productSellingPrice);
            this.productPrice = res.data[0].productSellingPrice;
            this.requestTransporter.controls["estimatedRefuelDate"].setValue(this.requestTransporter.value.priceDate);
            // this.productName1 = res.data[0].productName;
            // this.productName11 = res.data[0].productCategory;
            this.productPrice = res.data[0].productSellingPrice;
            this.cd.detectChanges()
          } else {
            alert("Please Set Fuel Price first for Selected Date..!")
            this.cd.detectChanges()
          }
        })
    }

  }

  opensetFuelPrice(setFuelPrice: any) {
    this.modalRef = this.modalService.open(setFuelPrice, { size: 'sm' });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }


  addFormRequest() {
    if (this.autoManualStatus == 'TRUE') {
      this.count = this.count + 1;

      this.CreditRequest = new CreditRequest();
      this.CreditRequest.manualNumber = this.autoManualNumber
      this.CreditRequestDataArray.push(this.CreditRequest);
    } else {
      this.count = this.count + 1;
      if (this.count < 12) {
        this.CreditRequest = new CreditRequest();
        this.CreditRequestDataArray.push(this.CreditRequest);
      }
      else {
        this.count = 11;
        alert("Please save 10 credit entries, before adding more credit entries for a customer (max entries allowed per submit is currently capped at 5)")
      }
    }


  }

  logValue() {
    this.requestTransporter.controls["productName"].setValue("")
    this.requestTransporter.controls["productPrice"].setValue("")
    // this.productName1 = '';
    this.productPrice = '';
    this.productPriceDetails.length = 0;
  }

  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getFuelProductIdByDealerIdPOST(data).subscribe(res => {
      if (res) {
        this.productInfo = res.data;
        this.allProductPriceList = res.data;
        this.cd.detectChanges()
      }
    })
  }

  setPrice(id: any) {
    this.settingRate = id.target.value;
    this.requestTransporter.controls["productPrice"].setValue(this.settingRate);
    // this.requestTransporterAdvance.controls["productPrice"].setValue(this.settingRate);
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
      this.post.addFuelPriceByDealerIdPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("Fuel Price Set Successfully!");
            this.allProductPriceList.length = 0;
            this.getPrice1(this.requestTransporter.value.productName)
            this.modalRef.close('close');
            this.spinner.hide();
            this.unitForm.controls['productPriceDate'].setValue(this.requestTransporter.value.priceDate);
            this.getProductsByDealerId(this.fuelDealerId);
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
        this.post.addFuelPriceByDealerIdPOST(data)
          .subscribe(res => {
            if (res.status == 'OK') {
              alert("Fuel Price Set Successfully!");
              this.allProductPriceList.length = 0;
              this.getPrice1(this.requestTransporter.value.productName)
              this.modalRef.close('close');
              this.spinner.hide();
              this.unitForm.controls['productPriceDate'].setValue(this.requestTransporter.value.priceDate);
              this.getProductsByDealerId(this.fuelDealerId);
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

  getPrice1(id: any) {

    if (this.requestTransporter.value.priceDate) {
      this.fuelProductId = id;
      let data = {
        dealerId: this.fuelDealerId,
        fuelProductId: this.fuelProductId,
        date: moment(this.requestTransporter.value.priceDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getPriceByDealerProductIdByDatePOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.isSelected2 = true;
            this.productPriceDetails = res.data;
            this.requestTransporter.controls["productPrice"].setValue(res.data[0].productSellingPrice);
            this.requestTransporter.controls["productName1"].setValue(res.data[0].productCategory + '-' + res.data[0].productName);
            this.requestTransporter.controls["estimatedRefuelDate"].setValue(this.requestTransporter.value.priceDate);
            this.productName1 = res.data[0].productName;
            this.productPrice = res.data[0].productSellingPrice;
          } else {

          }
        })
    }
  }

  getDetailsByfuelDealerCustomerMapIdId(id: any) {
    if (id.target.value) {
      this.fuelDealerCustomerMapId = id.target.value;
      this.getCorporateInfoByfuelDealerCustomerMapId(this.fuelDealerCustomerMapId);
      this.cd.detectChanges()
    }
    else {
      alert("Please select customer")
    }
  }

  getCorporateInfoByfuelDealerCustomerMapId(customerName: any) {

    let data = {
      fuelDealerId: this.fuelDealerId,
      customerName: customerName,
    }
    this.post.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
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
          this.getFuelVehicleByMapId(this.fuelDealerCorpMapIdNew);
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

  getFlagStatusByCorpId(corporateIdForFlag: any) {
    let data = {
      corporateIdForFlag: corporateIdForFlag
    }
    this.post.getFlagStatusByCorpIdPOST(data)
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

  getCorporateMappedListByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getCorporatesAllMappedRequestByDealerPOST(data)
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
    this.post.getOutstandingByCustMapIdPOST(data)
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

  changeAmountToQuantity(event: any) {
    this.showamount = false;
  }

  changeQuantityToAmount(event: any) {
    this.showamount = true;
  }

  setManualNumber(i: any) {
    if (Number(this.CreditRequest.manualNumber) >= Number(this.rangeFrom) && Number(this.CreditRequest.manualNumber) <= Number(this.rangeTo) || Number(this.rangeTo) == 0) {
      if (Number(this.rangeTo) == 0) {
        this.requestTransporter.controls["manualCrNumber"].setValue(this.CreditRequest.manualNumber)
        this.checkManualNumRangeForNotAssign(this.CreditRequest.manualNumber, i, 'CREDIT')
      } else {
        this.requestTransporter.controls["manualCrNumber"].setValue(this.CreditRequest.manualNumber)
        this.checkBillManualNumber(this.CreditRequest.manualNumber, i)
      }
    } else {
      if (this.autoManualStatus == 'TRUE') {
        this.requestTransporter.controls["manualCrNumber"].setValue(this.CreditRequest.manualNumber)
      } else {
        alert('manual number exceed limit!')
        this.CreditRequestDataArray[i].manualNumber = '';
        this.requestTransporter.controls["manualCrNumber"].setValue('')
      }
    }
  }

  checkManualNumRangeForNotAssign(manualNumber: any, i: any, purpose: any) {
    let data = {
      manualNumber: manualNumber,
      fuelDealerId: this.fuelDealerId,
    }
    this.post.checkManualNumRangeForNotAssignPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          alert('Manual number series already Assign To Other Customer')
          this.combineManualNumber = '';
          this.requestTransporter.controls["manualCrNumber"].setValue('')
          if (this.CreditRequestDataArray.length) {
            this.CreditRequestDataArray[i].manualNumber = '';
          }

        } else {
          if (purpose == 'CREDIT') {
            this.checkBillManualNumber(this.CreditRequest.manualNumber, i)
          }
          if (purpose == 'COMBINE') {
            this.checkBillnameCombine(this.combineManualNumber)
          }
        }
      })
  }

  checkBillManualNumber(manualNumber: any, i: any) {
    let data = {
      manualNumber: manualNumber,
      fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
      fuelDealerId: this.fuelDealerId,
      purpose: 'CREDIT'

    }
    this.post.getManualNumberPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          alert('Manual number already exist')
          this.CreditRequestDataArray[i].manualNumber = '';
          this.requestTransporter.controls["manualCrNumber"].setValue('')
        }
      })
  }

  checkBillnameCombine(manualNumber: any) {
    let data = {
      manualNumber: manualNumber,
      fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
      fuelDealerId: this.fuelDealerId,
    }
    this.post.getManualNumberPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          alert('Manual number already exist')
          this.combineManualNumber = '';
        }
      })

  }

  getFuelVehicleByMapId(fuelDealerCustomerMapId: any) {
    this.spinner.show();
    this.fuelVehicles = [];
    this.isFuelVehicles = false;
    let data = {
      fuelDealerCustomerMapId: fuelDealerCustomerMapId,
    }
    this.post.getfuelCreditVehicleByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK' && res.data.length) {
          this.fuelVehicles = res.data
          this.isFuelVehicles = true;
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.isFuelVehicles = false;
          this.spinner.hide();
          this.cd.detectChanges()
        }
      });
  }

  setVehicleNumber(i: number) {
    this.requestTransporter.controls["vehicleNumber"].setValue(this.CreditRequest.vehicleNumber)
    if (this.autoManualStatus == 'TRUE') {
      this.requestTransporter.controls["manualCrNumber"].setValue(this.CreditRequest.manualNumber)
    }
    this.submitSearchVehicle(i)
  }

  submitSearchVehicle(i: number) {
    this.spinner.show();
    if (this.requestTransporter.value.vehicleNumber) {
      this.isVehSelect = true;
      const data = {
        vehicleRegistrationNumber: this.CreditRequestDataArray[i].vehicleNumber,
      };
      this.post.VehicleByRegistrationNumberPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.CreditRequestDataArray[i].vehicleId = res.data[0].vehicleId
            this.CreditRequestDataArray[i].vehicleVPStatus = 'TRUE'
            this.vehicleId = res.data[0].vehicleId;
            this.vehicleVPStatus = 'TRUE';
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.vehicleVPStatus = 'FALSE';
            this.CreditRequestDataArray[i].vehicleVPStatus = 'FALSE';
          }
        });
    }
    else {
      ("Please Enter Vehicle Number!")
      this.isVehSelect = false;
      this.spinner.hide();
    }
  }

  amountCalculateNEW(i: number) {
    if (this.requestTransporter.value.productPrice) {
      if (this.CreditRequestDataArray[i].creditAmount) {
        if (this.CreditRequestDataArray[i].creditAmount > 0) {
          this.CreditRequestDataArray[i].creditQuantity = Number((this.CreditRequestDataArray[i].creditAmount) / (this.requestTransporter.value.productPrice)).toFixed(2)
          this.requestTransporter.controls["reqQuantity"].setValue(this.CreditRequestDataArray[i].creditQuantity)
          this.requestTransporter.controls["reqCreditAmount"].setValue(this.CreditRequestDataArray[i].creditAmount)
          this.requestTransporter.controls["actualCreditQuantity"].setValue(this.CreditRequestDataArray[i].creditQuantity)
          this.requestTransporter.controls["actualCreditAmount"].setValue(this.CreditRequestDataArray[i].creditAmount)
          console.log('creditAmount:', this.CreditRequestDataArray[i].creditAmount);
          console.log('productPrice:', this.requestTransporter.value.productPrice);
        } else {

        }
      } else {

      }
    } else {
      alert("Please Select product Price")
    }

  }

  quantityCalculateNEW(i: number) {
    if (this.requestTransporter.value.productPrice) {
      if (this.CreditRequestDataArray[i].creditQuantity) {
        if (this.CreditRequestDataArray[i].creditQuantity > 0) {
          this.CreditRequestDataArray[i].creditAmount = Number((this.requestTransporter.value.productPrice) * (this.CreditRequestDataArray[i].creditQuantity)).toFixed(2)
          this.requestTransporter.controls["reqQuantity"].setValue(this.CreditRequestDataArray[i].creditQuantity)
          this.requestTransporter.controls["reqCreditAmount"].setValue((this.CreditRequestDataArray[i].creditAmount))
          this.requestTransporter.controls["actualCreditQuantity"].setValue(this.CreditRequestDataArray[i].creditQuantity)
          this.requestTransporter.controls["actualCreditAmount"].setValue(this.CreditRequestDataArray[i].creditAmount)
        } else {
          this.CreditRequestDataArray[i].creditQuantity = ''
        }
      }
    } else {
      alert("Please Select product Price")
    }

  }

  selectVehicle() {
    alert("Please Enter vehicle no.")
  }

  removeFormRequest(i: number, removeTable: any) {
    this.indexFuelCr = i;
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
    this.post.getFuelStaffIdByfuelDealerIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.fuelDealerStaffId = res.data[0].fuelDealerStaffId;
        }
        else {
        }
      })
  }

  submitByDealerNEW1() {
    if (this.acceesGroup == 12 || this.acceesGroup == 19) {
      this.spinner.show()
      if (this.requestTransporter.value.estimatedRefuelDate) {
        if (this.requestTransporter.value.actualCreditAmount || this.requestTransporter.value.actualCreditQuantity) {
          if (this.fuelDealerCorpMapIdNew) {
            if (this.requestTransporter.value.productName) {
              if (this.requestTransporter.value.reqQuantity) {
                if (this.personId) {
                  if (this.requestTransporter.value.manualCrNumber) {

                    if (this.acceesGroup == '2' || this.acceesGroup == '3' || this.acceesGroup == '4') {
                      this.fleetStatus = "TRUE"
                    }
                    else {
                      this.fleetStatus = "FALSE"
                    }
                    let data = {
                      crDetails: this.CreditRequestDataArray,
                      fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                      reqQuantity: this.requestTransporter.value.reqQuantity,
                      reqCreditAmount: this.requestTransporter.value.reqCreditAmount,
                      estimatedRefuelDate: moment(this.requestTransporter.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                      fuelDealerId: this.fuelDealerSQLId,
                      vehicleId: this.vehicleId,
                      driverId: this.personId,
                      fleetNoFleetStatus: this.fleetStatus,
                      fuelProductId: this.requestTransporter.value.productName,
                      fuelCorporateId: this.dealerCorporateId,
                      creditSource: "DEALER",
                      PANno: this.PANno,
                      transDateTime: moment(this.closeRequestDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                      transactionTime: moment(new Date()).format('hh:mm:ss'),
                      creditAmount: this.requestTransporter.value.actualCreditAmount,
                      transactionStatus: 'COMPLETE',
                      fuelDealerStaffId: this.fuelDealerStaffId,
                      actualCreditQuantity: this.requestTransporter.value.actualCreditQuantity,
                      createdAt: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                      productRate: this.requestTransporter.value.productPrice,
                      vehicleNumber: this.requestTransporter.value.vehicleNumber,
                      vehicleVPStatus: this.vehicleVPStatus,
                      manualCrNumber: this.requestTransporter.value.manualCrNumber,
                      isMappingSMS: this.smsMappingStatus,
                      isMappingEmail: this.emailMappingStatus,
                      autoManualStatus: this.autoManualStatus
                    }

                    this.post.addCreditReqByDealerForAllPOST(data)
                      .subscribe(res => {
                        if (res.status == "OK") {
                          alert("Credit Added Sccessfully!");
                          this.isBalance1 = false;
                          this.spinner.hide();
                          if (this.autoManualStatus == 'TRUE') {
                            this.myInputField.nativeElement.focus();
                            this.updateAssignedAutoManualNumber('CREDIT', res.count)

                            // this.getFuelCreditRequestByfuelDealerId(this.fuelDealerId);
                            this.isCRQUANTITY = false;
                            this.isQUANTITY = false;
                            this.CreditRequestDataArray = [];
                            this.count = 1;
                            this.requestTransporter.controls["requestType"].setValue("showamount");
                            this.requestTransporter.controls["requestTypeCR"].setValue("showamount");
                            // this.closeRequestForm.controls["requestTypeClose"].setValue("showamount");
                            this.checkDates(this.fuelDealerCorpMapIdNew, moment(this.requestTransporter.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                            this.requestTransporter.controls["manualCrNumber"].setValue("");
                            this.requestTransporter.controls["actualCreditQuantity"].setValue("");
                            this.requestTransporter.controls["actualCreditAmount"].setValue("");
                            this.requestTransporter.controls["reqCreditAmount"].setValue("");
                            this.requestTransporter.controls["reqQuantity"].setValue("");
                            this.requestTransporter.controls["vehicleNumber"].setValue("");
                            this.requestTransporter.controls["productPrice"].setValue('');
                            this.requestTransporter.controls["productName"].setValue('');
                          } else {

                            this.myInputField.nativeElement.focus();
                            // this.getFuelCreditRequestByfuelDealerId(this.fuelDealerId);
                            this.isCRQUANTITY = false;
                            this.isQUANTITY = false;
                            this.CreditRequestDataArray = [];
                            this.count = 1;
                            this.requestTransporter.controls["requestType"].setValue("showamount");
                            this.requestTransporter.controls["requestTypeCR"].setValue("showamount");
                            // this.closeRequestForm.controls["requestTypeClose"].setValue("showamount");
                            this.addFormRequest();
                            this.checkDates(this.fuelDealerCorpMapIdNew, moment(this.requestTransporter.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                            this.requestTransporter.controls["manualCrNumber"].setValue("");
                            this.requestTransporter.controls["actualCreditQuantity"].setValue("");
                            this.requestTransporter.controls["actualCreditAmount"].setValue("");
                            this.requestTransporter.controls["reqCreditAmount"].setValue("");
                            this.requestTransporter.controls["reqQuantity"].setValue("");
                            this.requestTransporter.controls["vehicleNumber"].setValue("");
                            this.requestTransporter.controls["productPrice"].setValue('');
                            this.requestTransporter.controls["productName"].setValue('');
                          }

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
              alert("Please Select Product!")
              this.spinner.hide();
            }
          }
          else {
            alert("Please Select Transporter!")
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
        if (this.requestTransporter.value.estimatedRefuelDate) {
          if (this.requestTransporter.value.actualCreditAmount || this.requestTransporter.value.actualCreditQuantity) {
            if (this.fuelDealerCorpMapIdNew) {
              if (this.requestTransporter.value.productName) {
                if (this.requestTransporter.value.reqQuantity) {
                  if (this.personId) {
                    if (this.requestTransporter.value.manualCrNumber) {

                      if (this.acceesGroup == '2' || this.acceesGroup == '3' || this.acceesGroup == '4') {
                        this.fleetStatus = "TRUE"
                      }
                      else {
                        this.fleetStatus = "FALSE"
                      }
                      let data = {
                        crDetails: this.CreditRequestDataArray,
                        fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                        reqQuantity: this.requestTransporter.value.reqQuantity,
                        reqCreditAmount: this.requestTransporter.value.reqCreditAmount,
                        estimatedRefuelDate: moment(this.requestTransporter.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                        fuelDealerId: this.fuelDealerId,
                        vehicleId: this.vehicleId,
                        driverId: this.personId,
                        fleetNoFleetStatus: this.fleetStatus,
                        fuelProductId: this.requestTransporter.value.productName,
                        fuelCorporateId: this.dealerCorporateId,
                        creditSource: "DEALER",
                        PANno: this.PANno,
                        transDateTime: moment(this.closeRequestDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                        transactionTime: moment(new Date()).format('hh:mm:ss'),
                        creditAmount: this.requestTransporter.value.actualCreditAmount,
                        transactionStatus: 'COMPLETE',
                        fuelDealerStaffId: this.fuelDealerStaffId,
                        actualCreditQuantity: this.requestTransporter.value.actualCreditQuantity,
                        createdAt: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                        productRate: this.requestTransporter.value.productPrice,
                        vehicleNumber: this.requestTransporter.value.vehicleNumber,
                        vehicleVPStatus: this.vehicleVPStatus,
                        manualCrNumber: this.requestTransporter.value.manualCrNumber,
                        managerVPPersonId: this.managerVPPersonId,
                        managerPersonId: this.managerPersonId,
                        managerName: this.managerName,
                        isMappingSMS: this.smsMappingStatus,
                        isMappingEmail: this.emailMappingStatus
                      }

                      this.post.addCreditReqByDealerForAllPOST(data)
                        .subscribe(res => {
                          if (res.status == "OK") {
                            this.myInputField.nativeElement.focus();
                            alert("Credit Added Sccessfully!");
                            this.isBalance1 = false;
                            this.spinner.hide();
                            if (this.autoManualStatus == 'TRUE') {
                              this.updateAssignedAutoManualNumber('CREDIT', res.count)

                              // this.getFuelCreditRequestByfuelDealerId(this.fuelDealerId);
                              this.isCRQUANTITY = false;
                              this.isQUANTITY = false;
                              this.CreditRequestDataArray = [];
                              this.count = 1;
                              this.requestTransporter.controls["requestType"].setValue("showamount");
                              this.requestTransporter.controls["requestTypeCR"].setValue("showamount");
                              // this.closeRequestForm.controls["requestTypeClose"].setValue("showamount");
                              this.checkDates(this.fuelDealerCorpMapIdNew, moment(this.requestTransporter.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                              this.requestTransporter.controls["manualCrNumber"].setValue("");
                              this.requestTransporter.controls["actualCreditQuantity"].setValue("");
                              this.requestTransporter.controls["actualCreditAmount"].setValue("");
                              this.requestTransporter.controls["reqCreditAmount"].setValue("");
                              this.requestTransporter.controls["reqQuantity"].setValue("");
                              this.requestTransporter.controls["vehicleNumber"].setValue("");
                              this.requestTransporter.controls["productPrice"].setValue('');
                              this.requestTransporter.controls["productName"].setValue('');
                            } else {
                              // this.getFuelCreditRequestByfuelDealerId(this.fuelDealerId);
                              this.isCRQUANTITY = false;
                              this.isQUANTITY = false;
                              this.CreditRequestDataArray = [];
                              this.count = 1;
                              this.requestTransporter.controls["requestType"].setValue("showamount");
                              this.requestTransporter.controls["requestTypeCR"].setValue("showamount");
                              // this.closeRequestForm.controls["requestTypeClose"].setValue("showamount");
                              this.addFormRequest();
                              this.checkDates(this.fuelDealerCorpMapIdNew, moment(this.requestTransporter.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                              this.requestTransporter.controls["manualCrNumber"].setValue("");
                              this.requestTransporter.controls["actualCreditQuantity"].setValue("");
                              this.requestTransporter.controls["actualCreditAmount"].setValue("");
                              this.requestTransporter.controls["reqCreditAmount"].setValue("");
                              this.requestTransporter.controls["reqQuantity"].setValue("");
                              this.requestTransporter.controls["vehicleNumber"].setValue("");
                              this.requestTransporter.controls["productPrice"].setValue('');
                              this.requestTransporter.controls["productName"].setValue('');
                            }
                          }

                          else {
                            alert("Error to Created Request!")
                            this.isBalance1 = false;
                            this.spinner.hide();
                          }
                        });


                    } else {
                      alert("Please Enter Bill / Ref Number!")
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
                alert("Please Select Product!")
                this.spinner.hide();
              }
            }
            else {
              alert("Please Select Transporter!")
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

      }
    }
  }

  closeModal() {
    this.personPhone1 = '';
    this.personName = '';
    this.dealerLocation = '';
    this.dealerName = '';
    this.productName1 = '';
    this.productPrice = '';
    this.requestTransporter1.controls["selectedCorp"].setValue('');
    this.requestTransporter.controls["productPrice"].setValue('');
    this.requestTransporter.controls["productName"].setValue('');
    this.CreditRequest.vehicleNumber = '';
    this.CreditRequest.manualNumber = '';
    this.CreditRequest.creditQuantity = '';
    this.CreditRequest.creditAmount = '';
    this.CreditRequestDataArray.length = 0;
    this.productPriceDetails.length = 0;
    this.count = 1;
    this.isSelected1 = false;
    this.isSelected2 = false;
    this.addFormRequest();

  }

  removeRequestIndex() {
    this.CreditRequestDataArray.splice(this.indexFuelCr, 1);
    this.count = this.count - 1;
    this.modalRef.close()
  }

  updateAssignedAutoManualNumber(status: string, count: any) {
    if (status == "CREDIT") {
      let data = {
        fuelDealerId: this.fuelDealerId,
        assignedAutoManualNumber: Number(this.autoManualNumber) + Number(count),
        status: status
      }
      this.post1.updateAssignedAutoManualNumberPOST(data)
        .subscribe(res => {
          // this.getfuelDealerIdByCorporateIdForCalling(status)

        })
    } else {

    }
  }

  checkDates(mapId: any, date: any) {
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
        this.post1.updateLastCRDateByMapIdPOST(data)
          .subscribe(res => {
            if (res.status == 'OK') {
              this.spinner.hide();
              this.updateDateByMapId(mapId)
              this.isSelected1 = false
              this.requestTransporter1.controls["selectedCorp"].setValue('');
              this.isTable = false
              this.isTable1 = false
              this.isTable2 = false
              this.lastCRDate = ''
              this.isVehicleViewed = false
            } else {
              this.spinner.hide();
              this.updateDateByMapId(mapId)
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
      this.post1.updateLastCRDateByMapIdPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            this.updateDateByMapId(mapId)
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
            this.updateDateByMapId(mapId)
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

  updateDateByMapId(fuelDealerCustomMapId: any) {
    let data1 = {
      mapId: fuelDealerCustomMapId
    }
    this.post1.updateLastCRDateMapIdWisePOST(data1)
      .subscribe((res) => {
        if (res.status == 'OK') {
          this.fuelDealerCorpMapIdNew = ''
        } else {
          this.fuelDealerCorpMapIdNew = ''
        }
      })
  }
}