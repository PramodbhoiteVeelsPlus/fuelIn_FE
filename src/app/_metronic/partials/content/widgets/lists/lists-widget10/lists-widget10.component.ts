import { ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListWidgetService } from '../listWidget.services';
import { FormGroup, FormControl } from '@angular/forms';
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
  selector: 'app-lists-widget10',
  templateUrl: './lists-widget10.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget10Component {

  filterForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
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
  isUpdate: boolean = false;
  modalRef: any;
  closeResult: string;
  shiftTimeFromHrs: any;
  shiftTimeFromMin: any;
  shiftTimeToHrs: any;
  shiftTimeToMin: any;
  createdBy: string;
  fuelShiftTimeDetailsTime: any = [];
  dealerAccess: boolean = false;
  selectedDate: string;
  modalReference: any;
  attendanceData: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  attendanceId: string;
  updateStaffName: string;
  updateMobileNumber: string;
  updateRole: string;
  updateAttendanceStatus: string;
  updateAttendanceDate: string;
  isUpdatePresent: boolean;
  isAttendance: boolean;
  isAbsent: boolean;
  updateReason: string;
  modalUpdateReference: any;
  userName: string;
  staffData: any = [];
  addAttendanceData: any = [];
  addAttendanceArray: any = [];
  isAddSalary: boolean = false;
  month: any;
  year: any;
  currentYear: string;
  lastYear: number;
  last2Years: number;
  addStaffSalaryData: any = [];
  addStaffSalaryArray: any = [];
  staffSalaryData: any = [];
  staffSalaryId: string;
  updatedStaffName: string;
  updatedMobileNumber: string;
  updatedRole: string;
  updatedSalaryDate: string;
  updatedSalaryTotalAmt: string;
  updatedSalaryDeductionAmt: any;
  updatedSalaryFinalAmt: any;
  updatedSalaryDetails: string;

  constructor(
    private post: ListWidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
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
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.accessGroup = element.accessGroupId;
    if (element.accessGroupId == 12 || element.accessGroupId == 14) {
      this.dealerAccess = true
      // this.getCorporateById(this.dealerLoginVPId)

      this.selectedDate = moment(new Date()).format("DD-MM-YYYY")
    } else {
      this.dealerAccess = false
    }
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
    this.userName = element.firstName + ' ' + element.lastName
    this.month = moment(new Date()).format("MM")
    this.year = moment(new Date()).format("YYYY")
    this.currentYear = moment(new Date()).format("YYYY")
    this.lastYear = Number(moment(new Date()).format("YYYY")) - 1;
    this.last2Years = Number(moment(new Date()).format("YYYY")) - 2;
    // this.getStaffDetails(this.fuelDealerId)
    this.cd.detectChanges()
  }

  isAddSal() {
    this.isAddSalary = true;
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

  getDetailsForSalary(fuelDealerId: any) {
    this.getStaffDetailsForSalary(fuelDealerId)
    this.getStaffSalary(fuelDealerId)
  }

  getStaffDetailsForSalary(fuelDealerId: any) {
    this.spinner.show();
    this.staffData = [];
    this.addStaffSalaryData = [];
    let data = {
      dealerId: fuelDealerId,
      month: this.month,
      year: this.year,
    }
    this.post.getStaffDetailsForSalaryPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.staffData = res.data;
          this.getStaffArray();
          this.spinner.hide();
        }
        else {
          this.staffData = [];
          this.addStaffSalaryData = [];
          this.spinner.hide();
        }
      })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getStaffSalary(this.fuelDealerId);
  }

  getStaffArray() {
    this.staffData.map((res1: { fuelDealerStaffId: string; staffName: string; designation: string; phone: string; presentDays: number; absentDays: number; salary: string; }) => {
      const dataJSON = {
        staffSalaryStaffId: "",
        staffSalaryDate: "",
        staffName: "",
        mobileNumber: "",
        role: "",
        staffSalaryTotalAmt: "",
        staffSalaryDeductionAmt: "",
        staffSalaryPaidAmt: "",
        staffSalaryAdvanceAmt: 0,
        staffSalaryPresentDays: 0,
        staffSalaryAbsentDays: 0,
        staffSalaryDetails: "",
      }
      dataJSON.staffSalaryStaffId = res1.fuelDealerStaffId;
      dataJSON.staffName = res1.staffName;
      dataJSON.role = res1.designation;
      dataJSON.mobileNumber = res1.phone;
      dataJSON.staffSalaryPresentDays = res1.presentDays;
      dataJSON.staffSalaryAbsentDays = res1.absentDays;
      dataJSON.staffSalaryTotalAmt = res1.salary;

      this.addStaffSalaryData.push(dataJSON);
    })

    this.addStaffSalaryArray = this.addStaffSalaryData;
  }

  getStaffSalary(fuelDealerId: any) {
    this.spinner.show();
    this.staffSalaryData = [];
    let data = {
      dealerId: fuelDealerId,
      month: this.month,
      year: this.year,
    }
    this.post.getStaffSalaryPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.staffSalaryData = res.data;
          this.spinner.hide();
        }
        else {
          this.staffSalaryData = [];
          this.spinner.hide();
        }
      })
  }

  calculateSalary(amt: any, i: any) {
    if (this.addStaffSalaryArray[i].staffSalaryDate) {
      if (amt && Number(this.addStaffSalaryArray[i].staffSalaryDeductionAmt)) {
        if (Number(this.addStaffSalaryArray[i].staffSalaryTotalAmt) > Number(this.addStaffSalaryArray[i].staffSalaryDeductionAmt)) {
          this.addStaffSalaryArray[i].staffSalaryPaidAmt = Number(this.addStaffSalaryArray[i].staffSalaryTotalAmt) - Number(this.addStaffSalaryArray[i].staffSalaryDeductionAmt)
        } else {
          alert("Deduction Salary should be less than Salary Amount");
          this.addStaffSalaryArray[i].staffSalaryDeductionAmt = ""
          this.addStaffSalaryArray[i].staffSalaryPaidAmt = ""
        }
      }
    } else {
      alert("Please Select Date")
      this.addStaffSalaryArray[i].staffSalaryDeductionAmt = ""
      this.addStaffSalaryArray[i].staffSalaryPaidAmt = ""
    }

  }

  calculateSalary1(amt1: any, i: any) {
    if (this.addStaffSalaryArray[i].staffSalaryDate) {
      if (amt1 && Number(this.addStaffSalaryArray[i].staffSalaryTotalAmt)) {
        if (Number(this.addStaffSalaryArray[i].staffSalaryTotalAmt) > Number(this.addStaffSalaryArray[i].staffSalaryDeductionAmt)) {
          this.addStaffSalaryArray[i].staffSalaryPaidAmt = Number(this.addStaffSalaryArray[i].staffSalaryTotalAmt) - Number(this.addStaffSalaryArray[i].staffSalaryDeductionAmt)
        } else {
          alert("Deduction Salary should be less than Salary Amount");
          this.addStaffSalaryArray[i].staffSalaryDeductionAmt = ""
          this.addStaffSalaryArray[i].staffSalaryPaidAmt = ""
        }
      }
    } else {
      alert("Please Select Date")
      this.addStaffSalaryArray[i].staffSalaryDeductionAmt = ""
      this.addStaffSalaryArray[i].staffSalaryPaidAmt = ""

    }
  }

  submitStaffSalary() {
    if (this.fuelDealerId) {
      this.spinner.show()
      let data = {
        addStaffSalaryArray: this.addStaffSalaryArray,
        staffSalaryCreatedBy: this.userName,
        staffSalaryDealerId: this.fuelDealerId,

      }
      this.post.addStaffSalaryPOST(data).subscribe(res => {
        if (res.status == "OK") {
          alert("Salary Submitted Successfully!");
          this.getStaffSalary(this.fuelDealerId)
          this.clearAll()
          this.spinner.hide()
        }
        else {
          alert("Error To Submit")
          this.spinner.hide()
        }
      })
    } else {
      alert("Please Select Date!")
    }
  }

  clearAll() {
    this.isAddSalary = false;
    this.addStaffSalaryArray = [];
    this.addStaffSalaryData = [];
    this.getStaffArray()
  }

  editStaffsalary(editStaffSal: any, staffSalaryId: any, firstName: string, lastName: string, phone1: any, designation: any, staffSalaryDate: moment.MomentInput, staffSalaryTotalAmt: any, staffSalaryDeductionAmt: any, staffSalaryPaidAmt: any, staffSalaryDetails: any) {
    this.staffSalaryId = ""
    this.updatedStaffName = ""
    this.updatedMobileNumber = ""
    this.updatedRole = ""
    this.updatedSalaryDate = ""
    this.updatedSalaryTotalAmt = ""
    this.updatedSalaryDeductionAmt = ""
    this.updatedSalaryFinalAmt = ""
    this.updatedSalaryDetails = ""

    this.staffSalaryId = staffSalaryId
    this.updatedStaffName = firstName + " " + lastName
    this.updatedMobileNumber = phone1
    this.updatedRole = designation
    this.updatedSalaryDate = moment(staffSalaryDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY")
    this.updatedSalaryTotalAmt = staffSalaryTotalAmt
    this.updatedSalaryDeductionAmt = staffSalaryDeductionAmt
    this.updatedSalaryFinalAmt = staffSalaryPaidAmt
    this.updatedSalaryDetails = staffSalaryDetails


    this.modalUpdateReference = this.modalService.open(editStaffSal)
    this.modalUpdateReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteStaffSalary(staffSalaryId: any) {
    let data = {
      staffSalaryId: staffSalaryId,
      staffSalaryUpdatedBy: this.userName
    }
    if (confirm("Are you Sure to Delete?")) {
      this.spinner.show();
      this.post.deleteStaffSalaryPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            alert("Staff Salary Deleted Successfully!");
            this.getStaffSalary(this.fuelDealerId)
            this.spinner.hide()
          } else {
            this.spinner.hide()
          }
        })
    } else {
    }
  }

  calculateSal(amt: any) {
    if (this.updatedSalaryDate) {
      if (amt && Number(this.updatedSalaryDeductionAmt)) {
        if (Number(this.updatedSalaryTotalAmt) > Number(this.updatedSalaryDeductionAmt)) {
          this.updatedSalaryFinalAmt = Number(this.updatedSalaryTotalAmt) - Number(this.updatedSalaryDeductionAmt)
        } else {
          alert("Deduction Salary should be less than Salary Amount");
          this.updatedSalaryDeductionAmt = ""
          this.updatedSalaryFinalAmt = ""
        }
      }
    } else {
      alert("Please Select Date")
      this.updatedSalaryDeductionAmt = ""
      this.updatedSalaryFinalAmt = ""
    }
  }

  calculateSal1(amt1: any) {
    if (this.updatedSalaryDate) {
      if (amt1 && Number(this.updatedSalaryDeductionAmt)) {
        if (Number(this.updatedSalaryTotalAmt) > Number(this.updatedSalaryDeductionAmt)) {
          this.updatedSalaryFinalAmt = Number(this.updatedSalaryTotalAmt) - Number(this.updatedSalaryDeductionAmt)
        } else {
          alert("Deduction Salary should be less than Salary Amount");
          this.updatedSalaryDeductionAmt = ""
          this.updatedSalaryFinalAmt = ""
        }
      }
    } else {
      alert("Please Select Date")
      this.updatedSalaryDeductionAmt = ""
      this.updatedSalaryFinalAmt = ""
    }
  }

  updateStaffSalary(staffSalaryId: any) {
    this.spinner.show();
    let data = {
      staffSalaryId: staffSalaryId,
      staffSalaryUpdatedBy: this.userName,
      staffSalaryDate: moment(this.updatedSalaryDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      staffSalaryTotalAmt: this.updatedSalaryTotalAmt,
      staffSalaryDeductionAmt: this.updatedSalaryDeductionAmt,
      staffSalaryPaidAmt: this.updatedSalaryFinalAmt,
      staffSalaryDetails: this.updatedSalaryDetails
    }
    this.post.updateStaffSalaryPOST(data).subscribe(res => {
      if (res.status == "OK") {
        alert("Staff Salary Updated Successfully!")
        this.getStaffSalary(this.fuelDealerId)
        this.clearUpdateModel()
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

  clearUpdateModel() {
    this.staffSalaryId = ""
    this.updatedStaffName = ""
    this.updatedMobileNumber = ""
    this.updatedRole = ""
    this.updatedSalaryDate = ""
    this.updatedSalaryTotalAmt = ""
    this.updatedSalaryDeductionAmt = ""
    this.updatedSalaryFinalAmt = ""
    this.modalUpdateReference.close("close")
  }
}
