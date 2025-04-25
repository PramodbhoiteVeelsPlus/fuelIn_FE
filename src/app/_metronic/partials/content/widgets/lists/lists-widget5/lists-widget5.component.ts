import { ChangeDetectorRef, Component, ElementRef, Injectable, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { MixedService } from '../../mixed/mixed.services';
import { StatsService } from '../../stats/stats.services';
import { ListWidgetService } from '../listWidget.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { addShift } from 'src/app/pages/dealer/shift/addShift.model';
import { CreditRequest } from 'src/app/pages/dealer/credit/creditRequest.modal';
import { CreditRequestLube } from 'src/app/pages/dealer/shift/creditRequestLube.model';

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
  @ViewChild("myinput") myInputField: ElementRef;
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

  unitForm = new FormGroup({
    buyPricePerUnit: new FormControl(''),
    product: new FormControl('', [Validators.required]),
    productPriceDate: new FormControl(''),
  });

  digitalUpdate = new FormGroup({
    deviceName: new FormControl('', [Validators.required]),
    digitalTransitionId: new FormControl(),
    digitalTransitionAmount: new FormControl(),
  });

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

  cashUpdate = new FormGroup({
    totalAmount: new FormControl(),
    totalLubeAmount: new FormControl()
  });

  closeRequestForm = new FormGroup({
    creditAmount: new FormControl('', Validators.required),
    creditQuantity: new FormControl('', Validators.required),
    requestTypeClose: new FormControl('', Validators.required),
    manualCrNumber: new FormControl('', Validators.required),
  });

  digitalLubricantForm = new FormGroup({
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
    totalAmount: new FormControl(),
    totalWOGSTAmount: new FormControl(),
    quantityInPieces: new FormControl('', Validators.required),
    deviceName: new FormControl(),
    digitalTransitionId: new FormControl(),
  });

  requestTransporter1 = new FormGroup({
    dealerName: new FormControl(),
    dealerLocation: new FormControl(),
    personName: new FormControl(),
    personPhone1: new FormControl(),
    selectedCorp: new FormControl('', [Validators.required]),
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
    totalAmount: new FormControl(),
    totalWOGSTAmount: new FormControl(),
    quantityInPieces: new FormControl('', Validators.required),
  });

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

  fuelDealerId: any;
  dealerCorporateId: any;
  dealerData: any;
  accessGroup: any;
  selectedDate: string = '';
  allShift: any = [];
  modalRef: any;
  closeResult: string;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  active = 1;
  isADDEDIT: boolean = false;
  isVIEW: boolean = false;
  shiftIdUpdate: any;
  CreditRequestDataArrayUpdate: any = [];
  nozzleDetailsUpdate: any = [];
  shiftTimeId: any;
  shiftTimeDetail: string;
  pumpInfraUpdate: boolean = false;
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
  totalCreditTally: any = 0;
  totalCreditTally1: any;
  totalCashTally: any = 0;
  totalDigitalTally: any = 0;
  expenseAmount: any = 0;
  shortamount: any = 0;
  totalAmount: any = 0;
  expenseAmtDetails: any;
  meterSalesUpdate: string;
  meterSales: any = 0;
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
  entryProduct1: boolean = false;
  entryProduct2: boolean = false;
  entryProduct3: boolean = false;
  entryProduct4: boolean = false;
  entryProduct5: boolean = false;
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
  nozzleDetails: any = [];
  difference: any = 0;
  isPumpNozzle: boolean = false;
  staffDetails: any = [];
  fuelShiftTimeDetails: any = [];
  password: any;
  userId: any;
  modalDeleteShift: any;
  parentValue = '';
  meterSalesDetails: any = [];
  creditSalesProductwise: any = [];
  totalMeterSalesDetails: number;
  productWiseCreditData: any = [];
  totalCreditSalesAmount: number;
  totalCreditWOCNGQuantity: number;
  totalCreditCNGQuantity: number;
  totalCashAmount: any;
  totalCreditAmount: any;
  totalCashLubeDetails: any = [];
  totalCreditLubeDetails: any = [];
  totalDigitalLubeDetails: any = [];
  totalSalesDetails: any = [];
  tallySalesDetails: any = [];
  cashSales: number;
  digitalSales: number;
  creditSales: number;
  totalAmountTally: number;
  shiftWiseData: any = [];
  meterSalesAmount: any = [];
  shiftDetails: any = [];
  cashHandover: any;
  shiftNzDetails: any = [];
  totalNzDetails: any = [];
  totalLubeCash: any = [];
  totalLubeCredit: any = [];
  totalLubeDigital: any = [];
  cashHandOverAmount: number;
  digitalTotalSales: number;
  digitalDetails: any = [];
  digitalLubeData: any = [];
  digitalLubeTotalAmt: any;
  digitalLubeTotalQuantity: any;
  totalCreditSales: number;
  totalCreditPayment: number;
  creditDetails: any = [];
  lubeDetails: any = [];
  advAmtDetails: any = [];
  lubeCashDetails: any = [];
  totalLubeAmt: number;
  totalLubeKgQuantity: number;
  totalLubeLtrQuantity: number;
  totalAdvAmt: number;
  lubeCrDetails: any = [];
  lubeCashTotalAmt: any;
  lubeCashTotalQuan: any;
  lubeCashTotalUnit: any;
  totalLubeQuantityInPiece: number;
  totalLubeCashQuantityInPiece: number;
  creditPaymentDetails: any = [];
  keyPerson: string;
  companyName: any;
  oilCompanyName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  brandName: any;
  todayDate = new Date();
  pumpNzDetails: any = [];
  CreditRequestDataArray: any = [];
  isAddNozzleUpdate: boolean = false;
  CreditRequestUpdate = new addShift();
  countUpdate: number = 1;
  CreditRequestDataArray1Update: any = [];
  arrayCountUpdate: any;
  infraMapIdUpdate: any;
  fuelProductIdUpdate: any;
  id: any;
  i: any;
  isPumpNozzleUpdate: boolean = false;
  productsData: any = [];
  productsList: any = [];
  allProductPriceList: any = [];
  managerVPPersonId: any;
  managerPersonId: any;
  digitalSalesDetails: any = [];
  totalDigitalSales: number;
  totalDigitalLube: any;
  totalCreditSalesByStaff: any = [];
  toatalCreditAmountByStaff: number;
  totalDigitalLubeAmt: any = 0;
  meterSalesTotal: any = 0;
  totalLubeCrAmt: any = 0;
  cashDetails: any = [];
  totalCASHSales: number;
  totalCashHandover: any = 0;
  cashLubeData: any = [];
  totalCashLubeAmt: any = 0;
  digitalLubeDetails: any = [];
  isAddPOSUpdate: boolean = false;
  terminalTypeUpdate: any;
  fuelTerminalDetails: any = [];
  isDigitalSubmit: boolean;
  productPrice: string;
  productPriceDetails: any = [];
  fuelDealerCustomerMapId: any;
  isSelected1: boolean = false;
  mappingPreviousStatus: any;
  dealerName: any;
  personName: string;
  gstNumber: any;
  dealerGSTStateCode: any;
  subGST: string;
  dealerLocation: string;
  lastCRDate: any;
  islastCRDate: boolean = false;
  address1: any;
  address2: any;
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
  viewCorpFlag: any = [];
  allCreditReqByDate: any = [];
  isTable: boolean = false;
  allCreditReqByDate1: any = [];
  isTable1: boolean = false;
  calOutstanding: number;
  isFuelVehicles: boolean = false;
  fuelVehicles: any = [];
  corporateList: any = [];
  unit: any;
  isLubeQuantityRatio: boolean = false;
  quantityLubeRatio: any;
  lubricantList: any = [];
  gstAmount: string;
  gstDetails: any = [];
  isCashHandover: boolean = false;
  isCASHSubmit: boolean = false;
  createdBy: string;
  isCreditSales: boolean = false;
  fuelProductId: any;
  isSelected2: boolean = false;
  productName11: any;
  productInfo: any = [];
  settingRate: any;
  showamount: boolean = false;
  autoManualStatus: string;
  count: any = 1;
  CreditRequest1 = new CreditRequest();
  autoManualNumber: any;
  CreditRequestDataArraySales: any = [];
  combineManualNumber: string;
  CreditRequestDataLube: any = [];
  CreditRequestDataLubeTax: any = [];
  CreditRequestLube = new CreditRequestLube();
  countLube: any = 1;
  autoManualNumberLube: any;
  isVehSelect: boolean;
  vehicleId: any;
  vehicleVPStatus: string;
  indexFuelCr: number;
  isBalance1: boolean = false;
  isCRQUANTITY: boolean = false;
  isQUANTITY: boolean = false;
  fleetStatus: any;
  autoManualNumberLubeTax: any;
  isTable2: boolean;
  autoManualNumberAdvance: any;
  autoManualNumberVehicle: any;
  isQuantityRatio: boolean = false;
  quantityRatio: any;
  isVehSelectLube: boolean = false;
  indexFuelLube: number;
  closeRequestDate = moment(new Date()).format("DD-MM-YYYY");
  cashDetailsUpdate: any = [];
  totalCASHSalesUpdate: number;
  totalCashHandoverUpdate: any;
  totalDigitalSalesUpdate: number;
  digitalSalesDetailsUpdate: any = [];
  differenceUpdate: string;

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
    this.accessGroup = element.accessGroupId;
    this.managerName = element.firstName + ' ' + element.lastName;
    this.userId = element.userId;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.keyPerson = element.firstName + ' ' + element.lastName;
    this.createdBy = element.firstName + ' ' + element.lastName
    
    if (this.accessGroup == '12') {
      var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
      this.companyName = dealerData.companyName
      this.oilCompanyName = dealerData.brandName
      this.brandName = dealerData.brandName
      this.state = dealerData.state
      this.pin = dealerData.pin
      this.city = dealerData.city
      this.phone1 = dealerData.hostPhone
      this.pumpCity = dealerData.city
    }

    if (this.accessGroup == '14') {
      var managerData = JSON.parse(localStorage.getItem('managerData') || '{}');
      this.pumpCity = managerData.city
      this.city = managerData.city
      this.companyName = managerData.companyName
      this.phone1 = managerData.hostPhone
      this.oilCompanyName = managerData.brandName
      this.brandName = managerData.brandName
      this.state = managerData.state
      this.pin = managerData.pin
    }
    if (this.post.setRoute == "Book") {
      this.addShiftForm.controls["date"].setValue(moment(this.post.setDate).format("DD-MM-YYYY"))
      this.requestTransporterLube.controls["estimatedRefuelDate"].setValue(moment(this.post.setDate).format("DD-MM-YYYY"));
      this.requestTransporter.controls["estimatedRefuelDate"].setValue(moment(this.post.setDate).format("DD-MM-YYYY"));
      this.requestTransporter.controls["priceDate"].setValue(moment(this.post.setDate).format("DD-MM-YYYY"));
      this.requestTransporter.controls["priceDate"].setValue(moment(this.post.setDate).format("DD-MM-YYYY"));
      this.cashBillLubricantForm.controls["priceDate"].setValue(moment(this.post.setDate).format("DD-MM-YYYY"));
      this.digitalLubricantForm.controls["priceDate"].setValue(moment(this.post.setDate).format("DD-MM-YYYY"));
    } else {
      this.addShiftForm.controls['date'].setValue(moment(new Date()).format('DD-MM-YYYY'));
      this.requestTransporter.controls["priceDate"].setValue(moment(new Date()).format('DD-MM-YYYY'));
      this.requestTransporterLube.controls["estimatedRefuelDate"].setValue(moment(new Date()).format('DD-MM-YYYY'));
      this.requestTransporter.controls["estimatedRefuelDate"].setValue(moment(new Date()).format('DD-MM-YYYY'));
      this.requestTransporter.controls["priceDate"].setValue(moment(new Date()).format("DD-MM-YYYY"));
      this.cashBillLubricantForm.controls["priceDate"].setValue(moment(new Date()).format("DD-MM-YYYY"));
      this.digitalLubricantForm.controls["priceDate"].setValue(moment(new Date()).format("DD-MM-YYYY"));
    }
    this.digitalLubricantForm.controls["taxDetails"].setValue('INCLUDE')
    this.digitalLubricantForm.controls["gst"].setValue("")
    this.digitalLubricantForm.controls["deviceName"].setValue("")
    this.cashBillLubricantForm.controls["taxDetails"].setValue('INCLUDE')
    this.cashBillLubricantForm.controls["gst"].setValue("")
    this.getAllOngoingShift(this.fuelDealerId);
    this.getAllAttendantsByDid(this.fuelDealerId)
    this.getShiftDetails(this.fuelDealerId)
    this.getPumpNozzleByDealerId(this.fuelDealerId);
    this.getProductsByDealerId1(this.fuelDealerId)
    this.getCorporateMappedListByDealerId(this.fuelDealerId)
    this.getFuelTerminal(this.fuelDealerId)
    this.getLubricants(this.fuelDealerId)
    this.getProductsByDealerId(this.fuelDealerId)
    this.getGSTDetails()
    this.cd.detectChanges()
  }

  getAllOngoingShift(fuelDealerId: any) {
    this.spinner.show()
    this.parentValue = moment(this.addShiftForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
    this.selectedDate = moment(this.addShiftForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
    console.log("parentValue", this.parentValue, this.selectedDate)
    this.requestTransporterLube.controls["estimatedRefuelDate"].setValue(this.addShiftForm.value.date);
    this.requestTransporter.controls["estimatedRefuelDate"].setValue(this.addShiftForm.value.date);
    this.requestTransporter.controls["priceDate"].setValue(this.addShiftForm.value.date);
    this.cashBillLubricantForm.controls["priceDate"].setValue(this.addShiftForm.value.date);
    this.digitalLubricantForm.controls["priceDate"].setValue(this.addShiftForm.value.date);

    const data = {
      dealerId: this.fuelDealerId,
      date: moment(this.addShiftForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),

    };
    this.post.getShiftOngoingDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.allShift = res.data;
          // this.post.setRouting(this.selectedDate)
          // console.log("data1", this.selectedDate)
          // this.router.navigate(['/credit/cashBillInvoice']);
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
    this.shiftReport()
  }

  shiftReport() {
    // this.getAllOngoingShiftForClose(this.fuelDealerId)
    this.getDigitalTotalByDate(this.dealerCorporateId);
    this.getFuelCreditPaymentByDate(this.dealerCorporateId)
    // this.getTotalMeterSalesAndTallyEntery(this.fuelDealerId);
    this.getTallyDetails(this.fuelDealerId);
    this.getFuelCreditByDate(this.fuelDealerId);
    this.getSalesDetailsProductWise(this.fuelDealerId);
    // this.getCRDetailsProductWise(this.fuelDealerId);
    this.getShiftWiseDetails(this.fuelDealerId);
    this.getNzWise(this.fuelDealerId);
    this.getTotalCreditSalesPaymentByDay(this.fuelDealerId);
    this.cd.detectChanges()
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

    this.spinner.show()
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

        // console.log("op", this.operatorName, this.updateShiftForm.value.shiftTimeId, res.data[0].firstName + ' ' + res.data[0].lastName)
        this.getOperatorVPId(this.staffId);
        this.getAllFuelCreditByStaffIdDate(this.staffId)
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


        this.getDigitalEntryDetailsByShiftIdUpdate(this.shiftId);
        this.getCASHDetailsByShiftIdUpdate(this.shiftId);
        this.getTotalTallyUpdate()
        this.spinner.hide()
        this.cd.detectChanges()
      } else {
        this.spinner.hide()
        this.cd.detectChanges()
      }
    });

    this.getDigitalEntryDetailsByShiftId(idfuelShiftDetails)
    this.getCASHDetailsByShiftId(idfuelShiftDetails)
    //  // this.getLubeCashBillByShiftId(idfuelShiftDetails)
    this.getDigitalLubeByShiftId(idfuelShiftDetails)
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
        this.spinner.hide()
      }
    });
  }

  getOperatorVPId(fuelDealerStaffId: any) {
    this.spinner.show()
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
        this.cd.detectChanges()
      } else {
        alert(
          'Sorry..Something going wrong.. Please Refresh page or Re-Login..'
        );
        this.spinner.hide();
        this.cd.detectChanges()
      }
    });
  }

  startShift() {
    if (this.accessGroup == 12) {
      this.spinner.show()
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
        this.spinner.show()
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
    this.spinner.show()
    const data = {
      shiftId: idfuelShiftDetails,
    };
    this.post.getInfraDetailsByShiftIdPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.data1.length) {
          this.nozzleCount = res.data1[0].nozzleCount;
          this.meterSales = Number(res.data1[0].meterSales).toFixed(2);
          this.spinner.hide()
          // this.getDifference();
        }
      }
    });
  }

  getAllAttendantsByDid(fuelDealerId: any) {
    this.spinner.show()
    const data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getAllAttendantsByDidPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.staffDetails = res.data;
        this.spinner.hide()
        this.cd.detectChanges()
      } else {
        this.spinner.hide()
        this.cd.detectChanges()
      }
    });
  }

  getShiftDetails(fuelDealerId: any) {
    this.spinner.show()
    this.fuelShiftTimeDetails.length = 0;
    let data = {
      fuelShiftTimeDealerId: fuelDealerId
    }

    this.post.getFuelShiftTimeDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.fuelShiftTimeDetails = res.data;
            this.spinner.hide()
            this.cd.detectChanges()
          } else {
            this.fuelShiftTimeDetails.length = 0;
            this.spinner.hide()
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
      this.spinner.show()
      let data = {
        shiftId: this.shiftId,
      }
      this.post.deleteShiftByShiftIdNEWPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("Shift Deleted successfully..!")
            this.modalDeleteShift.close('close')
            this.getAllOngoingShift(this.fuelDealerId);
            this.spinner.hide()
            this.cd.detectChanges()
          } else {
            this.spinner.hide()
            alert("Error to Delete..")
            this.cd.detectChanges()
          }
        });
    } else {
      alert("Error to Delete..")
    }
  }

  closeModal() {
    this.modalDeleteShift.close('close')
  }

  getSalesDetailsProductWise(fuelDealerId: any) {
    this.spinner.show()
    this.meterSalesDetails = [];
    this.creditSalesProductwise = []
    this.totalMeterSalesDetails = 0
    this.productWiseCreditData = []
    this.totalCreditSalesAmount = 0
    this.totalCreditWOCNGQuantity = 0
    this.totalCreditCNGQuantity = 0

    let data = {
      fuelDealerId: fuelDealerId,
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      corporateId: this.dealerCorporateId,
      date1: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post.getMETERSALESTotalDSRPOST(data)
      .subscribe((res) => {
        if (res.status == "OK") {
          this.meterSalesDetails = res.data;
          // this.totalMeterSalesDetails = res.data1 [0].meterSaleAmount;
          this.totalMeterSalesDetails = res.data1[0].meterSaleAmount + res.data7[0].totalCashAmount + res.data8[0].totalCreditAmount + res.data9[0].totalDigitalSales;
          this.creditSalesProductwise = res.data2
          if (res.data5.length) {
            this.totalCashAmount = res.data5[0].totalCashAmount
          }
          if (res.data6.length) {
            this.totalCreditAmount = res.data6[0].totalCreditAmount
          }
          this.totalCashLubeDetails = res.data5
          this.totalCreditLubeDetails = res.data6
          this.totalDigitalLubeDetails = res.data10
          this.totalCreditSalesAmount = Number(res.data3[0].totalCreditSales) + Number(res.data4[0].totalCreditSales)
          this.totalCreditWOCNGQuantity = Number(res.data3[0].totalCreditQuantity)
          this.totalCreditCNGQuantity = Number(res.data4[0].totalCreditQuantity)

          this.meterSalesDetails.map((shift: { fuelProductId: string; productName: string; meterSaleAmount: number; meterSaleQuantity: number; totalPumpTesting: number; }) => {
            const shiftDataJSON = {
              fuelProductId: '',
              productName: '',
              meterSaleQuantity: 0,
              meterSaleAmount: 0,
              totalCreditSales: 0,
              totalCreditQuantity: 0,
              creditSaleShare: 0,
              creditQuantityShare: 0,
              totalPumpTesting: 0,
            };

            shiftDataJSON.fuelProductId = shift.fuelProductId;
            shiftDataJSON.productName = shift.productName;
            shiftDataJSON.meterSaleAmount = shift.meterSaleAmount;
            shiftDataJSON.meterSaleQuantity = shift.meterSaleQuantity;
            shiftDataJSON.totalPumpTesting = shift.totalPumpTesting;

            this.creditSalesProductwise.map((credit: { fuelProdId: string; totalCreditQuantity: number; totalCreditSales: number; }) => {
              if (credit.fuelProdId == shift.fuelProductId) {
                shiftDataJSON.totalCreditQuantity = credit.totalCreditQuantity;
                shiftDataJSON.totalCreditSales = credit.totalCreditSales;
                shiftDataJSON.creditQuantityShare = Number(credit.totalCreditQuantity) / Number(shift.meterSaleQuantity);
                shiftDataJSON.creditSaleShare = Number(credit.totalCreditSales) / Number(shift.meterSaleAmount);
              }
            })
            this.productWiseCreditData.push(shiftDataJSON);
          })
          this.cd.detectChanges()
          this.spinner.hide()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getTallyDetails(fuelDealerId: any) {
    this.spinner.show()
    this.tallySalesDetails = [];
    this.totalSalesDetails = []
    this.cashSales = 0
    this.digitalSales = 0
    this.creditSales = 0
    this.totalAmountTally = 0
    const data = {
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      date1: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
      corporateId: this.dealerCorporateId,
    };
    this.post.getShiftVStallyByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {

          this.tallySalesDetails = res.data;
          this.totalSalesDetails = res.data1;
          this.totalAmountTally = res.data1[0].totalAmountTally;
          this.cashSales = Number(res.data1[0].cashTallyAmt) - Number(res.data1[0].expenseAmt) - Number(res.data1[0].shortAmt)
          this.digitalSales = res.data1[0].paytmTotal
          this.creditSales = res.data1[0].creditTally

          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getShiftWiseDetails(fuelDealerId: any) {
    this.spinner.show()
    this.shiftWiseData.length = 0;
    this.meterSalesAmount = [];
    this.shiftDetails = []
    const data = {
      dealerId: fuelDealerId,
      startDate: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'), //startDate,
      endDate: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post.getShiftWiseBookDetailsPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.meterSalesAmount = res.data;
        this.shiftDetails = res.data1;

        this.shiftDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; totalCashTally: number; paytmTotalAmount: number; totalCreditTally: number; expenseAmount: number; shortamount: number; totalAmountTally: number; fuelShiftTimeShiftName: string; fuelShiftTimeDetails: string; expenseAmtDetails: string; }) => {
          const dataPAYJson = {
            openDate: '',
            name: '',
            meterSaleAmount: 0,
            cash: 0,
            digital: 0,
            credit: 0,
            expenses: 0,
            short: 0,
            shiftTally: 0,
            shiftTime: '',
            differnece: 0,
            cashHandOver: 0,
            expenseAmtDetails: ''
          };

          dataPAYJson.openDate = moment(shift.openDate).format("YYYY-MM-DD");
          dataPAYJson.name = shift.firstName + ' ' + shift.lastName;
          // dataPAYJson.cash = shift.totalCashTally;
          // dataPAYJson.digital = shift.paytmTotalAmount;
          // dataPAYJson.credit = shift.totalCreditTally;
          if(typeof shift.totalCreditTally === 'number' && !isNaN(shift.totalCreditTally)){
            dataPAYJson.credit = shift.totalCreditTally;
          } else {
            dataPAYJson.credit = 0
          }
          
          if(typeof shift.paytmTotalAmount === 'number' && !isNaN(shift.paytmTotalAmount)){
            dataPAYJson.digital = shift.paytmTotalAmount;
          } else {
            dataPAYJson.digital = 0;
          }

          if(typeof shift.totalCashTally === 'number' && !isNaN(shift.totalCashTally)){
            dataPAYJson.cash = shift.totalCashTally;
          } else {
            dataPAYJson.cash = 0;
          }

          if(typeof shift.totalAmountTally === 'number' && !isNaN(shift.totalAmountTally)){
            dataPAYJson.shiftTally = shift.totalAmountTally;
          } else {
            dataPAYJson.shiftTally = 0;
          }

          dataPAYJson.expenses = shift.expenseAmount;
          dataPAYJson.short = shift.shortamount;
          // dataPAYJson.shiftTally = shift.totalAmountTally;
          if(typeof shift.totalAmountTally === 'number' && !isNaN(shift.totalAmountTally)){
            dataPAYJson.meterSaleAmount = shift.totalAmountTally;
          } else {
            dataPAYJson.meterSaleAmount = 0;
          }
          dataPAYJson.differnece = dataPAYJson.shiftTally - dataPAYJson.meterSaleAmount;
          if (shift.fuelShiftTimeShiftName != '') {
            dataPAYJson.shiftTime = shift.fuelShiftTimeShiftName;
          } else {
            dataPAYJson.shiftTime = shift.fuelShiftTimeDetails;
          }
          dataPAYJson.cashHandOver = Number(shift.totalCashTally) - Number(shift.shortamount) - Number(shift.expenseAmount);
          dataPAYJson.expenseAmtDetails = shift.expenseAmtDetails

          //   this.meterSalesAmount.map(sales => {
          //     if (sales.fuelShiftDetailsId == shift.idfuelShiftDetails) {
          //         dataPAYJson.meterSaleAmount = sales.meterSaleAmount;
          //         dataPAYJson.differnece = Number(shift.totalAmountTally);
          //     }
          // })

          this.shiftWiseData.push(dataPAYJson);
          // console.log("shiftWiseData", this.shiftWiseData)
        })

        this.cashHandover = this.shiftWiseData.cashHandOver
        this.spinner.hide()
        this.cd.detectChanges()
      } else {
        this.spinner.hide()
        this.cd.detectChanges()
      }
    });
  }

  getCASHDetailsByShiftIdUpdate(fuelShiftDetailsId: any) {
    this.spinner.show()
    this.cashDetailsUpdate.length = 0
    this.totalCASHSalesUpdate = 0
    let data = {
      shiftId: fuelShiftDetailsId,
    }
    this.post.getCASHHandoverByShiftSQLPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.cashDetailsUpdate = res.data;
          this.totalCASHSalesUpdate = res.data1[0].totalAmount
          this.totalCashHandoverUpdate = res.data1[0].totalAmount

          this.getShortUpdate()

          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }

      })
  }

  getShortUpdate() {
    if ((Number(this.totalCashTallyUpdate) - Number(this.totalCashHandoverUpdate) - Number(this.expenseAmountUpdate)) > 0) {
      this.shortamountUpdate = Number(Number(this.totalCashTallyUpdate) - Number(this.totalCashHandoverUpdate) - Number(this.expenseAmountUpdate)).toFixed(2);
      this.getExpense1Update()
    } else {
      this.shortamount = 0
    }
  }

  getExpense1Update() {
    if ((Number(this.totalCashTallyUpdate) - Number(this.totalCashHandoverUpdate) - Number(this.expenseAmountUpdate)) > 0) {
      this.expenseAmountUpdate = Number(Number(this.totalCashTallyUpdate) - Number(this.totalCashHandoverUpdate) - Number(this.shortamountUpdate)).toFixed(2);
    } else {
      this.expenseAmountUpdate = 0
    }
  }

  getNzWise(fuelDealerId: any) {
    this.spinner.show()
    this.shiftNzDetails = []
    this.totalNzDetails = []
    const data = {
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      fuelDealerId: fuelDealerId,
      corporateId: this.dealerCorporateId,
    };
    this.post.getProductWiseDSRPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.shiftNzDetails = res.data
          this.totalNzDetails = res.data1
          this.totalLubeCash = res.data3
          this.totalLubeCredit = res.data4
          this.totalLubeDigital = res.data5
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getDigitalTotalByDate(dealerCorporateId: any) {
    this.spinner.show()
    // this.digitalDetails.length = 0
    this.digitalTotalSales = 0
    this.cashHandOverAmount = 0
    const data = {
      corporateId: dealerCorporateId,
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post.getDigitalTotalByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.digitalDetails = res.data;
          this.digitalTotalSales = res.data1[0].digitalEntry
          this.cashHandOverAmount = res.data2[0].totalAmount
          this.digitalLubeData = res.data3;
          this.digitalLubeTotalAmt = res.data4[0].totalAmount;
          this.digitalLubeTotalQuantity = res.data4[0].totalQuantity;
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getTotalCreditSalesPaymentByDay(fuelDealerId: any) {
    this.spinner.show()
    this.totalCreditSales = 0
    this.totalCreditPayment = 0
    const data = {
      fuelDealerId: fuelDealerId,
      corporateId: this.dealerCorporateId,
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post.getTotalCreditSalesPaymentByDayPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.totalCreditSales = res.data[0].totalCreditSales
          this.totalCreditPayment = res.data1[0].totalCreditPayment
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getFuelCreditByDate(fuelDealerId: any) {
    this.spinner.show()
    this.creditDetails = []
    this.lubeDetails = []
    this.advAmtDetails = []
    this.lubeCashDetails = []
    this.totalLubeAmt = 0
    this.totalLubeKgQuantity = 0
    this.totalLubeLtrQuantity = 0
    this.totalAdvAmt = 0
    const data = {
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
    };
    this.post.getFuelCreditByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.creditDetails = res.data2;
          this.lubeDetails = res.data3;
          this.advAmtDetails = res.data4;
          this.lubeCashDetails = res.data9;
          this.lubeCrDetails = res.data11;
          this.lubeCashTotalAmt = res.data10[0].cashBillAmount
          this.lubeCashTotalQuan = res.data10[0].cashBillQuantity
          this.lubeCashTotalUnit = res.data10[0].cashBillUnit
          this.totalLubeAmt = Number(res.data5[0].totalLubeAmt) + Number(res.data7[0].totalLubeAmt);
          this.totalLubeQuantityInPiece = Number(res.data8[0].quantityInPieces);
          this.totalLubeKgQuantity = res.data5[0].totalQuantity
          this.totalLubeLtrQuantity = res.data7[0].totalQuantity
          this.totalAdvAmt = Number(res.data6[0].totalAdvAmt)
          this.totalLubeCashQuantityInPiece = Number(res.data10[0].quantityInPiece);
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }


  getFuelCreditPaymentByDate(dealerCorporateId: any) {
    this.spinner.show()
    // this.creditPaymentDetails.length = 0
    const data = {
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      corporateId: dealerCorporateId,
    };
    this.post.getFuelCreditPaymentByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.creditPaymentDetails = res.data;
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  shiftReportPage() {
    this.post.setNavigate(moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'), 'Book')
    this.router.navigate(['/shift/shiftReport']);
  }

  updateShiftTimeUpdate(id: any) {
    this.spinner.show()
    let data = {
      shiftTimeId: id.target.value,
      shiftId: this.shiftIdUpdate,
    }
    this.post.updateShiftTimePOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.spinner.hide()
      } else {
        alert("Error to update Shift Time")
        this.spinner.hide()
      }
    })
  }
  getPumpNozzleByDealerId(fuelDealerId: any) {
    const data = {
      dealerId: fuelDealerId,
    };
    this.post.getPumpNozzleByDealerIdPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.pumpNzDetails = res.data;
      } else {
      }
    });
  }

  getMeterSales(i: number) {
    this.CreditRequestDataArray[i].meterSalesLtr = Number(
      this.CreditRequestDataArray[i].closingMeterReading -
      this.CreditRequestDataArray[i].openingMeterReading
    ).toFixed(2);
    this.CreditRequestDataArray[i].meterSalesRs = Number(
      this.CreditRequestDataArray[i].meterSalesLtr *
      this.CreditRequestDataArray[i].rate
    ).toFixed(2);
    this.CreditRequestDataArray[i].pumpTesting = 0

    this.isPumpNozzle = true;
  }

  getMeterSalesUpdate(i: number) {
    this.CreditRequestDataArrayUpdate[i].meterSaleQuantity = Number(
      this.CreditRequestDataArrayUpdate[i].closingReading -
      this.CreditRequestDataArrayUpdate[i].openMeter -
      this.CreditRequestDataArrayUpdate[i].pumpTesting
    ).toFixed(2);
    this.CreditRequestDataArrayUpdate[i].meterSaleAmount = Number(
      this.CreditRequestDataArrayUpdate[i].meterSaleQuantity *
      this.CreditRequestDataArrayUpdate[i].fuelPrice
    ).toFixed(2);
  }

  getMeterSales1Update(i: number) {
    if (Number(this.CreditRequestDataArrayUpdate[i].closingReading) >= Number(this.CreditRequestDataArrayUpdate[i].openMeter)) {
      this.CreditRequestDataArrayUpdate[i].meterSaleQuantity = Number(
        this.CreditRequestDataArrayUpdate[i].closingReading -
        this.CreditRequestDataArrayUpdate[i].openMeter -
        this.CreditRequestDataArrayUpdate[i].pumpTesting
      ).toFixed(2);
      this.CreditRequestDataArrayUpdate[i].meterSaleAmount = Number(
        this.CreditRequestDataArrayUpdate[i].meterSaleQuantity *
        this.CreditRequestDataArrayUpdate[i].fuelPrice
      ).toFixed(2);
      if (Number(this.CreditRequestDataArrayUpdate[i].meterSaleQuantity) < 0) {
        alert("Please enter Valid Details..")

      }
    } else {
      alert("Please Enter Valid Closing Meter Reading..")

    }
  }

  updateInfra(id: any, i: number) {
    if (Number(this.CreditRequestDataArrayUpdate[i].closingReading) >= Number(this.CreditRequestDataArrayUpdate[i].openMeter)) {
      if (Number(this.CreditRequestDataArrayUpdate[i].meterSaleQuantity) >= 0) {
        const data = {
          shiftInfraId: id,
          openMeter: this.CreditRequestDataArrayUpdate[i].openMeter,
          closingReading: this.CreditRequestDataArrayUpdate[i].closingReading,
          pumpTesting: this.CreditRequestDataArrayUpdate[i].pumpTesting,
          meterSaleQuantity: this.CreditRequestDataArrayUpdate[i].meterSaleQuantity,
          meterSaleAmount: this.CreditRequestDataArrayUpdate[i].meterSaleAmount,
          rate: this.CreditRequestDataArrayUpdate[i].fuelPrice,
        };
        this.post.updateShiftInfraDetailsPOST(data)
          .subscribe((res) => {
            if (res.status == 'OK') {
              alert("Updated successfully..!")
              this.getShiftDetailsByShiftIdUpdate(this.shiftIdUpdate, 'EDIT')
            } else {
              alert("Error to Update..!")
            }
          });
      }
      else {
        alert("Please Enter Valid Reading Details..!")
      }
    } else {
      alert("Please Enter Valid Closing Meter Reading..")
    }
  }

  deleteNzEntryURLUpdate(id: any, fuelShiftDetailsId: any) {
    const data = {
      shiftInfraId: id,
      shiftId: fuelShiftDetailsId,
    };
    this.post.deleteNzEntryPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        alert("Nozzle Entry Delete Successfully..")
        this.getShiftDetailsByShiftIdUpdate(this.shiftIdUpdate, 'EDIT')
      }
    });
  }

  addNozzleUpdate() {
    this.addFormRequestUpdate();
    this.isAddNozzleUpdate = true;
    this.cd.detectChanges()
  }

  addFormRequestUpdate() {
    // console.log('12121212111121');
    // console.log( this.countUpdate);
    this.countUpdate = this.countUpdate + 1;
    if (this.countUpdate < 12) {
      this.CreditRequestUpdate = new addShift();
      this.CreditRequestDataArray1Update.push(this.CreditRequestUpdate);
      if (this.CreditRequestDataArray1Update[0].pumpNozzle) {
        if (this.CreditRequestDataArray1Update.length) {
          this.arrayCountUpdate = this.CreditRequestDataArray1Update.length;
        }
      }

      // console.log(this.CreditRequestDataArray1Update);
    } else {
      this.countUpdate = 11;
      alert(
        'Please save 10 entries, before adding more entries(max entries allowed per submit is currently capped at 10)'
      );
    }
  }

  getProductByInfraMapIdUpdate(id: any, i: number, setFuelPrice: any) {
    if (this.shiftIdUpdate) {
      this.spinner.show()

      this.infraMapIdUpdate = id.target.value;
      const data = {
        infraMapId: id.target.value,
        date: moment(this.updateShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
        dealerId: this.fuelDealerId,
      };
      this.post.getProductByInfraMapIdPOST(data).subscribe((res) => {
        if (res.status == 'OK') {
          if (res.data.length) {
            this.CreditRequestDataArray1Update[i].product =
              res.data[0].productName;
            this.fuelProductIdUpdate = res.data[0].fuelProductId;
            this.CreditRequestDataArray1Update[i].productId =
              res.data[0].fuelProductId;
            this.CreditRequestDataArray1Update[i].rateDetails = res.data;
            this.CreditRequestDataArray1Update[i].rate =
              res.data[0].productSellingPrice;
            if (res.data1.length) {
              if ((res.data1[0].endDate) <= moment(this.updateShiftForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD")) {
                this.CreditRequestDataArray1Update[i].openingMeterReading =
                  res.data1[0].closingReading;
                this.spinner.hide()
                this.cd.detectChanges()
              } else {
                this.CreditRequestDataArray1Update[i].openingMeterReading = ''
                this.spinner.hide()
                this.cd.detectChanges()
              }

            } else {
              this.CreditRequestDataArray1Update[i].openingMeterReading = ''
              this.spinner.hide()
              this.cd.detectChanges()
            }


          } else {
            this.spinner.hide()
            alert("Please Set Rate First..")
            this.unitForm.controls["productPriceDate"].setValue(moment(this.updateShiftForm.value.date, ['DD-MM-YYYY']).format('DD-MM-YYYY'))
            // this.opensetFuelPrice(id.target.value,i,setFuelPrice)
          }
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
    } else {
      this.spinner.hide()
      this.cd.detectChanges()
    }
  }

  opensetFuelPrice(id: any, i: any, setFuelPrice: any) {
    this.id = id
    this.i = i
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

  setRateUpdate(id: any, i: number) {
    this.CreditRequestDataArray1Update[i].rate = id.target.value;
  }

  getMeterSalesAdd(i: number) {
    this.CreditRequestDataArray1Update[i].meterSalesLtr = Number(
      this.CreditRequestDataArray1Update[i].closingMeterReading -
      this.CreditRequestDataArray1Update[i].openingMeterReading
    ).toFixed(2);
    this.CreditRequestDataArray1Update[i].meterSalesRs = Number(
      this.CreditRequestDataArray1Update[i].meterSalesLtr *
      this.CreditRequestDataArray1Update[i].rate
    ).toFixed(2);
    this.CreditRequestDataArray1Update[i].pumpTesting = 0
    this.isPumpNozzleUpdate = true;

  }

  getMeterSales1Add(i: number) {
    if (Number(this.CreditRequestDataArray1Update[i].closingMeterReading) >= Number(this.CreditRequestDataArray1Update[i].openingMeterReading)) {
      this.CreditRequestDataArray1Update[i].meterSalesLtr = Number(
        this.CreditRequestDataArray1Update[i].closingMeterReading -
        this.CreditRequestDataArray1Update[i].openingMeterReading -
        this.CreditRequestDataArray1Update[i].pumpTesting
      ).toFixed(2);
      this.CreditRequestDataArray1Update[i].meterSalesRs = Number(
        this.CreditRequestDataArray1Update[i].meterSalesLtr *
        this.CreditRequestDataArray1Update[i].rate
      ).toFixed(2);
      this.isPumpNozzleUpdate = true;
    } else {
      alert("Please Enter Valid Closing Meter Reading..")
      this.CreditRequestDataArray1Update[i].closingMeterReading = 0
      this.CreditRequestDataArray1Update[i].pumpTesting = 0
      this.CreditRequestDataArray1Update[i].meterSalesLtr = 0
      this.CreditRequestDataArray1Update[i].meterSalesRs = 0
      this.isPumpNozzleUpdate = false;
    }
  }

  addFormRequest1Update(i: number) {
    if (Number(this.CreditRequestDataArray1Update[i].closingMeterReading) > 0 &&
      Number(this.CreditRequestDataArray1Update[i].openingMeterReading) >= 0 && Number(this.CreditRequestDataArray1Update[i].pumpTesting) >= 0 &&
      Number(this.CreditRequestDataArray1Update[i].meterSalesRs) >= 0 && Number(this.CreditRequestDataArray1Update[i].meterSalesLtr) >= 0) {

      this.countUpdate = this.countUpdate + 1;
      if (this.countUpdate < 12) {
        this.CreditRequestUpdate = new addShift();
        this.isPumpNozzleUpdate = false;
        this.CreditRequestDataArray1Update.push(this.CreditRequestUpdate);
        if (this.CreditRequestDataArray1Update[0].pumpNozzle) {
          if (this.CreditRequestDataArray1Update.length) {
            this.arrayCountUpdate = this.CreditRequestDataArray1Update.length;
          }
        }

        //  console.log(this.CreditRequestDataArray1Update);
      } else {
        this.countUpdate = 11;
        alert(
          'Please save 10 entries, before adding more entries(max entries allowed per submit is currently capped at 10)'
        );
      }
    } else {
      alert("Please Enter Valid Reading..")
      this.isPumpNozzleUpdate = false;
    }
  }

  removeFormRequestUpdate(i: number) {
    this.CreditRequestDataArray1Update.splice(i, 1);
    this.countUpdate = this.countUpdate - 1;
    // console.log('COUNT:', this.countUpdate);        
  }

  getProductsByDealerId1(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getFuelProductIdByDealerIdPOST(data).subscribe(res => {
      if (res) {
        this.productsData = res;
        this.productsList = res.data;
        this.allProductPriceList = res.data;
        this.getProductDetails(res.data);
      }
    })
  }

  getProductDetails(data: { fuelProductsId: string; }[]) {
    data.forEach((element: { fuelProductsId: string; }) => {

      let json = {
        fuelProductId: "",
        productSellingPrice: "",

      };
      json.fuelProductId = element.fuelProductsId;
      json.productSellingPrice = "";
    });
  }

  addFuelPrice() {
    if (this.accessGroup == 12 || this.accessGroup == 19) {
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
            this.modalRef.close('close');
            this.spinner.hide();
            this.getProductByInfraMapIdUpdate1(this.id, this.i)
            this.getProductsByDealerId1(this.fuelDealerId);
          } else {
            alert("Getting Error!");
            this.spinner.hide();
          }

        })
    }
    else {
      if (this.accessGroup == 14 || this.accessGroup == 21) {
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
              this.modalRef.close('close');
              this.getProductByInfraMapIdUpdate1(this.id, this.i)
              this.spinner.hide();
              this.getProductsByDealerId1(this.fuelDealerId);
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

  getProductByInfraMapIdUpdate1(id: any, i: string | number) {
    if (this.shiftIdUpdate) {

      this.infraMapIdUpdate = id;
      const data = {
        infraMapId: id,
        date: moment(this.updateShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
        dealerId: this.fuelDealerId,
      };
      this.post.getProductByInfraMapIdPOST(data).subscribe((res) => {
        if (res.status == 'OK') {
          if (res.data.length) {
            this.CreditRequestDataArray1Update[i].product =
              res.data[0].productName;
            this.fuelProductIdUpdate = res.data[0].fuelProductId;
            this.CreditRequestDataArray1Update[i].productId =
              res.data[0].fuelProductId;
            this.CreditRequestDataArray1Update[i].rateDetails = res.data;
            this.CreditRequestDataArray1Update[i].rate =
              res.data[0].productSellingPrice;
            if (res.data1.length) {
              if ((res.data1[0].endDate) <= moment(this.updateShiftForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD")) {
                this.CreditRequestDataArray1Update[i].openingMeterReading =
                  res.data1[0].closingReading;
              } else {
                this.CreditRequestDataArray1Update[i].openingMeterReading = ''
              }

            } else {
              this.CreditRequestDataArray1Update[i].openingMeterReading = ''
            }


          } else {

          }
        } else {
        }
      });
    } else {

    }
  }

  submitShiftDetailsUpdate() {
    this.spinner.show();

    if (this.shiftIdUpdate) {
      if (this.CreditRequestDataArray1Update[0].pumpNozzle) {

        const data = {
          nozzelDetail: this.CreditRequestDataArray1Update,
          fuelDealerId: this.fuelDealerId,
          fuelShiftDetailsId: this.shiftIdUpdate,
          startTime: moment(new Date()).format('HH:mm:ss'),
          startDate: moment(this.updateShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
          endTime: moment(new Date()).format('HH:mm:ss'),
          endDate: moment(this.updateShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
        };
        this.post.addNozzelForShiftPOST(data).subscribe((res) => {
          if (res.status == 'OK') {
            alert('Nozzle Data added successfully...');
            this.pumpInfraUpdate = false
            this.getShiftDetailsByShiftIdUpdate(this.shiftIdUpdate, 'EDIT');
            this.CreditRequestDataArray1Update.length = 0;
            this.isPumpNozzleUpdate = false;
            this.isAddNozzleUpdate = false;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            alert('Error to submit. Please Re-Login..');
            this.spinner.hide();
            this.cd.detectChanges()
          }
        });
      } else {
        alert("Please Select Nozzle First..!")
        this.spinner.hide();
        this.cd.detectChanges()
      }
    } else {
      this.spinner.hide();
      this.cd.detectChanges()
    }
  }

  clearModalUpdate() {
    this.CreditRequestDataArray1Update.length = 0;
    this.isPumpNozzleUpdate = false;
    this.isAddNozzleUpdate = false;
  }

  getDigitalEntryDetailsByShiftId(fuelShiftDetailsId: any) {
    this.digitalSalesDetails.length = 0
    this.totalDigitalSales = 0
    let data = {
      shiftId: fuelShiftDetailsId,
    }
    this.post.getDigitalSalesByShiftPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.digitalSalesDetails = res.data;
          this.totalDigitalSales = res.data1[0].totalDigitalSales
          this.totalDigitalLube = res.data4[0].totalDigitalLube
          this.totalDigitalTally = this.totalDigitalSales + this.totalDigitalLube
          this.getTotalTally()
          this.getDifference()
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
        }

      })
  }

  getTotalTally() {
    this.totalAmount = (Number(this.totalCashTally) + Number(this.totalDigitalTally)
      + Number(this.totalCreditTally)).toFixed(2);
      console.log("totalAmount", this.totalAmount, '=', Number(this.totalCashTally), '+', Number(this.totalDigitalTally),
     '+', Number(this.totalCreditTally))
    this.getDifference()

  }

  getDifference() {
    this.difference = Number(Number(this.totalAmount) - Number(this.meterSalesTotal)).toFixed(2)
    this.getShort()
    this.getExpense()
  }

  getExpense() {
    if ((Number(this.totalCashTally) - Number(this.totalCashHandover) - Number(this.expenseAmount)) > 0) {
      this.expenseAmount = Number(Number(this.totalCashTally) - Number(this.totalCashHandover) - Number(this.shortamount)).toFixed(2);
      this.getShort1()
      this.cd.detectChanges()
    } else {
      this.expenseAmount = 0
      this.cd.detectChanges()
    }

  }

  getShort() {
    if ((Number(this.totalCashTally) - Number(this.totalCashHandover) - Number(this.expenseAmount)) > 0) {
      this.shortamount = Number(Number(this.totalCashTally) - Number(this.totalCashHandover) - Number(this.expenseAmount)).toFixed(2);
      this.getExpense1()
      this.cd.detectChanges()
    } else {
      this.shortamount = 0
      this.cd.detectChanges()
    }
  }


  getShort1() {
    if ((Number(this.totalCashTally) - Number(this.totalCashHandover) - Number(this.expenseAmount)) > 0) {
      this.shortamount = Number(Number(this.totalCashTally) - Number(this.totalCashHandover) - Number(this.expenseAmount)).toFixed(2);

      this.cd.detectChanges()
    } else {
      this.shortamount = 0
      this.cd.detectChanges()
    }
  }

  getExpense1() {
    if ((Number(this.totalCashTally) - Number(this.totalCashHandover) - Number(this.expenseAmount)) > 0) {
      this.expenseAmount = Number(Number(this.totalCashTally) - Number(this.totalCashHandover) - Number(this.shortamount)).toFixed(2);

      this.cd.detectChanges()
    } else {
      this.expenseAmount = 0
      this.cd.detectChanges()
    }

  }

  getCASHDetailsByShiftId(fuelShiftDetailsId: any) {
    this.cashDetails.length = 0
    this.totalCASHSales = 0
    let data = {
      shiftId: fuelShiftDetailsId,
    }
    this.post.getCASHHandoverByShiftSQLPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.cashDetails = res.data;
          this.totalCASHSales = res.data1[0].totalAmount
          this.totalCashHandover = res.data1[0].totalAmount + res.data3[0].totalLubeCash
          this.cashLubeData = res.data2;
          this.totalCashLubeAmt = res.data3[0].totalLubeCash
          // this.meterSalesTotal = (Number(this.meterSales) + Number(this.totalCashLubeAmt)+ Number(this.totalLubeCrAmt)).toFixed(2)
          // console.log("ms",this.meterSalesTotal,  this.meterSales , this.totalCashLubeAmt, this.totalLubeCrAmt)
          this.getShort()
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }

      })
  }

  getAllFuelCreditByStaffIdDate(staffId: any) {
    this.totalCreditSalesByStaff = [];
    this.toatalCreditAmountByStaff = 0;
    this.spinner.show()
    const data = {
      fuelDealerStaffId: staffId,
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      fuelShiftId: this.shiftIdUpdate
    };
    this.post.getAllFuelCreditByStaffIdDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.totalCreditSalesByStaff = res.data;
          this.toatalCreditAmountByStaff = res.data1[0].toatalCreditAmount;
          this.totalLubeCrAmt = res.data2[0].toatalCreditAmount
          this.totalDigitalLubeAmt = res.data3[0].totalDigitalLube;
          this.meterSalesTotal = (Number(this.meterSales) + Number(this.totalCashLubeAmt) + Number(this.totalLubeCrAmt) + Number(this.totalDigitalLubeAmt)).toFixed(2)
          console.log("ms1", this.meterSalesTotal, this.meterSales, this.totalCashLubeAmt, this.totalLubeCrAmt, this.totalDigitalLubeAmt)
          // console.log("lubeCr", this.totalLubeCrAmt)
          this.getTotalTally();
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });

  }

  cancelPayment(id: any) {
    this.spinner.show();

    let data = {
      accountTransacLogId: id,
    }
    this.post.removeTransactionLogPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert("Delete Successfully!");
          this.getDigitalEntryDetailsByShiftId(this.shiftIdUpdate);
          this.getCASHDetailsByShiftId(this.shiftIdUpdate);
          this.getDigitalLubeByShiftId(this.shiftIdUpdate)
          this.getAllFuelCreditByStaffIdDate(this.staffId);
        } else {
          alert("Error to delete")
          this.getDigitalEntryDetailsByShiftId(this.shiftIdUpdate);
          this.getCASHDetailsByShiftId(this.shiftIdUpdate);
          this.getDigitalLubeByShiftId(this.shiftIdUpdate)
          this.spinner.hide();
        }
      })
  }

  getDigitalLubeByShiftId(fuelShiftDetailsId: any) {
    let data = {
      fuelShiftId: fuelShiftDetailsId,
    }
    this.post.getDigitalLubePOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.digitalLubeDetails = res.data;
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      })
  }

  updatePayment(accountTransacLogId: any, terminalName: any, transacId: any, paytmTotalAmount: any) {
    let data = {
      accountTransacLogId: accountTransacLogId,
      terminalName: terminalName,
      transacId: transacId,
      paytmTotalAmount: paytmTotalAmount
    }

    this.post.updateShiftPOSDigitalPaymentPOST(data)
      .subscribe(res => {
        alert(res.msg)
        this.getDigitalEntryDetailsByShiftId(this.shiftIdUpdate);
      })
  }

  addPOSUpdate() {
    this.isAddPOSUpdate = true;
  }

  getTerminalTypeFromTerminalIdUpdate(id: any) {
    // console.log(id.target.value)
    let data = {
      fuelTerminalsId: id.target.value,
    }
    this.post.getTerminalTypeFromTerminalIdPOST(data)
      .subscribe(res => {
        this.terminalTypeUpdate = res.data[0].terminalType

      })

  }

  getFuelTerminal(fuelDealerId: any) {
    let dataTerminal = {
      fuelDealerId: fuelDealerId
    }
    this.post.getFuelTerminal1POST(dataTerminal)
      .subscribe(res => {
        if (res.data.length) {
          this.fuelTerminalDetails = res.data;
        } else {

        }
      })
  }

  submitDigitalTotalUpdate() {
    this.spinner.show()
    if (this.digitalUpdate.value.deviceName) {
      if (this.digitalUpdate.value.digitalTransitionAmount) {
        this.isDigitalSubmit = true;
        let data = {
          corporateId: this.dealerCorporateId,
          transacDate: moment(this.updateShiftForm.value.date, ['DD-MM-YYYY',]).format('YYYY-MM-DD'),
          fuelDealerStaffId: this.staffId,
          terminalId: this.digitalUpdate.value.deviceName,
          transactionId: this.digitalUpdate.value.digitalTransitionId,
          paytmTotalAmount: this.digitalUpdate.value.digitalTransitionAmount,
          grandTotalAmount: this.digitalUpdate.value.digitalTransitionAmount,
          shiftId: this.shiftIdUpdate,
          managerName: this.managerName,
        }
        this.post.submitDigitalSalesDetailsPOST(data)
          .subscribe(res => {
            this.digitalUpdate.reset();
            this.digitalUpdate.controls['deviceName'].setValue('');
            this.isDigitalSubmit = false
            this.getDigitalEntryDetailsByShiftId(this.shiftIdUpdate);

          })

      } else {
        alert("Please Enter Amount..!")
        this.spinner.hide()

      }
    } else {
      alert("Please Select Device..!")
      this.spinner.hide()
    }

  }

  logValue() {
    // console.log(this.addMoreCharges);
    this.requestTransporter.controls["productName"].setValue("")
    this.requestTransporter.controls["productPrice"].setValue("")
    this.productName1 = '';
    this.productPrice = '';
    this.productPriceDetails.length = 0;
  }

  getDetailsByfuelDealerCustomerMapIdId(id: any) {
    // console.log("fuelDealerCustomerMapId:-" + id.target.value)
    console.log("id.target.value", id.target.value)
    if (id.target.value) {
      this.fuelDealerCustomerMapId = id.target.value;
      this.getCorporateInfoByfuelDealerCustomerMapId(this.fuelDealerCustomerMapId);
    } else {
      alert("Please select customer")
      this.cashBillLubricantForm.controls["gstNumber"].setValue('')
      this.cashBillLubricantForm.controls["address"].setValue('')
      this.cashBillLubricantForm.controls["customerNumber"].setValue('')
      this.digitalLubricantForm.controls["gstNumber"].setValue('')
      this.digitalLubricantForm.controls["address"].setValue('')
      this.digitalLubricantForm.controls["customerNumber"].setValue('')
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
          this.fuelDealerCustomerMapId = res.data[0].fuelDealerCustomerMapId;
          if (res.data[0].mappingPreviousStatus == "FALSE") {
            this.dealerName = res.data[0].companyName;
            this.personName = res.data[0].firstName + ' ' + res.data[0].lastName;
            this.gstNumber = res.data[0].GSTNumber;
            this.cashBillLubricantForm.controls["customerName"].setValue(res.data[0].companyName)
            this.cashBillLubricantForm.controls["gstNumber"].setValue(res.data[0].GSTNumber)
            this.digitalLubricantForm.controls["gstNumber"].setValue(res.data[0].GSTNumber)
            this.digitalLubricantForm.controls["customerNumber"].setValue(res.data[0].companyName)
            if (res.data[0].GSTNumber) {
              if (res.data[0].GSTNumber != 'undefined' || res.data[0].GSTNumber != 'null') {
                this.checkGST()
              }
            }
            this.checkGST()
          } else {
            this.dealerName = res.data[0].mappingCompanyName;
            this.personName = res.data[0].mappingCustomerName;
            this.gstNumber = res.data[0].mappingGST;
            this.checkGST()
            this.cashBillLubricantForm.controls["customerName"].setValue(res.data[0].mappingCompanyName)
            this.cashBillLubricantForm.controls["gstNumber"].setValue(res.data[0].mappingGST)
            this.digitalLubricantForm.controls["customerName"].setValue(res.data[0].mappingCompanyName)
            this.digitalLubricantForm.controls["gstNumber"].setValue(res.data[0].mappingGST)
            if (res.data[0].mappingGST) {
              if (res.data[0].mappingGST != 'undefined' || res.data[0].mappingGST != 'null') {
                this.checkGST()
              }
            }
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
          console.log("add",this.address1 + this.address2 + this.city + this.state + this.pin)
          this.cashBillLubricantForm.controls["address"].setValue(this.address1 + this.address2 + this.city + this.state + this.pin)
          this.cashBillLubricantForm.controls["customerNumber"].setValue(res.data[0].phone1)
          this.digitalLubricantForm.controls["address"].setValue(this.address1 + this.address2 + this.city + this.state + this.pin)
          this.digitalLubricantForm.controls["customerNumber"].setValue(res.data[0].phone1)

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
          this.getFuelCreditRequestByfuelDealerIdByDate(this.fuelDealerSQLId, this.fuelDealerCorpMapIdNew)
          this.getLubeByfuelDealerIdByDate(this.fuelDealerSQLId, this.fuelDealerCorpMapIdNew)
          this.calOutstandingAmountforAll(this.fuelDealerCorpMapIdNew);
          this.getFuelVehicleByMapId(this.fuelDealerCorpMapIdNew);
          this.requestTransporter1.controls["dealerName"].setValue(res.data[0].companyName);
          this.requestTransporter1.controls["dealerLocation"].setValue(res.data[0].cityArea + ',' + res.data[0].city);
          this.requestTransporter1.controls["personName"].setValue(res.data[0].firstName + ' ' + res.data[0].lastName);
          this.requestTransporter1.controls["personPhone1"].setValue(res.data[0].phone1);
          this.personId = res.data[0].personId;
        } else { }
      });
  }

  checkGST() {
    if (this.gstNumber) {
      if (this.dealerGSTStateCode == (this.gstNumber.toString()).slice(0, 2)) {
        this.subGST = 'CGST'
      } else {
        this.subGST = 'IGST'
      }
    } else {
      this.subGST = 'CGST'
    }
    console.log("f", this.subGST)
  }

  getFlagStatusByCorpId(corporateIdForFlag: any) {
    let data = {
      corporateIdForFlag: corporateIdForFlag
    }
    this.post1.getFlagStatusByCorpIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.viewCorpFlag = res.data

        } else {
        }
      });
  }

  getFuelCreditRequestByfuelDealerIdByDate(fuelDealerId: any, fuelDealerCustomerMapId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
      fuelDealerCustomerMapId: fuelDealerCustomerMapId,
      date: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
    }
    this.post.getFuelCreditRequestByfuelDealerIdByDatePOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.allCreditReqByDate = res.data;
          this.isTable = true;
        } else {
        }
      });
  }

  getLubeByfuelDealerIdByDate(fuelDealerId: any, fuelDealerCustomerMapId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
      fuelDealerCustomerMapId: fuelDealerCustomerMapId,
      date: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
    }
    this.post.getLubeTransactionByfuelDealerIdByDatePOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.allCreditReqByDate1 = res.data;
          this.isTable1 = true;
        } else {
        }
      });
  }

  calOutstandingAmountforAll(fuelDealerCustomerMapId: any) {
    let data = {
      fuelDealerCustomerMapId: fuelDealerCustomerMapId
    }
    this.post.calOutstandingAmountforAllPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.calOutstanding = (Number(res.outstandData[0].totalCRAmt) - Number(res.discountData[0].totalDiscountAmt) - Number(res.paymentData[0].totalPaymentAmt) + Number(res.previousOutstandData[0].previousOutstand))
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
        } else {
          this.isFuelVehicles = false;
          this.spinner.hide();
        }
      });
  }

  getCorporateMappedListByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getCorporatesAllMappedRequestByDealerPOST(data)
      .subscribe(res => {
        if (res) {
          this.corporateList = res.data;
          this.cd.detectChanges()
        } else {
        }
      });
  }

  getCashLubeDetails(id: any) {
    let data = {
      lubricantsId: id.target.value,
    }
    this.post.getLubricantByIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data.length) {
            this.cashBillLubricantForm.controls["productName"].setValue(res.data[0].lubricantsName)
            this.cashBillLubricantForm.controls["unit"].setValue(res.data[0].lubricantsUnit)
            this.cashBillLubricantForm.controls["hsnSacNumber"].setValue(res.data[0].lubricantsHsnSacNumber)
            this.digitalLubricantForm.controls["productName"].setValue(res.data[0].lubricantsName)
            this.digitalLubricantForm.controls["unit"].setValue(res.data[0].lubricantsUnit)
            this.digitalLubricantForm.controls["hsnSacNumber"].setValue(res.data[0].lubricantsHsnSacNumber)
            this.unit = res.data[0].lubricantsUnit
          } else {
            this.cashBillLubricantForm.controls["productName"].setValue('')
            this.cashBillLubricantForm.controls["unit"].setValue('')
            this.cashBillLubricantForm.controls["hsnSacNumber"].setValue('')
            this.digitalLubricantForm.controls["productName"].setValue(res.data[0].lubricantsName)
            this.digitalLubricantForm.controls["unit"].setValue(res.data[0].lubricantsUnit)
            this.digitalLubricantForm.controls["hsnSacNumber"].setValue(res.data[0].lubricantsHsnSacNumber)
            this.unit = ''
          }

          if (res.data1.length) {
            this.isLubeQuantityRatio = true;
            this.quantityLubeRatio = res.data1[0].quantityRatio;
          } else {
            this.isLubeQuantityRatio = false;
          }

        }
      })
  }

  getLubricants(fuelDealerSQLId: any) {
    let data = {
      fuelDealerId: fuelDealerSQLId
    }
    this.post2.getLubricantsPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.lubricantList = res.data;
        }
      })
  }

  gstLubeCalculation() {
    if (this.cashBillLubricantForm.value.reqCreditAmount) {

      if (this.cashBillLubricantForm.value.taxDetails == 'INCLUDE') {

        this.gstAmount = Number(Number(this.cashBillLubricantForm.value.reqCreditAmount) - (Number(this.cashBillLubricantForm.value.reqCreditAmount) * (100 / (100 + Number(this.cashBillLubricantForm.value.gst))))).toFixed(2)
        this.cashBillLubricantForm.controls["totalAmount"].setValue(Number(this.cashBillLubricantForm.value.reqCreditAmount))
        this.cashBillLubricantForm.controls["totalWOGSTAmount"].setValue(Number(this.cashBillLubricantForm.value.reqCreditAmount) - Number(this.gstAmount))

        if (this.subGST == 'CGST') {
          this.cashBillLubricantForm.controls["cgst"].setValue(Number(this.cashBillLubricantForm.value.gst) / 2)
          this.cashBillLubricantForm.controls["igst"].setValue('')
        } else {
          this.cashBillLubricantForm.controls["cgst"].setValue('')
          this.cashBillLubricantForm.controls["igst"].setValue(Number(this.cashBillLubricantForm.value.gst))
        }
      } else {

        this.gstAmount = Number((Number(this.cashBillLubricantForm.value.reqCreditAmount) * Number(this.cashBillLubricantForm.value.gst)) / 100).toFixed(2)
        this.cashBillLubricantForm.controls["totalAmount"].setValue(Number(this.cashBillLubricantForm.value.reqCreditAmount) + Number(this.gstAmount))
        this.cashBillLubricantForm.controls["totalWOGSTAmount"].setValue(Number(this.cashBillLubricantForm.value.reqCreditAmount))

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
    console.log("subGST", this.subGST)
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

  gstDigitalCalculation() {
    if (this.digitalLubricantForm.value.reqCreditAmount) {

      if (this.digitalLubricantForm.value.taxDetails == 'INCLUDE') {

        this.gstAmount = Number(Number(this.digitalLubricantForm.value.reqCreditAmount) - (Number(this.digitalLubricantForm.value.reqCreditAmount) * (100 / (100 + Number(this.digitalLubricantForm.value.gst))))).toFixed(2)
        this.digitalLubricantForm.controls["totalAmount"].setValue(Number(this.digitalLubricantForm.value.reqCreditAmount))
        this.digitalLubricantForm.controls["totalWOGSTAmount"].setValue(Number(this.digitalLubricantForm.value.reqCreditAmount) - Number(this.gstAmount))

        if (this.subGST == 'CGST') {
          this.digitalLubricantForm.controls["cgst"].setValue(Number(this.digitalLubricantForm.value.gst) / 2)
          this.digitalLubricantForm.controls["igst"].setValue('')
        } else {
          this.digitalLubricantForm.controls["cgst"].setValue('')
          this.digitalLubricantForm.controls["igst"].setValue(Number(this.digitalLubricantForm.value.gst))
        }
      } else {

        this.gstAmount = Number((Number(this.digitalLubricantForm.value.reqCreditAmount) * Number(this.digitalLubricantForm.value.gst)) / 100).toFixed(2)
        this.digitalLubricantForm.controls["totalAmount"].setValue(Number(this.digitalLubricantForm.value.reqCreditAmount) + Number(this.gstAmount))
        this.digitalLubricantForm.controls["totalWOGSTAmount"].setValue(Number(this.digitalLubricantForm.value.reqCreditAmount))

        if (this.subGST == 'CGST') {
          this.digitalLubricantForm.controls["cgst"].setValue(Number(this.digitalLubricantForm.value.gst) / 2)
          this.digitalLubricantForm.controls["igst"].setValue('')
        } else {
          this.digitalLubricantForm.controls["cgst"].setValue('')
          this.digitalLubricantForm.controls["igst"].setValue(Number(this.digitalLubricantForm.value.gst))
        }
      }

      if (this.digitalLubricantForm.value.reqQuantity) {
        this.digitalLubricantForm.controls["productPrice"].setValue(Number(Number(this.digitalLubricantForm.value.reqCreditAmount) / Number(this.cashBillLubricantForm.value.reqQuantity)).toFixed(2))
      }

    }
    console.log("subGST", this.subGST)
  }

  getQuantityByPiecesDigitalLube() {
    if (this.isLubeQuantityRatio) {
      this.digitalLubricantForm.controls["reqQuantity"].setValue((Number(this.quantityLubeRatio) * Number(this.digitalLubricantForm.value.quantityInPieces)).toFixed(2))
    }
  }

  submitLubeDigital() {
    if (this.digitalLubricantForm.value.productName && this.digitalLubricantForm.value.gst && this.digitalLubricantForm.value.deviceName &&
      this.digitalLubricantForm.value.totalAmount && this.digitalLubricantForm.value.reqQuantity && this.digitalLubricantForm.value.quantityInPieces
    ) {
      this.spinner.show()
      let data = {
        corporateId: this.dealerCorporateId,
        transacDate: moment(this.digitalLubricantForm.value.priceDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        fuelDealerStaffId: this.staffId,
        terminalId: this.digitalLubricantForm.value.deviceName,
        transactionId: this.digitalLubricantForm.value.digitalTransitionId,
        paytmTotalAmount: this.digitalLubricantForm.value.totalAmount,
        grandTotalAmount: this.digitalLubricantForm.value.totalAmount,
        shiftId: this.shiftIdUpdate,
        managerName: this.managerName,
        transactionPurpose: "SHIFT",
        fuelDealerCustomerMapId: this.fuelDealerCustomerMapId,
        paymentByType: "DIGITAL-LUBETAX",
        totalPayment: this.digitalLubricantForm.value.totalAmount,
        entryFROM: "PORTAL",
        idfuelCreditVehicle: this.digitalLubricantForm.value.vehicleNumber,
        paymentCust: this.digitalLubricantForm.value.customerName,
        paymentCustAddress: this.digitalLubricantForm.value.address,
        PaymentCustGST: this.digitalLubricantForm.value.gstNumber,
        PaymentProduct: this.digitalLubricantForm.value.productName,
        paymentProdUnit: this.digitalLubricantForm.value.unit,
        PaymentTax: this.digitalLubricantForm.value.gst,
        paymentTaxDetails: this.digitalLubricantForm.value.taxDetails,
        paymentIGST: this.digitalLubricantForm.value.igst,
        PaymentSGST: this.digitalLubricantForm.value.cgst,
        paymentCGST: this.digitalLubricantForm.value.cgst,
        paymentActualAmount: this.digitalLubricantForm.value.totalWOGSTAmount,
        paymentQuantity: this.digitalLubricantForm.value.reqQuantity,
        paymentQuantityInPieces: this.digitalLubricantForm.value.quantityInPieces,
        paymentCustMobile: this.digitalLubricantForm.value.customerNumber,
        paymentManualNumber: this.digitalLubricantForm.value.billNumber,
      }

      this.post.submitDigitalLubeDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            alert(res.msg)
            this.closeModalLubeDigital()
            this.isAddPOSUpdate = false;
            this.getDigitalLubeByShiftId(this.shiftIdUpdate)
            this.getAllFuelCreditByStaffIdDate(this.staffId);
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            alert(res.msg)
            this.closeModalLubeDigital()
            this.spinner.hide()
            this.cd.detectChanges()
          }
        })
    } else {
      alert("Please Enter required details...!")
    }
  }

  closeModalLubeDigital() {
    this.digitalLubricantForm.controls["priceDate"].setValue(this.addShiftForm.value.date);
    this.digitalLubricantForm.controls["billNumber"].setValue('');
    this.digitalLubricantForm.controls["customerName"].setValue('');
    this.digitalLubricantForm.controls["gstNumber"].setValue('');
    this.digitalLubricantForm.controls["address"].setValue('');
    this.digitalLubricantForm.controls["customerNumber"].setValue('');
    this.digitalLubricantForm.controls["vehicleNumber"].setValue('');
    this.digitalLubricantForm.controls["lubeId"].setValue('');
    this.digitalLubricantForm.controls["hsnSacNumber"].setValue('');
    this.digitalLubricantForm.controls["gst"].setValue('');
    this.digitalLubricantForm.controls["taxDetails"].setValue('');
    this.digitalLubricantForm.controls["reqCreditAmount"].setValue('');
    this.digitalLubricantForm.controls["quantityInPieces"].setValue('');
    this.digitalLubricantForm.controls["reqQuantity"].setValue('');
  }

  updatePaymentCashHandOver(accountTransacLogId: any, grandTotalAmount: any) {
    let data = {
      accountTransacLogId: accountTransacLogId,
      grandTotalAmount: grandTotalAmount,
    }

    this.post.updateShiftPOSDigitalPaymentPOST(data)
      .subscribe(res => {
        alert(res.msg)
        this.getCASHDetailsByShiftId(this.shiftIdUpdate);

      })
  }

  addCashHandoverUpdate() {
    this.isCashHandover = true;
  }

  deleteCashBill(id: any) {
    this.spinner.show()
    let data = {
      cashBillId: id,
    }
    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteCashBillPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("cash Lube delete successfully..")
            this.totalCashTally = ''
            // this.totalCashHandover = ''
            this.expenseAmount = ''
            this.expenseAmtDetails = ''
            this.shortamount = ''
            this.spinner.hide()
          } else {
            this.spinner.hide()
          }
        })
    }
    else {
      this.spinner.hide()
    }

  }

  submitCashHandoverUpdate() {
    this.spinner.show()

    if (this.cashUpdate.value.totalAmount) {
      this.isCASHSubmit = true
      let data = {
        corporateId: this.dealerCorporateId,
        transacDate: moment(this.updateShiftForm.value.date, ['DD-MM-YYYY',]).format('YYYY-MM-DD' + ' 01:01:01'),
        fuelDealerStaffId: this.staffId,
        grandTotalAmount: this.cashUpdate.value.totalAmount,
        shiftId: this.shiftIdUpdate,
        cashAmount: this.cashUpdate.value.totalAmount,
        reqFromDevice: 'PORTAL',
      }
      this.post.submitCashSalesDetailsPOST(data)
        .subscribe(res => {
          this.getCASHDetailsByShiftId(this.shiftIdUpdate);
          this.cashUpdate.reset();
        })

    } else {
      alert("Please Enter Amount..!")
      this.spinner.hide()

    }
  }

  getQuantityByPiecesLube() {
    if (this.isLubeQuantityRatio) {
      this.cashBillLubricantForm.controls["reqQuantity"].setValue((Number(this.quantityLubeRatio) * Number(this.cashBillLubricantForm.value.quantityInPieces)).toFixed(2))
    }
  }

  submitLubeCashBill() {
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
      cashBillShiftId: this.shiftIdUpdate,
      cashBillTaxDetails: this.cashBillLubricantForm.value.taxDetails,
      quantityInPiece: this.cashBillLubricantForm.value.quantityInPieces
    }

    this.post.addLubeTaxCashBillPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
          this.closeModalLubeCash()
          this.isCashHandover = false;
          this.getCASHDetailsByShiftId(this.shiftIdUpdate)
          this.getAllFuelCreditByStaffIdDate(this.staffId);
          this.spinner.hide();
        } else {
          alert(res.msg)
          this.closeModalLubeCash()
          this.spinner.hide()
        }
      })

  }

  closeModalLubeCash() {
    this.cashBillLubricantForm.controls["priceDate"].setValue(this.addShiftForm.value.date);
    this.cashBillLubricantForm.controls["billNumber"].setValue('');
    this.cashBillLubricantForm.controls["customerName"].setValue('');
    this.cashBillLubricantForm.controls["gstNumber"].setValue('');
    this.cashBillLubricantForm.controls["address"].setValue('');
    this.cashBillLubricantForm.controls["customerNumber"].setValue('');
    this.cashBillLubricantForm.controls["vehicleNumber"].setValue('');
    this.cashBillLubricantForm.controls["lubeId"].setValue('');
    this.cashBillLubricantForm.controls["hsnSacNumber"].setValue('');
    this.cashBillLubricantForm.controls["gst"].setValue('');
    this.cashBillLubricantForm.controls["taxDetails"].setValue('');
    this.cashBillLubricantForm.controls["reqCreditAmount"].setValue('');
    this.cashBillLubricantForm.controls["quantityInPieces"].setValue('');
    this.cashBillLubricantForm.controls["reqQuantity"].setValue('');
  }

  addCreditSales() {
    if (this.isCreditSales) {
      this.isCreditSales = false;
    } else {
      this.isCreditSales = true;
      this.addFormRequestSales();
      this.addFormRequestLube();
    }
  }

  getPrice(id: any) {

    if (this.requestTransporter.value.priceDate) {
      this.productPriceDetails.length = 0;
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
            this.requestTransporter.controls["productName1"].setValue(res.data[0].productCategory + '-' + res.data[0].productName);
            this.requestTransporter.controls["estimatedRefuelDate"].setValue(this.requestTransporter.value.priceDate);

            this.productName1 = res.data[0].productName;
            this.productName11 = res.data[0].productCategory;
            this.productPrice = res.data[0].productSellingPrice;
          } else {
            alert("Please Set Fuel Price first for Selected Date..!")
            this.unitForm.controls["productPriceDate"].setValue(this.requestTransporter.value.priceDate)

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
            this.productName1 = res.data[0].productName;
            this.productName11 = res.data[0].productCategory;
            this.productPrice = res.data[0].productSellingPrice;
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
        this.cd.detectChanges()
      }
    })
  }

  setPrice(id: any) {
    this.settingRate = id.target.value;
    this.requestTransporter.controls["productPrice"].setValue(this.settingRate);
    this.productPrice = this.settingRate;
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

  addFormRequestSales() {
    if (this.autoManualStatus == 'TRUE') {
      this.count = this.count + 1;

      this.CreditRequest1 = new CreditRequest();
      this.CreditRequest1.manualNumber = this.autoManualNumber
      this.CreditRequestDataArraySales.push(this.CreditRequest1);
    } else {
      this.count = this.count + 1;
      if (this.count < 12) {
        this.CreditRequest1 = new CreditRequest();
        this.CreditRequestDataArraySales.push(this.CreditRequest1);
      }
      else {
        this.count = 11;
        alert("Please save 10 credit entries, before adding more credit entries for a customer (max entries allowed per submit is currently capped at 5)")
      }
    }

  }

  setManualNumber(i: string | number) {
    if (Number(this.CreditRequest1.manualNumber) >= Number(this.rangeFrom) && Number(this.CreditRequest1.manualNumber) <= Number(this.rangeTo) || Number(this.rangeTo) == 0) {
      if (Number(this.rangeTo) == 0) {
        this.requestTransporter.controls["manualCrNumber"].setValue(this.CreditRequest1.manualNumber)
        this.checkManualNumRangeForNotAssign(this.CreditRequest1.manualNumber, i, 'CREDIT')
      } else {
        this.requestTransporter.controls["manualCrNumber"].setValue(this.CreditRequest1.manualNumber)
        this.checkBillManualNumber(this.CreditRequest1.manualNumber, i)
      }
    } else {
      if (this.autoManualStatus == 'TRUE') {
        this.requestTransporter.controls["manualCrNumber"].setValue(this.CreditRequest1.manualNumber)
      } else {
        alert('manual number exceed limit!')
        this.CreditRequestDataArraySales[i].manualNumber = '';
        this.requestTransporter.controls["manualCrNumber"].setValue('')

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
          this.requestTransporterLubeTax.controls["manualCrNumber"].setValue('')
          this.requestTransporter.controls["manualCrNumber"].setValue('')
          if (this.CreditRequestDataArraySales.length) {
            this.CreditRequestDataArraySales[i].manualNumber = '';
          }
          if (this.CreditRequestDataLube.length) {
            this.CreditRequestDataLube[i].manualNumberLube = '';
          }
          if (this.CreditRequestDataLubeTax.length) {
            this.CreditRequestDataLubeTax[i].manualNumberLube = '';
          }
        } else {
          if (purpose == 'CREDIT') {
            this.checkBillManualNumber(this.CreditRequest1.manualNumber, i)
          }
          if (purpose == 'LUBE') {
            this.checkBillnameLube(this.CreditRequestLube.manualNumberLube, i)
          }

        }
      })
  }

  addFormRequestLube() {
    if (this.autoManualStatus == 'TRUE') {
      this.countLube = this.countLube + 1;
      this.CreditRequestLube = new CreditRequestLube();
      this.CreditRequestLube.manualNumberLube = this.autoManualNumberLube
      this.CreditRequestDataLube.push(this.CreditRequestLube);
      // console.log(this.CreditRequestDataLube);
    } else {
      this.countLube = this.countLube + 1;
      if (this.countLube < 12) {
        this.CreditRequestLube = new CreditRequestLube();
        this.CreditRequestDataLube.push(this.CreditRequestLube);
      }
      else {
        this.count = 11;
        alert("Please save 10 credit entries, before adding more credit entries for a customer (max entries allowed per submit is currently capped at 5)")
      }
    }
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
          this.CreditRequestDataArraySales[i].manualNumber = '';
          this.requestTransporter.controls["manualCrNumber"].setValue('')
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

  setVehicleNumber(i: number) {
    this.requestTransporter.controls["vehicleNumber"].setValue(this.CreditRequest1.vehicleNumber)
    if (this.autoManualStatus == 'TRUE') {
      this.requestTransporter.controls["manualCrNumber"].setValue(this.CreditRequest1.manualNumber)
    }
    this.submitSearchVehicle(i)
  }

  submitSearchVehicle(i: number) {
    this.spinner.show();
    if (this.requestTransporter.value.vehicleNumber) {
      this.isVehSelect = true;
      const data = {
        vehicleRegistrationNumber: this.CreditRequestDataArraySales[i].vehicleNumber,
      };
      this.post.VehicleByRegistrationNumberPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.CreditRequestDataArraySales[i].vehicleId = res.data[0].vehicleId
            this.CreditRequestDataArraySales[i].vehicleVPStatus = 'TRUE'
            this.vehicleId = res.data[0].vehicleId;
            this.vehicleVPStatus = 'TRUE';
            this.spinner.hide();
          } else {
            this.spinner.hide();
            this.vehicleVPStatus = 'FALSE';
            this.CreditRequestDataArraySales[i].vehicleVPStatus = 'FALSE';
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
      if (this.CreditRequestDataArraySales[i].creditAmount) {
        if (this.CreditRequestDataArraySales[i].creditAmount > 0) {
          this.CreditRequestDataArraySales[i].creditQuantity = Number((this.CreditRequestDataArraySales[i].creditAmount) / (this.requestTransporter.value.productPrice)).toFixed(2)
          this.requestTransporter.controls["reqQuantity"].setValue(this.CreditRequestDataArraySales[i].creditQuantity)
          this.requestTransporter.controls["reqCreditAmount"].setValue(this.CreditRequestDataArraySales[i].creditAmount)
          this.requestTransporter.controls["actualCreditQuantity"].setValue(this.CreditRequestDataArraySales[i].creditQuantity)
          this.requestTransporter.controls["actualCreditAmount"].setValue(this.CreditRequestDataArraySales[i].creditAmount)
          // console.log("BYAmount")
        } else {
        }

      } else {
        //console.log("BYQunatity")
      }
    } else {
      alert("Please Select product Price")
    }
  }

  quantityCalculateNEW(i: number) {
    if (this.requestTransporter.value.productPrice) {
      if (this.CreditRequestDataArraySales[i].creditQuantity) {
        if (this.CreditRequestDataArraySales[i].creditQuantity > 0) {
          this.CreditRequestDataArraySales[i].creditAmount = Number((this.requestTransporter.value.productPrice) * (this.CreditRequestDataArraySales[i].creditQuantity)).toFixed(2)
          this.requestTransporter.controls["reqQuantity"].setValue(this.CreditRequestDataArraySales[i].creditQuantity)
          this.requestTransporter.controls["reqCreditAmount"].setValue((this.CreditRequestDataArraySales[i].creditAmount))
          this.requestTransporter.controls["actualCreditQuantity"].setValue(this.CreditRequestDataArraySales[i].creditQuantity)
          this.requestTransporter.controls["actualCreditAmount"].setValue(this.CreditRequestDataArraySales[i].creditAmount)
          // console.log("BYQunatity")
        } else {
          this.CreditRequestDataArraySales[i].creditQuantity = ''

        }
      }
    } else {
      alert("Please Select product Price")
    }

  }

  removeFormRequestSales(i: number, removeTable: any) {
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

  submitByDealerNEW1() {
    if (this.requestTransporter.value.estimatedRefuelDate) {
      if (this.requestTransporter.value.actualCreditAmount || this.requestTransporter.value.actualCreditQuantity) {
        if (this.fuelDealerCorpMapIdNew) {
          if (this.requestTransporter.value.productName) {
            if (this.requestTransporter.value.reqQuantity) {
              if (this.operatorPersonID) {
                if (this.requestTransporter.value.manualCrNumber) {
                  this.spinner.show()
                  let data = {
                    crDetails: this.CreditRequestDataArraySales,
                    fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                    reqQuantity: this.requestTransporter.value.reqQuantity,
                    reqCreditAmount: this.requestTransporter.value.reqCreditAmount,
                    estimatedRefuelDate: moment(this.requestTransporter.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                    fuelDealerId: this.fuelDealerSQLId,
                    vehicleId: this.vehicleId,
                    driverId: this.operatorPersonID,
                    fleetNoFleetStatus: this.fleetStatus,
                    fuelProductId: this.requestTransporter.value.productName,
                    fuelCorporateId: this.dealerCorporateId,
                    creditSource: "DEALER",
                    PANno: this.PANno,
                    transDateTime: moment(this.requestTransporter.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                    transactionTime: moment(this.todayDate, ["DD-MM-YYYY"]).format('hh:mm:ss'),
                    creditAmount: this.requestTransporter.value.actualCreditAmount,
                    transactionStatus: 'COMPLETE',
                    fuelDealerStaffId: this.staffId,
                    actualCreditQuantity: this.requestTransporter.value.actualCreditQuantity,
                    createdAt: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                    productRate: this.requestTransporter.value.productPrice,
                    vehicleNumber: this.requestTransporter.value.vehicleNumber,
                    vehicleVPStatus: this.vehicleVPStatus,
                    manualCrNumber: this.requestTransporter.value.manualCrNumber,
                    managerVPPersonId: this.operatorVPID,
                    managerPersonId: this.operatorPersonID,
                    managerName: this.operatorNAME,
                    isMappingSMS: this.smsMappingStatus,
                    isMappingEmail: this.emailMappingStatus,
                    fuelShiftId: this.shiftIdUpdate,
                  }
                  this.post.addCreditSalesByOperatorPOST(data)
                    .subscribe(res => {
                      if (res.status == "OK") {
                        this.myInputField.nativeElement.focus();
                        alert("Credit Added Sccessfully!");
                        this.getFuelCreditByDate(this.fuelDealerId);
                        this.getAllFuelCreditByStaffIdDate(this.staffId);
                        this.isBalance1 = false;
                        this.spinner.hide();
                        if (this.autoManualStatus == 'TRUE') {
                          this.updateAssignedAutoManualNumber('CREDIT', res.count)
                          this.isCRQUANTITY = false;
                          this.isQUANTITY = false;
                          this.CreditRequestDataArraySales = [];
                          this.count = 1;
                          this.requestTransporter.controls["requestType"].setValue("AMOUNT");
                          this.requestTransporter.controls["requestTypeCR"].setValue("AMOUNT");
                          this.closeRequestForm.controls["requestTypeClose"].setValue("AMOUNT");
                          this.checkDates(this.fuelDealerCorpMapIdNew, moment(this.requestTransporter.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                          this.requestTransporter.controls["manualCrNumber"].setValue("");
                          this.requestTransporter.controls["actualCreditQuantity"].setValue("");
                          this.requestTransporter.controls["actualCreditAmount"].setValue("");
                          this.requestTransporter.controls["reqCreditAmount"].setValue("");
                          this.requestTransporter.controls["reqQuantity"].setValue("");
                          this.requestTransporter.controls["vehicleNumber"].setValue("");
                        } else {

                          this.isCRQUANTITY = false;
                          this.isQUANTITY = false;
                          this.CreditRequestDataArraySales = [];
                          this.count = 1;
                          this.requestTransporter.controls["requestType"].setValue("AMOUNT");
                          this.requestTransporter.controls["requestTypeCR"].setValue("AMOUNT");
                          this.closeRequestForm.controls["requestTypeClose"].setValue("AMOUNT");
                          this.addFormRequestSales();
                          this.checkDates(this.fuelDealerCorpMapIdNew, moment(this.requestTransporter.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                          this.requestTransporter.controls["manualCrNumber"].setValue("");
                          this.requestTransporter.controls["actualCreditQuantity"].setValue("");
                          this.requestTransporter.controls["actualCreditAmount"].setValue("");
                          this.requestTransporter.controls["reqCreditAmount"].setValue("");
                          this.requestTransporter.controls["reqQuantity"].setValue("");
                          this.requestTransporter.controls["vehicleNumber"].setValue("");
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
                alert("Error to Submit!")
                this.spinner.hide();
              }
            } else {
              alert("Please Enter Quantity!")
              this.spinner.hide();
            }
          } else {
            alert("Please Select Product!")
            this.spinner.hide();
          }
        } else {
          alert("Please Select Transporter!")
          this.spinner.hide();
        }
      } else {
        alert("Please Enter Amount or Quantity!")
        this.spinner.hide();
      }
    } else {
      alert("Please Select Date!")
      this.spinner.hide();
    }

  }

  updateAssignedAutoManualNumber(status: string, count: any) {
    if (status == "CREDIT") {
      let data = {
        fuelDealerId: this.fuelDealerId,
        assignedAutoManualNumber: Number(this.autoManualNumber) + Number(count),
        status: status
      }
      this.post2.updateAssignedAutoManualNumberPOST(data)
        .subscribe(res => {
          this.getfuelDealerIdByCorporateIdForCalling(status)
        })
    } else if (status == "LUBE") {
      let data = {
        fuelDealerId: this.fuelDealerId,
        assignedAutoManualNumber: Number(this.autoManualNumberLube) + Number(count),
        status: status
      }
      this.post2.updateAssignedAutoManualNumberPOST(data)
        .subscribe(res => {
          this.getfuelDealerIdByCorporateIdForCalling(status)
        })
    } else if (status == "LUBETAX") {
      let data = {
        fuelDealerId: this.fuelDealerId,
        assignedAutoManualNumber: Number(this.autoManualNumberLubeTax) + Number(count),
        status: status
      }
      this.post2.updateAssignedAutoManualNumberPOST(data)
        .subscribe(res => {
          this.getfuelDealerIdByCorporateIdForCalling(status)
        })
    }
    else { }
  }

  checkDates(mapId: any, date: string | number | Date) {
    if (this.islastCRDate = true) {
      this.spinner.show();
      var g1 = new Date(date);
      var g2 = new Date(this.lastCRDate);
      if (g1.getTime() >= g2.getTime()) {
        //  console.log("g1 is greater than g2",date+'>'+this.lastCRDate);
        const oneDay = 24 * 60 * 60 * 1000
        const diffDays = Math.round(Math.abs((g1.getTime() - g2.getTime()) / oneDay))
        //  console.log("Diff ",diffDays);
        this.spinner.hide();
        this.fuelDealerCorpMapIdNew = ''
        this.isSelected1 = false
        this.requestTransporter1.controls["selectedCorp"].setValue('');
        this.isTable = false
        this.isTable1 = false
        this.isTable2 = false
        this.lastCRDate = ''
      }
      else {
        //  console.log("g1 is small than g2",date+'<'+this.lastCRDate);
        //  console.log('MapId ',mapId)
        let data = {
          mapId: mapId,
          date: date
        }
        this.post.updateLastCRDateByMapIdPOST(data)
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
            } else {
              this.spinner.hide();
              this.updateDateByMapId(mapId)
              this.isSelected1 = false
              this.requestTransporter1.controls["selectedCorp"].setValue('');
              this.isTable = false
              this.isTable1 = false
              this.isTable2 = false
              this.lastCRDate = ''
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
            this.updateDateByMapId(mapId)
            this.spinner.hide();
            this.isSelected1 = false
            this.requestTransporter1.controls["selectedCorp"].setValue('');
            this.isTable = false
            this.isTable1 = false
            this.isTable2 = false
            this.lastCRDate = ''
          } else {
            this.spinner.hide();
            this.updateDateByMapId(mapId)
            this.isSelected1 = false
            this.requestTransporter1.controls["selectedCorp"].setValue('');
            this.isTable = false
            this.isTable1 = false
            this.isTable2 = false
            this.lastCRDate = ''
          }
        });
    }
  }

  getfuelDealerIdByCorporateIdForCalling(status: string) {
    let data = {
      corporateId: this.dealerCorporateId
    }
    this.post1.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.autoManualNumber = res.data[0].assignedAutoManualNumber;
          this.autoManualNumberLube = res.data[0].assignedAutoManualNumberLube;
          this.autoManualNumberLubeTax = res.data[0].assignedAutoManualNumberLubeTax;
          this.autoManualNumberAdvance = res.data[0].assignedAutoManualNumberAdvance;
          this.autoManualNumberVehicle = res.data[0].assignedAutoManualNumberVehicle;
          this.autoManualStatus = res.data[0].autoManualStatus;
          if (status == 'CREDIT') {
            this.addFormRequestSales()
          } else if (status == "LUBE") {
            this.addFormRequestLube();
          } else { }
        }
      })
  }

  updateDateByMapId(fuelDealerCustomMapId: any) {
    let data1 = {
      mapId: fuelDealerCustomMapId
    }
    this.post.updateLastCRDateMapIdWisePOST(data1)
      .subscribe((res) => {
        if (res.status == 'OK') {
          // console.log("Date updated successfully..")
          this.fuelDealerCorpMapIdNew = ''
        } else {
          this.fuelDealerCorpMapIdNew = ''
        }
      })
  }

  closeModalCr() {
    this.CreditRequestDataLube.length = 0;
    this.CreditRequestDataArraySales.length = 0;
    this.personPhone1 = '';
    this.personName = '';
    this.dealerLocation = '';
    this.dealerName = '';
    this.productName1 = '';
    this.productPrice = '';
    this.requestTransporter1.controls["selectedCorp"].setValue('');
    this.requestTransporter.controls["productPrice"].setValue('');
    this.requestTransporter.controls["productName"].setValue('');
    this.allCreditReqByDate.length = 0;
    this.CreditRequest1.vehicleNumber = '';
    this.CreditRequest1.manualNumber = '';
    this.CreditRequest1.creditQuantity = '';
    this.CreditRequest1.creditAmount = '';
    this.CreditRequestDataArray.length = 0;
    this.CreditRequestLube.nameLube = '';
    this.CreditRequestLube.manualNumberLube = '';
    this.CreditRequestLube.vehicleNumberLube = '';
    this.CreditRequestLube.creditAmountLube = '';
    this.CreditRequestLube.creditQuantityLube = '';
    this.CreditRequestLube.unitLube = '';
    this.CreditRequestDataLube.length = 0;
    this.productPriceDetails.length = 0;
    this.count = 1;
    this.isSelected1 = false;
    this.isSelected2 = false;
    this.addFormRequestSales();
    this.isTable = false;
    this.isTable1 = false;
    this.isTable2 = false;
  }

  removeRequestIndex() {
    this.CreditRequestDataArraySales.splice(this.indexFuelCr, 1);
    this.count = this.count - 1;
    // console.log("COUNT:", this.count)
    this.modalRef.close('close');
  }

  getLubeDetails(id: any, i: string | number) {
    this.spinner.show();
    let data = {
      lubricantsId: id.target.value,
    }
    this.post.getLubricantByIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data.length) {
            // console.log(res.data[0].lubricantsUnit,res.data[0].lubricantsName)
            this.CreditRequestDataLube[i].unitLube = res.data[0].lubricantsUnit;
            this.CreditRequestDataLube[i].nameLube = res.data[0].lubricantsName;
            this.CreditRequestDataLube[i].hsnSacNumber = res.data[0].lubricantsHsnSacNumber
            this.spinner.hide();
            this.setNameLube();
            this.setunitLube();
          } else {
            alert("Error..!")
            this.CreditRequestDataLube[i].hsnSacNumber = ''
            this.setNameLube()
            this.spinner.hide();
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

  setNameLube() {
    this.requestTransporterLube.controls["nameLube"].setValue(this.CreditRequestLube.nameLube)
  }

  setunitLube() {
    this.requestTransporterLube.controls["unitLube"].setValue(this.CreditRequestLube.unitLube)
  }

  gstCalculation1(i: string | number) {
    console.log(this.CreditRequestDataLube[i].creditAmountLube)
    if (this.CreditRequestDataLube[i].creditAmountLube) {
      if (this.CreditRequestDataLube[i].taxDetails == 'INCLUDE') {

        this.CreditRequestDataLube[i].gstAmount = Number(Number(this.CreditRequestDataLube[i].creditAmountLube) - (Number(this.CreditRequestDataLube[i].creditAmountLube) * (100 / (100 + Number(this.CreditRequestDataLube[i].gst))))).toFixed(2)

        this.CreditRequestDataLube[i].totalAmount = Number(this.CreditRequestDataLube[i].creditAmountLube)
        this.CreditRequestDataLube[i].totalWOGSTAmount = Number(this.CreditRequestDataLube[i].creditAmountLube) - Number(this.CreditRequestDataLube[i].gstAmount)

        if (this.subGST == 'CGST') {
          this.CreditRequestDataLube[i].cgst = Number(this.CreditRequestDataLube[i].gst) / 2;
          this.CreditRequestDataLube[i].sgst = Number(this.CreditRequestDataLube[i].gst) / 2;
          this.CreditRequestDataLube[i].igst = '';
        } else {
          this.CreditRequestDataLube[i].cgst = ''
          this.CreditRequestDataLube[i].sgst = ''
          this.CreditRequestDataLube[i].igst = Number(this.CreditRequestDataLube[i].gst)
        }
      } else {

        this.CreditRequestDataLube[i].gstAmount = Number((Number(this.CreditRequestDataLube[i].creditAmountLube) * Number(this.CreditRequestDataLube[i].gst)) / 100).toFixed(2)
        this.CreditRequestDataLube[i].totalAmount = (Number(this.CreditRequestDataLube[i].creditAmountLube) + Number(this.CreditRequestDataLube[i].gstAmount))
        this.CreditRequestDataLube[i].totalWOGSTAmount = Number(this.CreditRequestDataLube[i].creditAmountLube)

        if (this.subGST == 'CGST') {
          this.CreditRequestDataLube[i].cgst = Number(this.CreditRequestDataLube[i].gst) / 2;
          this.CreditRequestDataLube[i].sgst = Number(this.CreditRequestDataLube[i].gst) / 2;
          this.CreditRequestDataLube[i].igst = ''
        } else {
          this.CreditRequestDataLube[i].cgst = ''
          this.CreditRequestDataLube[i].sgst = ''
          this.CreditRequestDataLube[i].igst = Number(this.CreditRequestDataLube[i].gst)
        }
      }

      if (this.CreditRequestDataLube[i].creditQuantityLube) {
        this.CreditRequestDataLube[i].productPrice = Number(Number(this.CreditRequestDataLube[i].creditAmountLube) / Number(this.CreditRequestDataLube[i].creditQuantityLube)).toFixed(2)
      }

    }
  }

  setVehicleNumberLube() {
    this.isVehSelectLube = true;
    this.requestTransporterLube.controls["vehicleNumber"].setValue(this.CreditRequestLube.vehicleNumberLube)
    if (this.autoManualStatus == 'TRUE') {
      this.requestTransporterLube.controls["manualCrNumber"].setValue(this.CreditRequestLube.manualNumberLube)

    }
  }

  getQuantityByPieces(i: string | number) {
    if (this.isQuantityRatio) {
      this.CreditRequestDataLube[i].creditQuantityLube = (Number(this.quantityRatio) * Number(this.CreditRequestDataLube[i].quantityInPieces)).toFixed(2)
    }
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

  submitByDealerForLubeGst() {
    if (this.CreditRequestLube.creditAmountLube && this.CreditRequestLube.creditQuantityLube) {
      this.spinner.show()
      let data = {
        lubeAllData: this.CreditRequestDataLube,
        fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
        reqQuantity: this.requestTransporterLube.value.creditQuantity,
        reqCreditAmount: this.requestTransporterLube.value.creditAmount,
        estimatedRefuelDate: moment(this.requestTransporterLube.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        fuelDealerId: this.fuelDealerSQLId,
        fuelCorporateId: this.dealerCorporateId,
        creditSource: "DEALER",
        PANno: this.PANno,
        transDateTime: moment(this.closeRequestDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        transactionTime: moment(new Date()).format('hh:mm:ss'),
        creditAmount: this.requestTransporterLube.value.actualCreditAmount,
        transactionStatus: 'COMPLETE',
        fueldealerStaffId: this.staffId,
        actualCreditQuantity: this.requestTransporterLube.value.actualCreditQuantity,
        createdAt: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        productRate: this.requestTransporterLube.value.productPrice,
        vehicleNumber: this.requestTransporterLube.value.vehicleNumber,
        manualCrNumber: this.requestTransporterLube.value.manualCrNumber,
        personId: this.operatorPersonID,
        managerVPPersonId: this.operatorVPID,
        managerPersonId: this.operatorPersonID,
        managerName: this.operatorNAME,
        autoManualStatus: this.autoManualStatus,
        fuelShiftId: this.shiftIdUpdate,
      }

      // console.log(data)
      this.post.addCreditLubeGstFromShiftPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            alert("Lube-GST Added Sccessfully!");
            this.getFuelCreditByDate(this.fuelDealerId);
            this.getAllFuelCreditByStaffIdDate(this.staffId);
            this.closeModalCrLube()
            this.spinner.hide();
            this.cd.detectChanges()

          } else {
            alert("Error to Created Request!")
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
    } else {
      alert("Please Enter Amount and Quantity..!")
    }
  }

  closeModalCrLube() {
    this.requestTransporter1.controls["selectedCorp"].setValue('');
    this.CreditRequestLube.vehicleNumberLube = '';
    this.CreditRequestLube.manualNumberLube = '';
    this.CreditRequestLube.creditQuantityLube = '';
    this.CreditRequestLube.creditAmountLube = '';
    this.CreditRequestLube.quantityInPieces = '';
    this.CreditRequestLube.hsnSacNumber = '';
    this.CreditRequestLube.gstAmount = '';
    this.CreditRequestLube.totalAmount = '';
    this.CreditRequestLube.totalWOGSTAmount = '';
    this.CreditRequestLube.unitLube = '';
    this.CreditRequestLube.lubeId = '';
    this.CreditRequestLube.gst = '';
    this.isSelected1 = false;
  }

  removeLubeIndex() {
    this.CreditRequestDataLube.splice(this.indexFuelLube, 1);
    this.countLube = this.countLube - 1;
    // console.log("COUNT:", this.countLube)
    this.modalRef.close('close');
  }

  update() {
    this.spinner.show();
    if (Number(this.meterSalesTotal) <= Number(this.totalAmount)) {
      if (Number(this.totalCashTally)) {
        if (Number(this.totalCashHandover)) {

          const data = {
            shiftId: this.shiftIdUpdate,
            nozzelCount: this.nozzleCountUpdate,
            closeTime: this.updateShiftForm.value.stopTime,
            shiftTallyId: this.tallyTableId,
            digitalTally: this.totalDigitalTally,
            totalAmountTally: this.totalAmount,
            totalCashTally: this.totalCashTally,
            totalCreditTally: this.totalCreditTally,
            shortamount: this.shortamount,
            expenseAmount: this.expenseAmount,
            updateBy: this.managerName,
            closeDate: this.updateShiftForm.value.closeDate,
            totalCashHandover: this.totalCashHandover,
            expenseAmtDetails: this.expenseAmtDetails
          };
          this.post.updateShiftDetailsByShiftIdPOST(data)
            .subscribe((res) => {
              if (res.status == 'OK') {
                this.spinner.hide();
                alert("Updated successfully..!")
                window.location.reload();

              } else {
                alert("Error to Update..!")
                this.spinner.hide();
              }
            });
        } else {
          alert("please enter cash handover amount..")
          this.spinner.hide();
        }
      } else {

        const data = {
          shiftId: this.shiftIdUpdate,
          nozzelCount: this.nozzleCountUpdate,
          closeTime: this.updateShiftForm.value.stopTime,
          shiftTallyId: this.tallyTableId,
          digitalTally: this.totalDigitalTally,
          totalAmountTally: this.totalAmount,
          totalCashTally: this.totalCashTally,
          totalCreditTally: this.totalCreditTally,
          shortamount: this.shortamount,
          expenseAmount: this.expenseAmount,
          updateBy: this.managerName,
          closeDate: this.updateShiftForm.value.closeDate,
          totalCashHandover: this.totalCashHandover,
          expenseAmtDetails: this.expenseAmtDetails
        };
        this.post.updateShiftDetailsByShiftIdPOST(data)
          .subscribe((res) => {
            if (res.status == 'OK') {
              this.spinner.hide();
              alert("Updated successfully..!")
              window.location.reload();
            } else {
              alert("Error to Update..!")
              this.spinner.hide();
            }
          });
      }
    } else {
      alert("Total Tally Amount is smaller than Meter Sales Amount..")
      this.spinner.hide();
    }
  }

  submitTallyDetailsUpdate() {
    this.spinner.show();
    if (Number(this.meterSalesTotal) <= Number(this.totalAmount)) {

      if (Number(this.totalCashTally)) {
        if (Number(this.totalCashHandover)) {
          const data = {
            corporateId: this.dealerCorporateId,
            fuelDealerId: this.fuelDealerId,
            shiftId: this.shiftIdUpdate,
            transacDate: moment(this.updateShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD' + ' 01:01:01'),
            fuelDealerStaffId: this.staffId,
            totalDigitalTally: this.totalDigitalTally,
            expenseAmount: this.expenseAmount,
            shortamount: this.shortamount,
            totalAmount: this.totalAmount,
            totalCashTally: this.totalCashTally,
            totalCreditTally: this.totalCreditTally,


            nozzelCount: this.nozzleCount,
            closeTime: this.updateShiftForm.value.stopTime,
            updateBy: this.managerName,
            closeDate: this.updateShiftForm.value.closeDate,
            totalCashHandover: this.totalCashHandover,
            reqFromDevice: "PORTAL",
            expenseAmtDetails: this.expenseAmtDetails
          };
          this.post.addFuelShiftTallySalesPOST(data).subscribe((res) => {
            if (res.status == 'OK') {
              alert('Data submitted successfully...');
              this.getShiftDetailsByShiftIdUpdate(this.shiftIdUpdate, 'EDIT')
              window.location.reload();
              this.spinner.hide();
            } else {
              alert('Error to submit. Please Re-Login..');
              this.spinner.hide();
            }
          });
        } else {
          alert("please enter cash handover amount..")
          this.spinner.hide();
        }
      } else {

        const data = {
          corporateId: this.dealerCorporateId,
          fuelDealerId: this.fuelDealerId,
          shiftId: this.shiftIdUpdate,
          transacDate: moment(this.updateShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD' + ' 01:01:01'),
          fuelDealerStaffId: this.staffId,
          totalDigitalTally: this.totalDigitalTallyUpdate,
          expenseAmount: this.expenseAmountUpdate,
          shortamount: this.shortamountUpdate,
          totalAmount: this.totalAmountUpdate,
          totalCashTally: this.totalCashTallyUpdate,
          totalCreditTally: this.totalCreditTallyUpdate,


          nozzelCount: this.nozzleCountUpdate,
          closeTime: this.updateShiftForm.value.stopTime,
          updateBy: this.managerName,
          closeDate: this.updateShiftForm.value.closeDate,
          totalCashHandover: this.totalCashHandoverUpdate,
          reqFromDevice: "PORTAL",
          expenseAmtDetails: this.expenseAmtDetails
        };
        this.post.addFuelShiftTallySalesPOST(data).subscribe((res) => {
          if (res.status == 'OK') {
            alert('Data submitted successfully...');
            this.getShiftDetailsByShiftId(this.shiftId)
            window.location.reload();

            this.spinner.hide();
          } else {
            alert('Error to submit. Please Re-Login..');
            this.spinner.hide();
          }
        });
      }
    } else {
      alert("Total Tally Amount is smaller than Meter Sales Amount..")
      this.spinner.hide();
    }
  }

  getShiftDetailsByShiftId(idfuelShiftDetails: any) {
    this.nozzleDetails.length = 0
    const data = {
      fuelShiftId: idfuelShiftDetails,
    };
    this.post.getShiftDetailsByShiftIdPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.data2.length) {
          this.nozzleDetails = res.data2;
        }
      }
    });
  }

  getDigitalEntryDetailsByShiftIdUpdate(shiftId: any) {
    this.totalDigitalSalesUpdate = 0
    this.digitalSalesDetailsUpdate.length = 0
    let data = {
      shiftId: shiftId,
    }
    this.post.getDigitalSalesByShiftPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.digitalSalesDetailsUpdate = res.data;
          this.totalDigitalSalesUpdate = res.data1[0].totalDigitalSales
          if (this.isDigitalSubmit = true) {
            this.totalDigitalTallyUpdate = (this.totalDigitalSales)
            this.getTotalTallyUpdate()
          }

          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      })
  }

  getTotalTallyUpdate() {
    this.totalAmountUpdate = (Number(this.totalCashTallyUpdate) + Number(this.totalDigitalTallyUpdate)
      + Number(this.totalCreditTallyUpdate)).toFixed(2);
    this.getDifferenceUpdate()
    this.cd.detectChanges()
  }

  getDifferenceUpdate() {
    this.differenceUpdate = Number(Number(this.totalAmountUpdate) - Number(this.meterSalesUpdate)).toFixed(2);
    this.getShort()
  }
  
  askForConfirmDelete(confirmdeleteTemplate: any) {
    this.modalRefpass = this.modalService.open(confirmdeleteTemplate)
    this.modalRefpass.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

}

