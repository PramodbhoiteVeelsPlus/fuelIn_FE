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
  selector: 'app-lists-widget9',
  templateUrl: './lists-widget9.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget9Component {

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
    this.getAttendance(this.fuelDealerId)
    this.getStaffDetails(this.fuelDealerId)
    this.cd.detectChanges()
  }

  openAddAttendance(addAtt: any) {
    this.modalReference = this.modalService.open(addAtt)
    this.modalReference.result.then((result: any) => {
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

  view() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.spinner.show();
      this.attendanceData.length = 0
      let data = {
        attendanceDealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post.getAttendanceListPOST(data)
        .subscribe(res => {
          if (res.status == 'OK' && res.data.length) {
            this.attendanceData = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          }
          else {
            alert("Data Not Found");
            this.filterForm.reset();
            this.getAttendance(this.fuelDealerId);
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
    }
  }

  getAttendance(fuelDealerId: any) {
    this.spinner.show();
    this.attendanceData = [];
    let data = {
      dealerId: fuelDealerId
    }
    this.post.getAttendancePOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.attendanceData = res.data;
          this.spinner.hide();
          this.cd.detectChanges()
        }
        else {
          this.attendanceData = [];
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getAttendance(this.fuelDealerId);
  }

  editAttendance(editAtt: any, attendanceId: any, firstName: string, lastName: string, phone1: any, designation: any, attendanceStatus: string, attendanceDate: moment.MomentInput, attendanceUpdatedReason: any) {
    this.attendanceId = ""
    this.updateStaffName = ""
    this.updateMobileNumber = ""
    this.updateRole = ""
    this.updateAttendanceStatus = ""
    this.updateAttendanceDate = ""
    this.isUpdatePresent = false;
    this.isAttendance = false;
    this.isAbsent = false;
    this.updateReason = '';

    this.attendanceId = attendanceId
    this.updateStaffName = firstName + " " + lastName
    this.updateMobileNumber = phone1
    this.updateRole = designation
    this.updateAttendanceStatus = attendanceStatus
    this.updateAttendanceDate = moment(attendanceDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY")
    this.updateReason = attendanceUpdatedReason

    if (attendanceStatus == "P") {
      this.isUpdatePresent = true
      this.isAbsent = false
      this.isAttendance = false
    } else {
      if (attendanceStatus == "A") {
        this.isUpdatePresent = false
        this.isAbsent = true
        this.isAttendance = false
      } else {
        this.isUpdatePresent = false
        this.isAbsent = false
        this.isAttendance = true
      }
    }

    this.modalUpdateReference = this.modalService.open(editAtt)
    this.modalUpdateReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteAttendance(attendanceId: any) {
    let data = {
      attendanceId: attendanceId,
      attendanceUpdatedBy: this.userName
    }
    if (confirm("Are you sure to delete ? ")) {
      this.spinner.show()
      this.post.deleteAttendancePOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("Attendance deleted successfully..!");
            this.getAttendance(this.fuelDealerId)
            this.spinner.hide()
          } else {
            this.spinner.hide()
          }
        })
    } else {
    }
  }

  getStaffDetails(fuelDealerId: any) {
    this.staffData = [];
    this.addAttendanceData = [];
    let data = {
      dealerId: fuelDealerId
    }
    this.post.getStaffDetailsDataPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.staffData = res.data;
          this.getStaffArray()

        }
        else {
          this.staffData = [];
          this.addAttendanceData = [];
        }
      })
  }

  getStaffArray() {
    this.staffData.map((res1: { fuelDealerStaffId: string; firstName: string; lastName: string; designation: string; phone1: string; }) => {
      const dataJSON = {
        attendanceStatus: "",
        attendanceDealerStaffId: "",
        isSelected: false,
        isPresent: false,
        isAbsent: false,
        staffName: "",
        role: "",
        mobilenumber: ""
      }
      dataJSON.attendanceDealerStaffId = res1.fuelDealerStaffId;
      dataJSON.staffName = res1.firstName + " " + res1.lastName;
      dataJSON.role = res1.designation;
      dataJSON.mobilenumber = res1.phone1;

      this.addAttendanceData.push(dataJSON);
    })

    this.addAttendanceArray = this.addAttendanceData;
  }

  isP(i: string | number) {
    if (this.addAttendanceArray[i].isPresent) {
      this.addAttendanceArray[i].isSelected = false;
      this.addAttendanceArray[i].isPresent = false;
      this.addAttendanceArray[i].attendanceStatus = "";
      // console.log("Status", this.addAttendanceArray[i].attendanceStatus)
    } else {
      this.addAttendanceArray[i].isSelected = true;
      this.addAttendanceArray[i].isPresent = true;
      this.addAttendanceArray[i].isAbsent = false;
      this.addAttendanceArray[i].attendanceStatus = "P";
      // console.log("Status", this.addAttendanceArray[i].attendanceStatus)
    }
  }

  isA(i: string | number) {
    if (this.addAttendanceArray[i].isAbsent) {
      this.addAttendanceArray[i].isSelected = false;
      this.addAttendanceArray[i].isAbsent = false;
      this.addAttendanceArray[i].attendanceStatus = "";
      // console.log("Status", this.addAttendanceArray[i].attendanceStatus)
    } else {
      this.addAttendanceArray[i].isSelected = true;
      this.addAttendanceArray[i].isPresent = false;
      this.addAttendanceArray[i].isAbsent = true;
      this.addAttendanceArray[i].attendanceStatus = "A";
      // console.log("Status", this.addAttendanceArray[i].attendanceStatus)
    }
  }

  submitAttendance() {
    if (this.selectedDate && this.fuelDealerId) {
      this.spinner.show()
      let data = {
        addAttendanceArray: this.addAttendanceArray,
        attendanceCreatedBy: this.userName,
        attendanceDealerId: this.fuelDealerId,
        attendanceDate: moment(this.selectedDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      }
      this.post.addAttendancePOST(data).subscribe(res => {
        if (res.status == "OK") {
          alert("Attendance Submitted Successfully!");
          this.getAttendance(this.fuelDealerId)
          this.clearModal()
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

  clearModal() {
    this.addAttendanceArray = [];
    this.addAttendanceData = [];
    this.modalReference.close('close')
    this.getStaffArray()
    this.selectedDate = moment(new Date()).format("DD-MM-YYYY")
  }

  isUpdateP() {
    if (!this.isUpdatePresent) {
      this.isUpdatePresent = true;
      this.isAttendance = false;
      this.updateAttendanceStatus = "P"
      this.isAbsent = false;
    } else {
      this.isUpdatePresent = false;
      this.isAttendance = true;
      this.isAbsent = false;
      this.updateAttendanceStatus = ""
    }
  }

  isUpdateA() {
    if (!this.isAbsent) {
      this.isAbsent = true;
      this.isAttendance = false;
      this.updateAttendanceStatus = "A"
      this.isUpdatePresent = false;
    } else {
      this.isUpdatePresent = false;
      this.isAttendance = true;
      this.isAbsent = false;
      this.updateAttendanceStatus = ""
    }
  }

  updateAttendance(attendanceId: any) {
    this.spinner.show()
    let data = {
      attendanceId: attendanceId,
      attendanceUpdatedBy: this.userName,
      attendanceStatus: this.updateAttendanceStatus,
      attendanceDate: moment(this.updateAttendanceDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      attendanceUpdatedReason: this.updateReason
    }
    this.post.updateAttendancePOST(data).subscribe(res => {
      if (res.status == "OK") {
        alert("Attendance Updated Successfully!")
        this.getAttendance(this.fuelDealerId)
        this.clearUpdateModal()
        this.spinner.hide()
      } else {
        this.spinner.hide()
      }
    })
  }

  clearUpdateModal() {
    this.attendanceId = ""
    this.updateStaffName = ""
    this.updateMobileNumber = ""
    this.updateRole = ""
    this.updateAttendanceStatus = ""
    this.updateAttendanceDate = ""
    this.isUpdatePresent = false;
    this.isAttendance = false;
    this.isAbsent = false;
    this.updateReason = '';
    this.modalUpdateReference.close('close')
  }
}
