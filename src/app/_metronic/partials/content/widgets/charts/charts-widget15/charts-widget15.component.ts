import { ChangeDetectorRef, Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { ListWidgetService } from '../../lists/listWidget.services';
import { ChartsService } from '../charts.services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

@Injectable()
export class CustomAdapter extends NgbDateAdapter<any> {

  readonly DELIMITER = '-';

  fromModel(value: any | null): NgbDateStruct | null {
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

  toModel(date: NgbDateStruct | null): any | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: any): NgbDateStruct | null {
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

  format(date: NgbDateStruct | null): any {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-charts-widget15',
  templateUrl: './charts-widget15.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class ChartsWidget15Component implements OnInit {

  cashBillFuelForm = new FormGroup({
    priceDate: new FormControl(),
    billNumber: new FormControl('', Validators.required),
    productName: new FormControl('', Validators.required),
    product: new FormControl('', Validators.required),
    productPrice: new FormControl('', Validators.required),
    customerName: new FormControl('', Validators.required),
    customerNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    vehicleNumber: new FormControl('', Validators.required),
    reqQuantity: new FormControl(),
    reqCreditAmount: new FormControl(),
    requestType: new FormControl(),
  });

  cashBillLubricantForm = new FormGroup({
    priceDate: new FormControl(),
    billNumber: new FormControl('', Validators.required),
    productName: new FormControl('', Validators.required),
    productPrice: new FormControl('', Validators.required),
    customerName: new FormControl('', Validators.required),
    customerNumber: new FormControl('', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    vehicleNumber: new FormControl(''),
    reqQuantity: new FormControl(),
    reqCreditAmount: new FormControl(),
    requestType: new FormControl(),
    cgst: new FormControl(),
    igst: new FormControl(),
    gst: new FormControl(),
    gstType: new FormControl(),
    unit: new FormControl(),
    lubeId: new FormControl('', Validators.required),
    gstNumber: new FormControl('', Validators.required),
    hsnSacNumber: new FormControl('', Validators.required),
    tax: new FormControl('', Validators.required),
    taxDetails: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    totalAmount: new FormControl(Validators.required),
    totalWOGSTAmount: new FormControl('', Validators.required),

  });

  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  managerName: string;
  pumpCity: any;
  userId: any;
  dealerLoginId: any;
  companyName: any;
  oilCompanyName: any;
  brandName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  ownerName: string;
  dealerAccess: boolean = false;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  modalRef: any;
  closeResult: string;
  todayDate = new Date();
  fuelCashBillList: any = [];
  allCashBillData: any = [];
  lubeCashBillList: any = [];
  allLubeCashBillData: any = [];
  selected: string;
  status: string;
  headerName1: any;
  headerName3: string;
  GSTNumber: string;
  productPrice: string;
  productPriceDetails: any = [];
  CreditRequestDataArray: any = [];
  fuelProductId: any;
  isSelected2: boolean = false;
  fuelUnit: string;
  Amount: number;
  reqQuantityDecimal: number;
  productInfo: any = [];
  settingRate: any;
  isQUANTITY: boolean = false;
  isAMOUNT: boolean = true;
  createdBy: string;
  address1: string;
  address2: string;
  isInSystem: boolean = false;
  dealerGSTStateCode: string;
  subGST: string;
  corporateList: any = [];
  unit: any;
  isQuantityRatio: boolean = false;
  quantityRatio: any;
  lubricantList: any = [];
  gstAmount: any;
  gstDetails: any = [];
  quantityInPieces: any;

  constructor(
    private post: ChartsService,
    private post1: ListWidgetService,
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

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.accessGroup = element.accessGroupId;
    // this.managerVPPersonId = element.veelsPlusId
    // this.managerPersonId = element.personId
    this.createdBy = element.firstName + ' ' + element.lastName
    if (element.accessGroupId == 12 || element.accessGroupId == 14) {
      this.managerName = element.firstName + ' ' + element.lastName;
      this.pumpCity = dealerData.city
      this.userId = element.userId;
      this.dealerLoginId = element.veelsPlusCorporateID;
      this.companyName = dealerData.companyName
      this.oilCompanyName = dealerData.brandName
      this.brandName = dealerData.brandName
      this.state = dealerData.state
      this.pin = dealerData.pin
      this.city = dealerData.city
      this.phone1 = dealerData.hostPhone
      if (element.accessGroupId == 12 || element.accessGroupId == 14) {
        this.dealerAccess = true
      }
      this.headerName1 = this.companyName;
      // this.headerName2 = res.data[0].address1+', '+res.data[0].address2+', '+res.data[0].city;
      this.headerName3 = this.state + '-' + this.pin + '  ' + "GST: " + this.GSTNumber;

    }
    this.cashBillLubricantForm.controls['gst'].setValue("")
    this.cashBillLubricantForm.controls['taxDetails'].setValue("INCLUDE")
    this.getProductsByDealerId(this.fuelDealerId);
    this.getCorporateMappedListByDealerId(this.fuelDealerId);
    this.getLubricants(this.fuelDealerId);
    this.getGSTDetails()
    this.cd.detectChanges()
  }


  pageChangeEvent(event: number) {
    this.p = event;
    // this.view();
    // this.getCashBillDetails()
  }

  logValue() {
    this.cashBillFuelForm.controls["productName"].setValue("")
    this.cashBillFuelForm.controls["productPrice"].setValue("")
    this.productPrice = '';
    this.productPriceDetails.length = 0;
  }

  getPrice(id: any) {

    if (this.cashBillFuelForm.value.priceDate) {
      this.CreditRequestDataArray.length = 0;
      this.fuelProductId = id.target.value;
      let data = {
        dealerId: this.fuelDealerId,
        fuelProductId: this.fuelProductId,
        date: moment(this.cashBillFuelForm.value.priceDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post1.getPriceByDealerProductIdByDatePOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.isSelected2 = true;
            this.productPriceDetails = res.data;
            this.cashBillFuelForm.controls["productPrice"].setValue(res.data[0].productSellingPrice);
            this.cashBillFuelForm.controls["product"].setValue(res.data[0].productName);
            if (res.data[0].productName == 'CNG') {
              this.fuelUnit = 'Kg'
            } else {
              this.fuelUnit = 'Ltr'
            }
            this.productPrice = res.data[0].productSellingPrice;
            this.quantityCalculateForEdit()
            this.amountCalculateForEdit();
          } else {
            this.fuelUnit = ''
            this.productPriceDetails.length = 0
          }
        })

    }
  }

  quantityCalculateForEdit() {
    this.Amount = Number(this.cashBillFuelForm.value.productPrice) * Number(this.cashBillFuelForm.value.reqQuantity)

    this.cashBillFuelForm.controls["reqCreditAmount"].setValue(this.Amount.toFixed(2))

  }

  amountCalculateForEdit() {

    this.reqQuantityDecimal = Number(this.cashBillFuelForm.value.reqCreditAmount) / Number(this.cashBillFuelForm.value.productPrice)
    // console.log("CalculationDecimal:", this.reqQuantityDecimal.toFixed(2))
    this.cashBillFuelForm.controls["reqQuantity"].setValue(this.reqQuantityDecimal.toFixed(2))
  }

  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getFuelProductIdByDealerIdPOST(data).subscribe(res => {
      if (res) {
        this.productInfo = res.data;
        this.cd.detectChanges()
      }
    })
  }

  setPrice(id: any) {
    this.settingRate = id.target.value;
    this.cashBillFuelForm.controls["productPrice"].setValue(this.settingRate);
    this.productPrice = this.settingRate;

  }

  getCompleteForEdit() {
    this.isQUANTITY = false;
    this.isAMOUNT = true;
  }

  getPartialForEdit() {
    this.isQUANTITY = true;
    this.isAMOUNT = false;
  }

  submitFuelCashBill() {
    if (this.cashBillFuelForm.value.priceDate && this.cashBillFuelForm.value.productName
      && this.cashBillFuelForm.value.productPrice && this.cashBillFuelForm.value.customerName
      && this.cashBillFuelForm.value.reqQuantity && this.cashBillFuelForm.value.reqCreditAmount) {
      this.spinner.show()
      let data = {
        cashBillCreatedBy: this.createdBy,
        fuelDealerId: this.fuelDealerId,
        cashBillDate: moment(this.cashBillFuelForm.value.priceDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        cashBillNumber: this.cashBillFuelForm.value.billNumber,
        cashBillFor: "FUEL",
        cashBillProduct: this.cashBillFuelForm.value.product,
        cashBillRate: this.cashBillFuelForm.value.productPrice,
        cashBillCustName: this.cashBillFuelForm.value.customerName,
        cashBillCustMobile: this.cashBillFuelForm.value.customerNumber,
        cashBillVehicleNumber: this.cashBillFuelForm.value.vehicleNumber,
        cashBillQuantity: this.cashBillFuelForm.value.reqQuantity,
        cashBillAmount: this.cashBillFuelForm.value.reqCreditAmount,
        cashBillUnit: this.fuelUnit,
      }
      this.post.addCashBillPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.spinner.hide()
            this.goToFuelBillStatement(res.data.insertId)

          } else {
            alert("Error to create bill..!")
            this.spinner.hide()
          }
        })
    } else {
      alert("Please enter all details..")
    }
  }

  goToFuelBillStatement(cashBillId: any) {
    this.post1.setRoutingWithType1("fuelBill", cashBillId)
    this.router.navigate(['/credit/cashBillInvoice']);
  }

  getCorporateInfoByfuelDealerCustomerMapId(id: any) {

    let data = {
      fuelDealerId: this.fuelDealerId,
      customerName: id.target.value,
    }
    this.post1.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.cashBillLubricantForm.controls["address"].setValue('');
          this.cashBillLubricantForm.controls["customerNumber"].setValue('')
          this.cashBillLubricantForm.controls["gstNumber"].setValue('')
          this.address1 = ''
          this.address2 = ''
          this.city = ''
          this.state = ''
          if (res.data.length) {

            this.isInSystem = true;

            this.cashBillLubricantForm.controls["customerNumber"].setValue(res.data[0].phone1)

            if (res.data[0].address1) {
              if (res.data[0].address1 != 'undefined' || res.data[0].address1 != 'null') {
                this.address1 = res.data[0].address1 + ','
              }
            }
            if (res.data[0].address2) {
              if (res.data[0].address2 != 'undefined' || res.data[0].address2 != 'null') {
                this.address2 = res.data[0].address2 + ','
              }
            }
            if (res.data[0].city) {
              if (res.data[0].city != 'undefined' || res.data[0].city != 'null') {
                this.city = res.data[0].city + ','
              }
            }
            if (res.data[0].state) {
              if (res.data[0].state != 'undefined' || res.data[0].state != 'null') {
                this.state = res.data[0].state
              }
            }
            if (res.data[0].pin) {
              if (res.data[0].pin != 'undefined' || res.data[0].pin != 'null') {
                this.pin = ' - ' + res.data[0].pin
              }
            }

            this.cashBillLubricantForm.controls["address"].setValue(this.address1 + this.address2 + this.city + this.state + this.pin)
            if (res.data[0].mappingPreviousStatus == "FALSE") {
              this.cashBillLubricantForm.controls["customerName"].setValue(res.data[0].companyName)
              this.cashBillLubricantForm.controls["gstNumber"].setValue(res.data[0].GSTNumber)
              if (res.data[0].GSTNumber) {
                if (res.data[0].GSTNumber != 'undefined' || res.data[0].GSTNumber != 'null') {
                  this.checkGST()
                }
              }
            }
            else {
              this.cashBillLubricantForm.controls["customerName"].setValue(res.data[0].mappingCompanyName)
              this.cashBillLubricantForm.controls["gstNumber"].setValue(res.data[0].mappingGST)
              if (res.data[0].mappingGST) {
                if (res.data[0].mappingGST != 'undefined' || res.data[0].mappingGST != 'null') {
                  this.checkGST()
                }
              }
            }
          } else {
            this.isInSystem = false;
            this.cashBillLubricantForm.controls["gstNumber"].setValue("")
            this.cashBillLubricantForm.controls["address"].setValue("")
            // console.log("cust Name ", this.cashBillLubricantForm.value.customerName)
          }
        } else {
          this.isInSystem = false;
          this.cashBillLubricantForm.controls["gstNumber"].setValue("")
          this.cashBillLubricantForm.controls["address"].setValue("")
        }
      });
  }

  checkGST() {
    if (this.cashBillLubricantForm.value.gstNumber) {
      if (this.dealerGSTStateCode == (this.cashBillLubricantForm.value.gstNumber.toString()).slice(0, 2)) {
        this.subGST = 'CGST'
      } else {
        this.subGST = 'IGST'
      }
    } else {
      this.subGST = 'CGST'
    }
  }

  getCorporateMappedListByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getCorporatesAllMappedRequestByDealerPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.corporateList = res.data;
        } else {
        }
      });
  }

  checkGST1() {
    if (this.cashBillLubricantForm.value.gstNumber) {
      if ((this.cashBillLubricantForm.value.gstNumber).length == 15) {
        if (this.dealerGSTStateCode == (this.cashBillLubricantForm.value.gstNumber.toString()).slice(0, 2)) {
          this.subGST = 'CGST'
        } else {
          this.subGST = 'IGST'
        }
      } else {
        alert("please enter valid GST number")
      }
    } else {
      this.subGST = 'CGST'
    }

  }

  getLubeDetails(id: any) {
    let data = {
      lubricantsId: id.target.value,
    }
    this.post1.getLubricantByIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data.length) {
            this.cashBillLubricantForm.controls["productName"].setValue(res.data[0].lubricantsName)
            this.cashBillLubricantForm.controls["unit"].setValue(res.data[0].lubricantsUnit)
            this.cashBillLubricantForm.controls["hsnSacNumber"].setValue(res.data[0].lubricantsHsnSacNumber)
            this.unit = res.data[0].lubricantsUnit
          } else {
            this.cashBillLubricantForm.controls["productName"].setValue('')
            this.cashBillLubricantForm.controls["unit"].setValue('')
            this.cashBillLubricantForm.controls["hsnSacNumber"].setValue('')
            this.unit = ''
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
    this.post.getLubricantsPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.lubricantList = res.data;
        }
      })
  }

  gstCalculation1() {
    if (this.cashBillLubricantForm.value.reqCreditAmount) {

      if (this.cashBillLubricantForm.value.taxDetails == 'INCLUDE') {

        this.gstAmount = Number(Number(this.cashBillLubricantForm.value.reqCreditAmount) - (Number(this.cashBillLubricantForm.value.reqCreditAmount) * (100 / (100 + Number(this.cashBillLubricantForm.value.gst))))).toFixed(2)
        // this.cashBillLubricantForm.controls["totalAmount"].setValue(Number(this.cashBillLubricantForm.value.reqCreditAmount))
        // this.cashBillLubricantForm.controls["totalWOGSTAmount"].setValue(Number(this.cashBillLubricantForm.value.reqCreditAmount) - Number(this.gstAmount))

        if (this.subGST == 'CGST') {
          this.cashBillLubricantForm.controls["cgst"].setValue(Number(this.cashBillLubricantForm.value.gst) / 2)
          this.cashBillLubricantForm.controls["igst"].setValue('')
        } else {
          this.cashBillLubricantForm.controls["cgst"].setValue('')
          this.cashBillLubricantForm.controls["igst"].setValue(Number(this.cashBillLubricantForm.value.gst))
        }
      } else {

        this.gstAmount = Number((Number(this.cashBillLubricantForm.value.reqCreditAmount) * Number(this.cashBillLubricantForm.value.gst)) / 100).toFixed(2)
        // this.cashBillLubricantForm.controls["totalAmount"].setValue(Number(this.cashBillLubricantForm.value.reqCreditAmount) + Number(this.gstAmount))
        // this.cashBillLubricantForm.controls["totalWOGSTAmount"].setValue(Number(this.cashBillLubricantForm.value.reqCreditAmount))

        if (this.subGST == 'CGST') {
          this.cashBillLubricantForm.controls["cgst"].setValue(Number(this.cashBillLubricantForm.value.gst) / 2)
          this.cashBillLubricantForm.controls["igst"].setValue('')
        } else {
          this.cashBillLubricantForm.controls["cgst"].setValue('')
          this.cashBillLubricantForm.controls["igst"].setValue(Number(this.cashBillLubricantForm.value.gst))
        }
      }

      if (this.cashBillLubricantForm.value.reqQuantity) {
        this.cashBillLubricantForm.controls["productPrice"].setValue(Number(Number(this.cashBillLubricantForm.value.reqCreditAmount) / Number(this.cashBillLubricantForm.value.reqQuantity)).toFixed(2))
      }

    }
  }


  getGSTDetails() {
    let data = {
    }
    this.post.getGSTDataPOST(data)
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

  getQuantityByPieces() {
    if (this.isQuantityRatio) {
      this.cashBillLubricantForm.controls["reqQuantity"].setValue(Number(this.quantityRatio) * Number(this.quantityInPieces))
    }
  }

  submitLubeCashBill() {
    if (this.cashBillLubricantForm.value.priceDate && this.cashBillLubricantForm.value.productName
      && this.cashBillLubricantForm.value.productPrice && this.cashBillLubricantForm.value.customerName
      && this.cashBillLubricantForm.value.reqQuantity && this.cashBillLubricantForm.value.reqCreditAmount
      && this.cashBillLubricantForm.value.gst && this.cashBillLubricantForm.value.taxDetails && this.subGST) {
      this.spinner.show()
      let data = {
        cashBillCreatedBy: this.createdBy,
        fuelDealerId: this.fuelDealerId,
        cashBillDate: moment(this.cashBillLubricantForm.value.priceDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        cashBillNumber: this.cashBillLubricantForm.value.billNumber,
        cashBillFor: "LUBE",
        cashBillProduct: this.cashBillLubricantForm.value.productName,
        cashBillRate: this.cashBillLubricantForm.value.productPrice,
        cashBillCustName: this.cashBillLubricantForm.value.customerName,
        cashBillCustMobile: this.cashBillLubricantForm.value.customerNumber,
        cashBillVehicleNumber: this.cashBillLubricantForm.value.vehicleNumber,
        cashBillQuantity: this.cashBillLubricantForm.value.reqQuantity,
        cashBillAmount: this.cashBillLubricantForm.value.totalAmount,
        cashBillAmountWOGST: this.cashBillLubricantForm.value.totalWOGSTAmount,
        cashBillGSTAmt: this.gstAmount,
        cashBillCGST: this.cashBillLubricantForm.value.cgst,
        cashBillSGST: this.cashBillLubricantForm.value.cgst,
        cashBillIGST: this.cashBillLubricantForm.value.igst,
        cashBillSubGST: this.subGST,
        cashBillGST: this.cashBillLubricantForm.value.gst,
        cashBillUnit: this.cashBillLubricantForm.value.unit,
        cashBillAddress: this.cashBillLubricantForm.value.address,
        cashBillCustGST: this.cashBillLubricantForm.value.gstNumber,
        lubricantsHsnSacNumber: this.cashBillLubricantForm.value.hsnSacNumber,
      }
      this.post.addCashBillPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.spinner.hide()
            this.goToLubeBillStatement(res.data.insertId)
          } else {
            alert("Error to create bill..!")
            this.spinner.hide()
          }
        })
    } else {
      alert("Please enter details..")
    }
  }

  goToLubeBillStatement(cashBillId: any) {
    this.post1.setRoutingWithType1("lubeBill", cashBillId)
    this.router.navigate(['/credit/cashBillInvoice']);
  }
}
