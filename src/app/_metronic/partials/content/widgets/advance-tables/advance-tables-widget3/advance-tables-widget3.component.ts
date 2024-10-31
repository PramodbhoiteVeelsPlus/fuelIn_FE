import { Component, OnInit, Injectable, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Adv_TablesService } from '../adv_tables.services';
import { ExcelService } from 'src/app/pages/excel.service';

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

type Tabs =
  | 'kt_advance-tables_widget_3_tab_1'
  | 'kt_advance-tables_widget_3_tab_2'
  | 'kt_advance-tables_widget_3_tab_3';

@Component({
  selector: 'app-advance-tables-widget3',
  templateUrl: './advance-tables-widget3.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class AdvanceTablesWidget3Component implements OnInit {
  filterVehicleList = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  searchBoxVehicleList: FormControl = new FormControl();
  searchTermVehicleList: any = "";
  getAllVehicleList2: any = [];
  getAllVehicleList3: any = [];
  getAllVehicleList1: any = [];
  selectedVList: string;
  getAllVehicleList2Excel: any = [];
  entityId1: string;
  ownerName1: string;
  ownerFatherName1: string;
  splitPresentAddress1: string;
  permanentAddress1: string;
  vehicleNumber1: string;
  vehicleManufacturerName1: string;
  vehicleManufacturingMonthYear1: string;
  regDate1: string;
  rcExpiryDate1: string;
  status1: string;
  regAuthority1: string;
  rcFinancer1: string;
  isCommercial1: string;
  fuelType1: string;
  vehicleClass1: string;
  model1: string;
  bodyType1: string;
  engineNumber1: string;
  chassicNumber1: string;
  normsType1: string;
  vehicleColour1: string;
  wheelbase1: string;
  unladenWeight1: string;
  grossVehicleWeight1: string;
  vehicleTaxUpto1: string;
  vehicleCubicCapacity1: string;
  vehicleCylindersNo1: string;
  vehicleSeatCapacity1: string;
  vehicleSleeperCapacity1: string;
  vehicleStandingCapacity1: string;
  pucNumber1: string;
  pucExpiryDate1: string;
  permitType1: string;
  permitNumber1: string;
  permitIssueDate1: string;
  permitValidFrom1: string;
  permitValidUpto1: string;
  nationalPermitUpto1: string;
  nationalPermitNumber1: string;
  nationalPermitIssuedBy1: string;
  vehicleInsuranceCompanyName1: string;
  vehicleInsurancePolicyNumber1: string;
  vehicleInsuranceUpto1: string;
  blacklistStatus1: string;
  rowNumber: any;
  show: boolean = false;
  p: number = 1;
  p1: number = 1;
  total: number = 0;


  constructor(private post: Adv_TablesService, private excelService: ExcelService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private cd: ChangeDetectorRef,
  ) { }

  activeTab: Tabs = 'kt_advance-tables_widget_3_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    this.getAllVehicleList();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getAllVehicleList();
  }

  getAllVehicleList() {
    this.getAllVehicleList2 = []
    this.post.getFTAllVehicleList()
      .subscribe(res => {
        this.getAllVehicleList1 = res;
        this.getAllVehicleList1.data.map(
          (detail: any) => {
            this.getAllVehicleList2.push(detail);
            this.getAllVehicleList3.push(detail);
          })
        this.cd.detectChanges();
      })
  }

  searchVehicleList1() {
    this.searchBoxVehicleList.valueChanges
      // .distinctUntilChanged()
      .subscribe((termVehicleList) => {
        this.searchTermVehicleList = termVehicleList;
        this.searchVehicleList();
      })
  }

  //  Free Search Vehicle
  searchVehicleList() {
    let term = this.searchTermVehicleList;
    this.getAllVehicleList2 = this.getAllVehicleList3.filter(function (res: any) {
      return res.entityId.indexOf(term) >= 0;
    });
    if (this.getAllVehicleList2.length == 0) {
      term = this.searchTermVehicleList;
      this.getAllVehicleList2 = this.getAllVehicleList3.filter(function (res: any) {
        return res.entityId.indexOf(term) >= 0;
      });
    }
    if (this.getAllVehicleList2.length == 0) {
      term = this.searchTermVehicleList;
      this.getAllVehicleList2 = this.getAllVehicleList3.filter(function (res: any) {
        return res.vehicleNumber.indexOf(term) >= 0;
      });
    }
    if (this.getAllVehicleList2.length == 0) {
      term = this.searchTermVehicleList;
      this.getAllVehicleList2 = this.getAllVehicleList3.filter(function (res: any) {
        return res.vishUserFirstName.indexOf(term) >= 0;
      });
    }
    if (this.getAllVehicleList2.length == 0) {
      term = this.searchTermVehicleList;
      this.getAllVehicleList2 = this.getAllVehicleList3.filter(function (res: any) {
        return res.vishUserLastName.indexOf(term) >= 0;
      });
    }
    if (this.getAllVehicleList2.length == 0) {
      term = this.searchTermVehicleList;
      this.getAllVehicleList2 = this.getAllVehicleList3.filter(function (res: any) {
        return res.chassicNumber.indexOf(term) >= 0;
      });
    }
    if (this.getAllVehicleList2.length == 0) {
      term = this.searchTermVehicleList;
      this.getAllVehicleList2 = this.getAllVehicleList3.filter(function (res: any) {
        return res.vehicleInsuranceCompanyName.indexOf(term) >= 0;
      });
    }
  }

  // FILTER LIST VEHICLE
  getFastagAllVehicleListDateRange() {
    this.getAllVehicleList2 = [];
    let data = {
      startDate: moment(this.filterVehicleList.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "00:00:01",
      endDate: moment(this.filterVehicleList.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "23:59:59",
    }
    this.post.getFTAllVehicleListDateRangePost(data)
      .subscribe(res => {
        if (res.data.length) {
          this.getAllVehicleList2 = res.data;
          this.cd.detectChanges();
        } else {
          alert("Data not found..")
          this.cd.detectChanges();
        }
      })
  }

  clearFilterVehicleList() {
    this.selectedVList = '';
    this.filterVehicleList.reset();
    this.getAllVehicleList();
  }

  exportToExcelVehicleList() {
    this.getAllVehicleList2Excel.length = 0;
    this.getAllVehicleList2.map((res: any) => {
      let json = {
        DateofAddition: moment(res.vishUserCreatedAt).format("DD-MM-YYYY"),
        VeelsID: res.entityId,
        VehicleNumber: res.vehicleNumber,
        AddedByCustomerName: res.vishUserFirstName + ' ' + res.vishUserLastName,
        ChassisNumber: res.chassicNumber,
        InsuranceExpiry: res.insuranceExpiryDate,
        FinanceCompanyName: res.vehicleInsuranceCompanyName,
        OwnerName: res.ownerName,
        OwnerFatherName: res.ownerFatherName,
        PresentAddress: res.splitPresentAddress,
        PermanentAddress: res.permanentAddress,
        VehicleManufacturerName: res.vehicleManufacturerName,
        VehicleManufacturingMonthYear: res.vehicleManufacturingMonthYear,
        RcExpiryDate: res.rcExpiryDate,
        RcStatus: res.status,
        RegAuthority: res.regAuthority,
        financier: res.rcFinancer,
        Commercial: res.isCommercial,
        FuelDescription: res.fuelType,
        VehicleClassDescription: res.vehicleClass,
        MakerModel: res.model,
        BodyTypeDescription: res.bodyType,
        EngineNumber: res.engineNumber,
        NormsDescription: res.normsType,
        VehicleColour: res.vehicleColour,
        Wheelbase: res.wheelbase,
        UnladenWeight: res.unladenWeight,
        GrossVehicleWeight: res.grossVehicleWeight,
        VehicleTaxUpto: res.vehicleTaxUpto,
        VehicleCubicCapacity: res.vehicleCubicCapacity,
        VehicleCylindersNo: res.vehicleCylindersNo,
        VehicleSeatCapacity: res.vehicleSeatCapacity,
        VehicleSleeperCapacity: res.vehicleSleeperCapacity,
        VehicleStandingCapacity: res.vehicleStandingCapacity,
        PucNumber: res.pucNumber,
        PucExpiryDate: res.pucExpiryDate,
        StatePermitType: res.permitType,
        PermitNumber: res.permitNumber,
        PermitIssueDate: res.permitIssueDate,
        PermitValidFrom: res.permitValidFrom,
        PermitValidUpto: res.permitValidUpto,
        NationalPermitUpto: res.nationalPermitUpto,
        NationalPermitNumber: res.nationalPermitNumber,
        NationalPermitIssuedBy: res.nationalPermitIssuedBy,
        VehicleInsurancePolicyNumber: res.vehicleInsurancePolicyNumber,
        VehicleInsuranceUpto: res.vehicleInsuranceUpto,
        BlacklistStatus: res.blacklistStatus,
      };
      this.getAllVehicleList2Excel.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.getAllVehicleList2Excel,
      "Vehicle List"
    );

  }

  changeValue(i: any, entityId: any, ownerName: any, ownerFatherName: any, splitPresentAddress: any, permanentAddress: any, vehicleNumber: any, vehicleManufacturerName: any,
    vehicleManufacturingMonthYear: any, regDate: any, rcExpiryDate: any, status: any, regAuthority: any, rcFinancer: any, isCommercial: any, fuelType: any, vehicleClass: any, model: any,
    bodyType: any, engineNumber: any, chassicNumber: any, normsType: any, vehicleColour: any, wheelbase: any, unladenWeight: any, grossVehicleWeight: any, vehicleTaxUpto: any,
    vehicleCubicCapacity: any, vehicleCylindersNo: any, vehicleSeatCapacity: any, vehicleSleeperCapacity: any, vehicleStandingCapacity: any, pucNumber: any, pucExpiryDate: any,
    permitType: any, permitNumber: any, permitIssueDate: any, permitValidFrom: any, permitValidUpto: any, nationalPermitUpto: any, nationalPermitNumber: any,
    nationalPermitIssuedBy: any, vehicleInsuranceCompanyName: any, vehicleInsurancePolicyNumber: any, vehicleInsuranceUpto: any, blacklistStatus: any,) {

    this.entityId1 = ''
    this.ownerName1 = ''
    this.ownerFatherName1 = ''
    this.splitPresentAddress1 = ''
    this.permanentAddress1 = ''
    this.vehicleNumber1 = ''
    this.vehicleManufacturerName1 = ''
    this.vehicleManufacturingMonthYear1 = ''
    this.regDate1 = ''
    this.rcExpiryDate1 = ''
    this.status1 = ''
    this.regAuthority1 = ''
    this.rcFinancer1 = ''
    this.isCommercial1 = ''
    this.fuelType1 = ''
    this.vehicleClass1 = ''
    this.model1 = ''
    this.bodyType1 = ''
    this.engineNumber1 = ''
    this.chassicNumber1 = ''
    this.normsType1 = ''
    this.vehicleColour1 = ''
    this.wheelbase1 = ''
    this.unladenWeight1 = ''
    this.grossVehicleWeight1 = ''
    this.vehicleTaxUpto1 = ''
    this.vehicleCubicCapacity1 = ''
    this.vehicleCylindersNo1 = ''
    this.vehicleSeatCapacity1 = ''
    this.vehicleSleeperCapacity1 = ''
    this.vehicleStandingCapacity1 = ''
    this.pucNumber1 = ''
    this.pucExpiryDate1 = ''
    this.permitType1 = ''
    this.permitNumber1 = ''
    this.permitIssueDate1 = ''
    this.permitValidFrom1 = ''
    this.permitValidUpto1 = ''
    this.nationalPermitUpto1 = ''
    this.nationalPermitNumber1 = ''
    this.nationalPermitIssuedBy1 = ''
    this.vehicleInsuranceCompanyName1 = ''
    this.vehicleInsurancePolicyNumber1 = ''
    this.vehicleInsuranceUpto1 = ''
    this.blacklistStatus1 = ''

    if (i == this.rowNumber) {
      this.rowNumber = ''
      if (this.show == true) {
        this.show = false;
      } else {
        this.show = true;
        this.rowNumber = i
        this.entityId1 = entityId
        this.ownerName1 = ownerName
        this.ownerFatherName1 = ownerFatherName
        this.splitPresentAddress1 = splitPresentAddress
        this.permanentAddress1 = permanentAddress
        this.vehicleNumber1 = vehicleNumber
        this.vehicleManufacturerName1 = vehicleManufacturerName
        this.vehicleManufacturingMonthYear1 = vehicleManufacturingMonthYear
        this.regDate1 = regDate
        this.rcExpiryDate1 = rcExpiryDate
        this.status1 = status
        this.regAuthority1 = regAuthority
        this.rcFinancer1 = rcFinancer
        this.isCommercial1 = isCommercial
        this.fuelType1 = fuelType
        this.vehicleClass1 = vehicleClass
        this.model1 = model
        this.bodyType1 = bodyType
        this.engineNumber1 = engineNumber
        this.chassicNumber1 = chassicNumber
        this.normsType1 = normsType
        this.vehicleColour1 = vehicleColour
        this.wheelbase1 = wheelbase
        this.unladenWeight1 = unladenWeight
        this.grossVehicleWeight1 = grossVehicleWeight
        this.vehicleTaxUpto1 = vehicleTaxUpto
        this.vehicleCubicCapacity1 = vehicleCubicCapacity
        this.vehicleCylindersNo1 = vehicleCylindersNo
        this.vehicleSeatCapacity1 = vehicleSeatCapacity
        this.vehicleSleeperCapacity1 = vehicleSleeperCapacity
        this.vehicleStandingCapacity1 = vehicleStandingCapacity
        this.pucNumber1 = pucNumber
        this.pucExpiryDate1 = pucExpiryDate
        this.permitType1 = permitType
        this.permitNumber1 = permitNumber
        this.permitIssueDate1 = permitIssueDate
        this.permitValidFrom1 = permitValidFrom
        this.permitValidUpto1 = permitValidUpto
        this.nationalPermitUpto1 = nationalPermitUpto
        this.nationalPermitNumber1 = nationalPermitNumber
        this.nationalPermitIssuedBy1 = nationalPermitIssuedBy
        this.vehicleInsuranceCompanyName1 = vehicleInsuranceCompanyName
        this.vehicleInsurancePolicyNumber1 = vehicleInsurancePolicyNumber
        this.vehicleInsuranceUpto1 = vehicleInsuranceUpto
        this.blacklistStatus1 = blacklistStatus
      }
    } else {
      this.rowNumber = i
      this.show = true;
      this.entityId1 = entityId
      this.ownerName1 = ownerName
      this.ownerFatherName1 = ownerFatherName
      this.splitPresentAddress1 = splitPresentAddress
      this.permanentAddress1 = permanentAddress
      this.vehicleNumber1 = vehicleNumber
      this.vehicleManufacturerName1 = vehicleManufacturerName
      this.vehicleManufacturingMonthYear1 = vehicleManufacturingMonthYear
      this.regDate1 = regDate
      this.rcExpiryDate1 = rcExpiryDate
      this.status1 = status
      this.regAuthority1 = regAuthority
      this.rcFinancer1 = rcFinancer
      this.isCommercial1 = isCommercial
      this.fuelType1 = fuelType
      this.vehicleClass1 = vehicleClass
      this.model1 = model
      this.bodyType1 = bodyType
      this.engineNumber1 = engineNumber
      this.chassicNumber1 = chassicNumber
      this.normsType1 = normsType
      this.vehicleColour1 = vehicleColour
      this.wheelbase1 = wheelbase
      this.unladenWeight1 = unladenWeight
      this.grossVehicleWeight1 = grossVehicleWeight
      this.vehicleTaxUpto1 = vehicleTaxUpto
      this.vehicleCubicCapacity1 = vehicleCubicCapacity
      this.vehicleCylindersNo1 = vehicleCylindersNo
      this.vehicleSeatCapacity1 = vehicleSeatCapacity
      this.vehicleSleeperCapacity1 = vehicleSleeperCapacity
      this.vehicleStandingCapacity1 = vehicleStandingCapacity
      this.pucNumber1 = pucNumber
      this.pucExpiryDate1 = pucExpiryDate
      this.permitType1 = permitType
      this.permitNumber1 = permitNumber
      this.permitIssueDate1 = permitIssueDate
      this.permitValidFrom1 = permitValidFrom
      this.permitValidUpto1 = permitValidUpto
      this.nationalPermitUpto1 = nationalPermitUpto
      this.nationalPermitNumber1 = nationalPermitNumber
      this.nationalPermitIssuedBy1 = nationalPermitIssuedBy
      this.vehicleInsuranceCompanyName1 = vehicleInsuranceCompanyName
      this.vehicleInsurancePolicyNumber1 = vehicleInsurancePolicyNumber
      this.vehicleInsuranceUpto1 = vehicleInsuranceUpto
      this.blacklistStatus1 = blacklistStatus

    }

  }


}
