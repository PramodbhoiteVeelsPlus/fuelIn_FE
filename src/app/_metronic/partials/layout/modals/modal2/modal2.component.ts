import { ChangeDetectorRef, Component, Injectable, Input, TemplateRef, ViewChild } from '@angular/core';
import { ModalConfig } from '../modal.config';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalsService } from '../modals.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  selector: 'app-modal2',
  templateUrl: './modal2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ],
})
export class Modal2Component {
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<Modal2Component>;
  private modalRef: NgbModalRef;
  mobile: any;
  firstName: any;
  lastName: any;
  role: any = "";
  dealerLoginVPId: any;
  accessGroupId: any;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: string;
  isNewUser: boolean = true;
  isvalidPhone: boolean = false;

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
    mobileNumber: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    role: new FormControl(''),
    city: new FormControl('CITY'),
    state: new FormControl('STATE'),
  });
  fuelDealerStaffIdForReNew: any;
  designation: string;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  dateCode: any;
  monthAlpha: string;
  monthCode: number;
  yearCode: any;
  veelsUserTypePlusId: string;
  stateCode: string;
  modalReference: any;
  FuelVeelsVendorID: any;
  city: any;
  state: any;
  mobileNumber: any;
  dealerCorporateId: any;

  constructor(
    private post: ModalsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef, private modalService: NgbModal, private router: Router,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = dealerData.fuelDealerId;
    this.dealerCorporateId = dealerData.corporateId;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.accessGroupId = element.accessGroupId;
    this.managerVPPersonId = element.veelsPlusId;
    this.managerPersonId = element.personId;
    this.managerName = element.firstName + " " + element.lastName;
    // this.getCorporateById(this.dealerLoginVPId);
    this.getfuelDealerIdByCorporateId(this.dealerCorporateId)
    this.cd.detectChanges()
  }

  // get Corporate DetailsBy VP-Id
  getCorporateById(dealerLoginVPId: any) {
    let data = {
      veelsplusCorporateId: dealerLoginVPId
    }
    this.post.getBranchByVeelsplusIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.loginSQLCorporateId = res.data[0].corporateId;
            this.FuelVeelsVendorID = res.data[0].veelsPlusBranchID;
            this.getfuelDealerIdByCorporateId(this.loginSQLCorporateId);
            this.cd.detectChanges()
          }
          else {
            alert("Getting Error..! Please Logout & Login again..!")
            this.cd.detectChanges()
          }
        }
      })
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
          // this.getProductsByDealerId(this.fuelDealerId);
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
        }
      })
  }

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent);
      this.modalRef.result.then(resolve, resolve);
    });
  }
  async close(): Promise<void> {
    if (
      this.modalConfig.shouldClose === undefined ||
      (await this.modalConfig.shouldClose())
    ) {
      const result =
        this.modalConfig.onClose === undefined ||
        (await this.modalConfig.onClose());
      this.modalRef.close(result);
    }
  }
  async dismiss(): Promise<void> {
    if (this.modalConfig.disableDismissButton !== undefined) {
      return;
    }
    if (
      this.modalConfig.shouldDismiss === undefined ||
      (await this.modalConfig.shouldDismiss())
    ) {
      const result =
        this.modalConfig.onDismiss === undefined ||
        (await this.modalConfig.onDismiss());
      this.modalRef.dismiss(result);
    }
  }

  submit() {
    console.log("Submitted")
  }

  checkuserPhoneNumber() {
    let data = {
      phone: this.userForm.value.phoneNumber
    }
    this.post.findPhoneNumberPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.checkStaffDetails()
        }
        else {
          this.isNewUser = true;
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
          this.mobileNumber = this.userForm.value.phoneNumber
          this.reNewStaffForm.controls["mobileNumber"].setValue(this.mobileNumber);
          this.fuelDealerStaffIdForReNew = res.data[0].fuelDealerStaffId;
          this.reNewStaffForm.controls["firstName"].setValue(res.data[0].firstName);
          this.reNewStaffForm.controls["lastName"].setValue(res.data[0].lastName);
          this.reNewStaffForm.controls["email"].setValue(res.data[0].email1);
          this.reNewStaffForm.controls["role"].setValue(res.data[0].designation);
          this.reNewStaffForm.controls["city"].setValue(res.data[0].city);
          this.reNewStaffForm.controls["state"].setValue(res.data[0].state);
          this.spinner.hide();
        }
        else {
          alert("This User Already Mapped with Another Dealer!");
          this.userForm.reset({ 'phoneNumber': '' })
          this.spinner.hide();
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


  fuelStaffRegister() {
    var payment;
    this.spinner.show()
    this.createCorporateId()
    if (this.userForm.value.role == "13") {
      this.designation = "OPERATOR",
        payment = "unpaid"
    }
    if (this.userForm.value.role == "14" || this.userForm.value.role == "21") {
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
      veelsPlusCorporateID: this.FuelVeelsVendorID,
      state: this.userForm.value.state,
      city: this.userForm.value.city,
    }
console.log(data)
    // this.post.fuelStaffRegisterPOST(data).subscribe(result => {
    //   if (result.status == "OK") {
    //     alert("Staff Added Successfully!")
    //     if (this.userForm.value.role == "14" || this.userForm.value.role == "21") {
    //       this.addDealerStaffAccess(result.personId)
    //     }
    //     this.spinner.hide();
    //     // this.getStaffDetails(this.fuelDealerId)
    //     this.userForm.reset();
    //     this.modalReference.close('close')
    //     this.userForm.controls["state"].setValue(this.state);
    //     this.userForm.controls["city"].setValue(this.city);
    //     this.router.navigate(['/pumpDashboard'])
    //   } else {
    //     alert("Error to Add Staff!")
    //     this.spinner.hide();
    //     this.modalReference.close('close')
    //   }
    // })
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
      createdBy: this.dealerLoginVPId
    }
    this.post.addDealerStaffAccessPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {

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
          // this.getStaffDetails(this.fuelDealerId);
          this.reNewStaffForm.reset();
          this.userForm.reset();
          this.modalReference.close('close')
          this.userForm.controls["state"].setValue(this.state);
          this.userForm.controls["city"].setValue(this.city);
        }
        else {
          this.spinner.hide();
          this.modalReference.close('close')
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
}
