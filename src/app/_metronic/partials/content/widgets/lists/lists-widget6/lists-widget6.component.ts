import { ChangeDetectorRef, Component, Injectable, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { MixedService } from '../../mixed/mixed.services';
import { StatsService } from '../../stats/stats.services';
import { ListWidgetService } from '../listWidget.services';
import moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  selector: 'app-lists-widget6',
  templateUrl: './lists-widget6.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget6Component {
  shiftTimeForm = new FormGroup({
    shiftTimeFrom: new FormControl(''),
    shiftTimeTo: new FormControl(''),
    shiftName: new FormControl(''),
    fuelShiftTimeId: new FormControl(''),
  });

  userForm = new FormGroup({
    firstName: new FormControl(''),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    city: new FormControl('CITY'),
    role: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    password: new FormControl(''),
    state: new FormControl('STATE'),
    branchId: new FormControl(''),
  });

  reNewStaffForm = new FormGroup({
    mobileNumber: new FormControl(),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    role: new FormControl(''),
    city: new FormControl('CITY'),
    state: new FormControl('STATE'),
  });

  managerName: string;
  fuelDealerId: any;
  dealerCorporateId: any;
  dealerData: any = [];
  accessGroup: any;
  pumpCity: any;
  userId: any;
  selectedDate: any;
  todayDate = new Date();
  companyName: any;
  oilCompanyName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  brandName: any;
  isUpdate: boolean = false;
  modalRef: any;
  closeResult: string;
  fuelShiftTimeDetails: any = [];
  fuelShiftTimeDetailsTime: any = [];
  arrayLength: number;
  shiftTimeFromHrs: any;
  shiftTimeFromMin: any;
  shiftTimeToHrs: any;
  shiftTimeToMin: any;
  rowNumber: any;
  showBr: boolean = false;
  createdBy: string;
  modalReference: any;
  isNewUser: boolean;
  fuelDealerStaffIdForReNew: any;
  designation: string;
  stateCode: string;
  monthAlpha: string;
  dateCode: any;
  monthCode: number;
  yearCode: any;
  veelsUserTypePlusId: string;
  individualPanNumber: any;
  individualPanName: any;
  dealerLoginId: any;
  staffDetailsStaff: any = [];
  fuelDealerStaffIdUpdate: any;
  userIdUpdate: any;
  personIdUpdate: any;
  firstName: any;
  lastName: any;
  salary: any;
  modalReference1: any;
  accessGroupId: string;
  vpPersonId: any;
  transporterCorpId: any;
  staffDetailsForTransporter: any = [];
firstNameTransporter: any;
lastNameTransporter: any;
  personIdTransporter: any;
  addressIdTransporter: any;
  cityTransporter: any;

  constructor(
    private post: ListWidgetService,
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
    this.managerName = element.firstName + ' ' + element.lastName;
    this.userId = element.userId;
    this.dealerLoginId = element.veelsPlusCorporateID;
    this.createdBy = element.firstName + ' ' + element.lastName
    this.vpPersonId = element.veelsPlusId
    
    if (this.accessGroup == '12') {
      var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
      this.transporterCorpId = dealerData.corporateId
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
      this.transporterCorpId = managerData.corporateId
      this.companyName = managerData.companyName
      this.oilCompanyName = managerData.brandName
      this.brandName = managerData.brandName
      this.state = managerData.state
      this.pin = managerData.pin
      this.city = managerData.city
      this.phone1 = managerData.hostPhone
      this.pumpCity = managerData.city
    }

    this.getShiftDetailsTime(this.fuelDealerId)
    this.getStaffDetails(this.fuelDealerId)
    this.cd.detectChanges()
  }


  addNewNameModal(AddShiftName: any) {
    this.isUpdate = false;
    this.modalRef = this.modalService.open(AddShiftName, { size: 'md' });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  getShiftDetailsTime(dealerId: any) {
    this.fuelShiftTimeDetails.length = 0;
    let data = {
      fuelShiftTimeDealerId: dealerId
    }
    this.post.getFuelShiftTimeDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.fuelShiftTimeDetailsTime = res.data;
            this.arrayLength = Number(res.data.length) - 1;
          } else {
            this.fuelShiftTimeDetailsTime.length = 0;
            this.spinner.hide()
            this.cd.detectChanges()
          }
        }
        else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      })
  }

  getfuelShiftDetailById(fuelShiftTimeId: any, AddShiftName: any) {
    this.spinner.show()
    this.modalRef = this.modalService.open(AddShiftName, { size: 'md' });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
    let data = {
      fuelShiftTimeId: fuelShiftTimeId
    }
    this.post.getFuelShiftTimeDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.isUpdate = true;
            this.shiftTimeForm.controls['fuelShiftTimeId'].setValue(res.data[0].fuelShiftTimeId);
            this.shiftTimeFromHrs = ((res.data[0].fuelShiftTimeFrom).toString()).slice(0, 2)
            this.shiftTimeFromMin = ((res.data[0].fuelShiftTimeFrom).toString()).slice(3, 5)
            this.shiftTimeToHrs = ((res.data[0].fuelShiftTimeTo).toString()).slice(0, 2)
            this.shiftTimeToMin = ((res.data[0].fuelShiftTimeTo).toString()).slice(3, 5)
            this.shiftTimeForm.controls['shiftName'].setValue(res.data[0].fuelShiftTimeShiftName);
            this.spinner.hide()
          } else {
            this.shiftTimeFromHrs = ''
            this.shiftTimeFromMin = ''
            this.shiftTimeToHrs = ''
            this.shiftTimeToMin = ''
            this.shiftTimeForm.controls['fuelShiftTimeId'].setValue('');
            this.shiftTimeForm.controls['shiftTimeFrom'].setValue('');
            this.shiftTimeForm.controls['shiftTimeTo'].setValue('');
            this.shiftTimeForm.controls['shiftName'].setValue('');
            this.isUpdate = false;
            this.spinner.hide()
            this.cd.detectChanges()
          }
        }
        else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      })
  }

  deleteShiftTime(fuelShiftTimeId: any) {
    this.spinner.show()
    let data = {
      fuelShiftTimeId: fuelShiftTimeId,
    }
    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteFuelShiftTimeDetailsPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("shift time deleted successfully..")
            this.getShiftDetailsTime(this.fuelDealerId);
            this.spinner.hide()
            this.cd.detectChanges()
          } else {
            this.spinner.hide()
            this.cd.detectChanges()
          }
        })
    }
    else {
      this.spinner.hide()
      this.cd.detectChanges()
    }
  }

  submitShiftTime() {
    if (this.shiftTimeFromHrs || this.shiftTimeFromHrs == 0) {
      if (this.shiftTimeToHrs) {

        this.shiftTimeForm.controls["shiftTimeFrom"].setValue(moment(this.shiftTimeFromHrs + '-' + this.shiftTimeFromMin, ["HH:mm"]).format("HH:mm"))
        this.shiftTimeForm.controls["shiftTimeTo"].setValue(moment(this.shiftTimeToHrs + '-' + this.shiftTimeToMin, ["HH:mm"]).format("HH:mm"))
        if (this.shiftTimeForm.value.shiftTimeFrom != 'Invalid date' && this.shiftTimeForm.value.shiftTimeTo != 'Invalid date') {
          this.spinner.show()
          let data = {
            fuelShiftTimeDealerId: this.fuelDealerId,
            fuelShiftTimeCreatedBy: this.createdBy,
            fuelShiftTimeDetails: this.shiftTimeForm.value.shiftTimeFrom + ' To ' + this.shiftTimeForm.value.shiftTimeTo,
            fuelShiftTimeShiftName: this.shiftTimeForm.value.shiftName,
            fuelShiftTimeFrom: this.shiftTimeForm.value.shiftTimeFrom,
            fuelShiftTimeTo: this.shiftTimeForm.value.shiftTimeTo,

          }
          this.post.addFuelShiftTimeDetailsPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                alert("Shift Time Details Added successfully..")
                this.getShiftDetailsTime(this.fuelDealerId);
                this.shiftTimeForm.reset();
                this.shiftTimeForm.controls["shiftName"].setValue("")
                this.shiftTimeFromHrs = ''
                this.shiftTimeFromMin = ''
                this.shiftTimeToHrs = ''
                this.shiftTimeToMin = ''
                this.modalRef.close('close');

                this.spinner.hide()
              }
              else {
                alert("Error to Add Details..")
                this.spinner.hide()
              }
            })
        } else {
          alert("please select or enter valid time")
        }

      } else {
        alert("please enter shift time To")
      }
      this.cd.detectChanges()
    } else {
      alert("please select shift time From")
      this.cd.detectChanges()
    }

  }


  updateShiftTime() {
    if (this.shiftTimeFromHrs || this.shiftTimeFromHrs == 0) {
      if (this.shiftTimeToHrs) {
        this.shiftTimeForm.controls["shiftTimeFrom"].setValue(moment(this.shiftTimeFromHrs + '-' + this.shiftTimeFromMin, ["HH:mm"]).format("HH:mm"))
        this.shiftTimeForm.controls["shiftTimeTo"].setValue(moment(this.shiftTimeToHrs + '-' + this.shiftTimeToMin, ["HH:mm"]).format("HH:mm"))
        if (this.shiftTimeForm.value.shiftTimeFrom != 'Invalid date' && this.shiftTimeForm.value.shiftTimeTo != 'Invalid date') {

          this.spinner.show()
          let data = {
            fuelShiftTimeId: this.shiftTimeForm.value.fuelShiftTimeId,
            fuelShiftTimeDetails: this.shiftTimeForm.value.shiftTimeFrom + ' To ' + this.shiftTimeForm.value.shiftTimeTo,
            fuelShiftTimeShiftName: this.shiftTimeForm.value.shiftName,
            fuelShiftTimeFrom: this.shiftTimeForm.value.shiftTimeFrom,
            fuelShiftTimeTo: this.shiftTimeForm.value.shiftTimeTo,
          }
          this.post.updateFuelShiftTimeDetailsPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                alert("Shift Time Details Updated successfully..")
                this.getShiftDetailsTime(this.fuelDealerId);
                this.isUpdate = false;
                this.shiftTimeForm.reset();
                this.shiftTimeForm.controls["shiftName"].setValue("")
                this.shiftTimeFromHrs = ''
                this.shiftTimeFromMin = ''
                this.shiftTimeToHrs = ''
                this.shiftTimeToMin = ''
                this.modalRef.close('close');
                this.spinner.hide()
              }
              else {
                alert("Error to Update Details..")
                this.spinner.hide()
              }
            })
        } else {
          alert("please select or enter valid time")
        }
      } else {
        alert("please enter shift time To")
      }
      this.cd.detectChanges()
    } else {
      alert("please select shift time From")
    }
    this.cd.detectChanges()
  }

  cancel() {
    this.shiftTimeForm.reset()
    this.isUpdate = false;
    this.shiftTimeForm.controls["shiftName"].setValue("")
    this.shiftTimeFromHrs = ''
    this.shiftTimeFromMin = ''
    this.shiftTimeToHrs = ''
    this.shiftTimeToMin = ''
    this.modalRef.close('close');
  }

  openAddUser(addUser: any) {
    this.modalReference = this.modalService.open(addUser)
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

  checkuserPhoneNumber() {
    let data = {
      phone: this.userForm.value.phoneNumber
    }
    this.post.findPhoneNumberPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.checkStaffDetails()
          this.cd.detectChanges()
        }
        else {
          this.isNewUser = true;
          this.cd.detectChanges()
        }
      })
  }

  checkStaffDetails() {
    this.spinner.show()
    let data = {
      phone: this.userForm.value.phoneNumber,
    }
    this.post.checkStaffDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.isNewUser = false;
          this.reNewStaffForm.controls["mobileNumber"].setValue(this.userForm.value.phoneNumber);
          this.fuelDealerStaffIdForReNew = res.data[0].fuelDealerStaffId;
          this.reNewStaffForm.controls["firstName"].setValue(res.data[0].firstName);
          this.reNewStaffForm.controls["lastName"].setValue(res.data[0].lastName);
          this.reNewStaffForm.controls["email"].setValue(res.data[0].email1);
          this.reNewStaffForm.controls["role"].setValue(res.data[0].designation);
          this.reNewStaffForm.controls["city"].setValue(res.data[0].city);
          this.reNewStaffForm.controls["state"].setValue(res.data[0].state);
          this.spinner.hide();
          this.cd.detectChanges()
        }
        else {
          alert("This User Already Mapped with Another Dealer!");
          this.userForm.reset({ 'phoneNumber': '' })
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  fuelStaffRegister() {
    var payment;
    this.spinner.show()
    this.createCorporateId()
    if (this.userForm.value.role == "13") {
      this.designation = "OPERATOR",
        payment = "unpaid"
    }
    if (this.userForm.value.role == "14") {
      this.designation = "MANAGER",
        payment = "waiveOff"
    }

    let data = {
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      phone1: this.userForm.value.phoneNumber,
      email1: this.userForm.value.email,
      kycStatus: "Accept",
      payUserStatus: payment,
      veelsUserTypePlusId: this.veelsUserTypePlusId,
      password: "1234",
      accessGroupId: this.userForm.value.role,
      designation: this.designation,
      fuelDealerId: this.fuelDealerId,
      // veelsPlusCorporateID: this.FuelVeelsVendorID,
      state: this.userForm.value.state,
      city: this.userForm.value.city,
      individualPancardNumber: this.individualPanNumber,
      individualPanName: this.individualPanName,
    }

    this.post.fuelStaffRegisterPOST(data).subscribe(result => {
      if (result.status == "OK") {
        alert("Staff Added Successfully!")
        if (this.userForm.value.role == "14") {
          this.addDealerStaffAccess(result.personId)
        }
        this.spinner.hide();
        this.getStaffDetails(this.fuelDealerId)
        this.userForm.reset();
        this.modalReference.close('close')
        this.userForm.controls["state"].setValue(this.state);
        this.userForm.controls["city"].setValue(this.city);
      } else {
        alert("Error to Add Staff!")
        this.spinner.hide();
        this.modalReference.close('close')
      }
    })
  }

  createCorporateId() {
    this.createStateCode();
    this.dateCode = new Date();
    this.monthCode = this.dateCode.getMonth() + 1;

    switch (this.monthCode) {
      case 1:
        this.monthAlpha = 'A'
        break;
      case 2:
        this.monthAlpha = 'B'

        break;

      case 3:
        this.monthAlpha = 'C'
        break;

      case 4:
        this.monthAlpha = 'D'
        break;

      case 5:
        this.monthAlpha = 'E'
        break;
      case 6:
        this.monthAlpha = 'F'

        break;

      case 7:
        this.monthAlpha = 'G'
        break;

      case 8:
        this.monthAlpha = 'H'
        break;
      case 9:
        this.monthAlpha = 'I'

        break;

      case 10:
        this.monthAlpha = 'J'
        break;

      case 11:
        this.monthAlpha = 'K'
        break;

      case 12:
        this.monthAlpha = 'L'
        break;


    }
    this.yearCode = ((this.dateCode.getYear()).toString()).slice(1, 3);

    this.veelsUserTypePlusId = "VP" + this.stateCode + this.userForm.value.role + this.monthAlpha + this.yearCode;
  }

  createStateCode() {

    switch (this.userForm.value.state) {


      case 'ANDHRA PRADESH':
        this.stateCode = '01'
        break;
      case 'ARUNACHAL PRADESH':
        this.stateCode = '02'

        break;
      case 'ASSAM':
        this.stateCode = '03'

        break;
      case 'BIHAR':
        this.stateCode = '04'

        break;
      case 'CHHATTISGARH':
        this.stateCode = '05'

        break;
      case 'GOA':
        this.stateCode = '06'

        break;
      case 'GUJARAT':
        this.stateCode = '07'

        break;

      case 'HARYANA':
        this.stateCode = '08'

        break;

      case 'HIMACHAL PRADESH':
        this.stateCode = '09'

        break;
      case 'JHARKHAND':
        this.stateCode = '10'

        break;
      case 'KARNATAKA':
        this.stateCode = '11'
        break;

      case 'KERALA':
        this.stateCode = '12'
        break;

      case 'MADHYA PRADESH':
        this.stateCode = '13'
        break;

      case 'MAHARASHTRA':
        this.stateCode = '14'
        break;

      case 'MANIPUR':
        this.stateCode = '15'
        break;

      case 'MEGHALAYA':
        this.stateCode = '16'
        break;
      case 'MIZORAM':
        this.stateCode = '17'
        break;
      case 'NAGALAND':
        this.stateCode = '18'
        break;
      case 'ODISHA':
        this.stateCode = '19'
        break;
      case 'PUNJAB':
        this.stateCode = '20'
        break;
      case 'RAJASTHAN':
        this.stateCode = '21'
        break;
      case 'SIKKIM':
        this.stateCode = '22'
        break;
      case 'TAMIL NADU':
        this.stateCode = '23'
        break;
      case 'TELANGANA':
        this.stateCode = '24'
        break;
      case 'TRIPURA':
        this.stateCode = '25'
        break;
      case 'UTTAR PRADESH':
        this.stateCode = '26'
        break;
      case 'UTTARAKHAND':
        this.stateCode = '27'
        break;
      case 'WEST BENGAL':
        this.stateCode = '28'
        break;
      case 'ANDAMAN AND NICOBAR ISLANDS':
        this.stateCode = '29'
        break;
      case 'CHANDIGARH':
        this.stateCode = '30'
        break;
      case 'DADRA AND NAGAR HAVELI AND DAMAN AND DIU':
        this.stateCode = '31'
        break;
      case 'DELHI':
        this.stateCode = '32'
        break;
      case 'LAKSHADWEEP':
        this.stateCode = '33'
        break;
      case 'PUDUCHERRY':
        this.stateCode = '34'
        break;
      case 'JAMMU AND KASHMIR':
        this.stateCode = '35'
        break;
      case 'LADAKH':
        this.stateCode = '36'
        break;
      default:
        this.stateCode = '00'
        break;
    }
  }

  addDealerStaffAccess(staffPersonId: any) {
    let data = {
      staffPersonId: staffPersonId,
      fuelDealerId: this.fuelDealerId,
      creditPayment: 'TRUE',
      outstanding: 'TRUE',
      fuelStatement: 'TRUE',
      fuelStaff: 'TRUE',
      fuelAddCustomer: 'TRUE',
      createdAt: new Date(),
      createdBy: this.dealerLoginId
    }
    this.post.addDealerStaffAccessPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.spinner.hide();
        }

      })
  }

  getStaffDetails(fuelDealerId: any) {
    this.staffDetailsStaff = []
    let data = {
      fuelDealerId: fuelDealerId,
    }

    this.post.getStaffDetailsPOST(data)
      .subscribe(res => {
        if (res) {
          this.staffDetailsStaff = res.data
          this.designation = res.data[0].designation;
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  renewMappingStaff() {
    this.spinner.show()
    let data = {
      fuelDealerStaffId: this.fuelDealerStaffIdForReNew,
      fuelDealerId: this.fuelDealerId,
    }
    this.post.renewMappingStaffPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.spinner.hide();
          alert("Staff Added successfully!")
          this.getStaffDetails(this.fuelDealerId);
          this.reNewStaffForm.reset();
          this.userForm.reset();
          this.modalReference.close('close')
          this.userForm.controls["state"].setValue(this.state);
          this.userForm.controls["city"].setValue(this.city);
          this.cd.detectChanges()
        }
        else {
          this.spinner.hide();
          this.modalReference.close('close')
          this.cd.detectChanges()
        }
      })
  }

  closeReNew() {
    this.reNewStaffForm.reset();
    this.userForm.reset();
    this.modalReference.close('close')
    this.userForm.controls["state"].setValue(this.state);
    this.userForm.controls["city"].setValue(this.city);
  }

  noUpdateMapp(status: any, fuelDealerStaffId: any, dealerMapStatus: string) {
    if (dealerMapStatus != "MAPPED") {
      if (status.target.checked) {
        // console.log(status.target.checked);
        // console.log(fuelDealerStaffId);
        alert("Error to Update Mapping!")
        this.getStaffDetails(this.fuelDealerId)
      }
    }
    else {
      alert("Error to Update Mapping!")
      this.getStaffDetails(this.fuelDealerId)
    }
  }

  updateMapping(status: any, fuelDealerStaffId: any, dealerMapStatus: string) {
    if (dealerMapStatus != "MAPPED") {
      this.spinner.show()
      if (status.target.checked) {
        dealerMapStatus = "MAPPED";

        let data = {
          dealerMapStatus: dealerMapStatus,
          fuelDealerStaffId: fuelDealerStaffId,
        }

        this.post.updateMapStatusforStaffPOST(data)
          .subscribe(res => {
            if (res) {
              alert("Mapping Status Updated to MAPPED!")
              this.spinner.hide();
              this.getStaffDetails(this.fuelDealerId)
              this.cd.detectChanges()
            }
            else {
              alert("Error to Update Mapping!")
              this.spinner.hide();
              this.getStaffDetails(this.fuelDealerId)
              this.cd.detectChanges()
            }

          })
      }
    } else {
      this.spinner.show()
      dealerMapStatus = "UNMAPPED";

      let data = {
        dealerMapStatus: dealerMapStatus,
        fuelDealerStaffId: fuelDealerStaffId,
        fuelDealerId: this.fuelDealerId,
      }

      this.post.updateMapStatusforStaffPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Mapping Status Updated to UNMAPPED!")
            this.getStaffDetails(this.fuelDealerId)
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            alert("Error to Update Mapping!")
            this.spinner.hide();
            this.getStaffDetails(this.fuelDealerId)
            this.cd.detectChanges()
          }

        })
    }
  }

  staffEdit(updateStaff: any, fuelDealerStaffId: any, userId: any, personId: any, firstName: any, lastName: any, designation: string, salary: any) {
    this.fuelDealerStaffIdUpdate = fuelDealerStaffId,
      this.userIdUpdate = userId,
      this.personIdUpdate = personId,
      this.firstName = firstName,
      this.lastName = lastName,
      this.designation = designation
    this.salary = salary
    this.modalReference1 = this.modalService.open(updateStaff, { size: 'lg' });

    this.modalReference1.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  UpdateDealerStaffDetails() {
    if (this.lastName && this.firstName) {
      if (this.designation == 'OPERATOR') {
        this.accessGroupId = '13'
      }
      if (this.designation == 'MANAGER') {
        this.accessGroupId = '14'
      }

      let data = {
        fuelDealerStaffId: this.fuelDealerStaffIdUpdate,
        userId: this.userIdUpdate,
        personId: this.personIdUpdate,
        firstName: this.firstName,
        lastName: this.lastName,
        designation: this.designation,
        accessGroupId: this.accessGroupId,
        salary: this.salary,
      }
      this.post.UpdateDealerStaffDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            alert("Staff details update successfully!")
            this.modalReference1.close('close')
            this.switchedToStaff(this.personIdUpdate, this.accessGroupId)
            this.getStaffDetails(this.fuelDealerId);
          }
          else {
            this.spinner.hide();
            this.modalReference1.close('close')
            alert("Error to update staff details!")

          }
        })
    } else {
      alert("Please Enter Name")
    }

  }

  switchedToStaff(personId: any, accessGroupId: string) {
    let date = new Date();
    let data = {
      personId: personId,
      fuelDealerId: this.fuelDealerId,
      createdAt: moment(date).format('DD-MM-YYYY HH:mm:ss'),
      createdBy: this.vpPersonId,
      accessGroupId: accessGroupId
    }

    this.post.switchedToStaffPOST(data)
      .subscribe(res => {

      })
  }
  
  closeModalEditStaff() {
    this.modalReference1.close('close');
  }
  
openAddUserForTransporter(addTransUser: any) {
  this.modalReference = this.modalService.open(addTransUser)
  this.modalReference.result.then((result: any) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason: any) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

transporterStaffRegister() {
  var payment;
  this.spinner.show()
  this.createCorporateId()
  if (this.userForm.value.role == "16") {
    this.designation = "MANAGER",
      payment = "waiveOff"
  }

  let data = {
    firstName: this.userForm.value.firstName,
    lastName: this.userForm.value.lastName,
    phone1: this.userForm.value.phoneNumber,
    email1: this.userForm.value.email,
    kycStatus: "Accept",
    payUserStatus: payment,
    veelsUserTypePlusId: this.veelsUserTypePlusId,
    password: "1234",
    accessGroupId: this.userForm.value.role,
    designation: this.designation,
    // veelsPlusCorporateID: this.FuelVeelsVendorID,
    state: this.userForm.value.state,
    city: this.userForm.value.city,
    individualPancardNumber: this.individualPanNumber,
    individualPanName: this.individualPanName,
    corporateId:this.transporterCorpId,
    createdAt: new Date(),
    createdBy:this.vpPersonId
  }

  this.post.transporterStaffRegisterPOST(data).subscribe(result => {
    if (result.status == "OK") {
      alert("Staff Added Successfully!")
    this.spinner.hide();
      this.getStaffDetailsForTransporter(this.transporterCorpId)
      this.userForm.reset();
      this.modalReference.close('close')
      this.userForm.controls["state"].setValue(this.state);
      this.userForm.controls["city"].setValue(this.city);
    } else {
      alert("Error to Add Staff!")
    this.spinner.hide();
      this.modalReference.close('close')
    }
  })
}

getStaffDetailsForTransporter(corporateId: any) {
  let data = {
    corporateId: corporateId,
  }

  this.post.getStaffDetailsForTransporterPOST(data)
    .subscribe(res => {
      if (res) {
        this.staffDetailsForTransporter = res.data
      this.spinner.hide();
      } else {
     this.spinner.hide();
      }
    })
}


staffEditForTransporter(updateTransporterStaff: any,addressId: any,personId: any,firstName: any,lastName: any,city: any){

  this.addressIdTransporter = addressId,
  this.personIdTransporter = personId,
  this.firstNameTransporter = firstName,
  this.lastNameTransporter = lastName,
  this.cityTransporter = city

  this.modalReference1 = this.modalService.open(updateTransporterStaff, {size:'lg'});
 
  this.modalReference1.result.then((result: any) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason: any) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

UpdateTransporterStaffDetails(){
  this.spinner.show()
   let data = {
     addressId: this.addressIdTransporter,
     personId: this.personIdTransporter ,
     firstName:this.firstNameTransporter,
     lastName:this.lastNameTransporter,
     city:this.cityTransporter
   }
   this.post.updateStafForTransporterPOST(data)
       .subscribe(res => {
         if (res.status=="OK") {
           alert(res.msg)
           this.getStaffDetailsForTransporter(this.transporterCorpId)
          this.spinner.hide();
         }
 
       })
 }
 
updateMappingForTransporter(status: any, userId: any, mappedStatus: string) {

  this.spinner.show()
  if (mappedStatus != "MAPPED") {
    if (status.target.checked) {
      // console.log(status.target.checked);
      // console.log(mappedStatus);
      mappedStatus = "MAPPED";
      let data = {
        userId: userId,
        mappedStatus: mappedStatus

      }
      this.post.updateMappingStatusForTransporterPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Mapping Status Updated to MAPPED!")
         this.spinner.hide();
            this.getStaffDetailsForTransporter(this.transporterCorpId)
          }
          else {
            alert("Error to Update Mapping!")
         this.spinner.hide();
            this.getStaffDetailsForTransporter(this.transporterCorpId)
          }

        })
    }
  } else {
    mappedStatus = "UNMAPPED";

    let data = {
      mappedStatus: mappedStatus,
      userId: userId
    }

    this.post.updateMappingStatusForTransporterPOST(data)
      .subscribe(res => {
        if (res) {
          alert("Mapping Status Updated to UNMAPPED!")
          this.getStaffDetailsForTransporter(this.transporterCorpId)
        this.spinner.hide();
        }

        else {
          alert("Error to Update Mapping!")
        this.spinner.hide();
          this.getStaffDetailsForTransporter(this.transporterCorpId)
        }

      })
  }

}
}
