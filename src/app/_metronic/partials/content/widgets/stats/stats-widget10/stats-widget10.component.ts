import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StatsService } from '../stats.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  selector: 'app-stats-widget10',
  templateUrl: './stats-widget10.component.html',
  styleUrl: './stats-widget10.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class StatsWidget10Component {
  localStoragecorporateId: any;
  acceesGroup: any;
  editCustDetails: boolean = false;
  editAddressDetails: boolean = false;
  editOtherDetails: boolean = false;

  customerForm = new FormGroup({
    businessType: new FormControl('', Validators.required),
    companyName: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    mobile: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    fullName: new FormControl('', Validators.required)
  });

  corporateForm = new FormGroup({
    GSTNumber: new FormControl('', Validators.required),
    numberOfBranches: new FormControl(''),
    website: new FormControl(''),
    numberOfEmployee: new FormControl(''),
    hostName: new FormControl(''),
    hostPhone: new FormControl(''),
    logo: new FormControl(''),
  });

  infoForm = new FormGroup({
    address1: new FormControl(''),
    address2: new FormControl(''),
    state: new FormControl(''),
    email2: new FormControl(''),
    pinCode: new FormControl(''),
    country: new FormControl(''),
    phone2: new FormControl(''),
    city: new FormControl(''),
    cityArea: new FormControl(''),
  });

  kycForm = new FormGroup({
    transporterBusinessType: new FormControl(""),
    identityDocName: new FormControl("PAN CARD"),
    businessDocType: new FormControl("GST Certificate"),
    identityAddressType: new FormControl(""),
    otherDocType: new FormControl(""),
    file1: new FormControl(""),
    file2: new FormControl(""),
    file3: new FormControl(""),
    file4: new FormControl(""),
  })

  veelsPlusBranchID: any;
  reqDescription: any;
  createdBy: string;
  details: string;
  dataDetails: any;
  vpcorporateId: any;
  logoLinkDoc: any;
  corporateSqlId: any;
  corpId: any;
  branchCodeForAddNewCode: any;
  addressSQLId: any;
  corporateLogoLink: any;
  fstKycStatus: any;
  kycId: any;
  emailId: any;
  personSQLId: any;
  firstName: any;
  hostName: any;
  address1: any;
  lastName: any;
  address2: any;
  companyName: any;
  city: any;
  GSTNumber: any;
  phone1: any;
  email1: any;
  state: any;
  country: any;
  pin: any;
  allBranch: any;
  corporateId: any;
  allBranchdata: any;
  branchDetilsData: any;
  GSTNumberBranch: any;
  branchNameBranch: any;
  hostNameBranch: any;
  hostPhoneBranch: any;
  customerId: any;
  modalRef: any;
  personId: any;
  createdDate: any;
  businessType: any;

  constructor(
    private post: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {
    const currentDate = new Date();
    const year = moment(new Date()).subtract(1, 'year').format("YYYY");
    config.minDate = { year: 2020, month: 4, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    // config.outsideDays = 'hidden';
  }
  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.localStoragecorporateId = element.veelsPlusCorporateID
    // localStorage.setItem('corpId', this.localStoragecorporateId);
    this.acceesGroup = element.accessGroupId
    this.createdBy = element.firstName + ' ' + element.lastName

    let id = this.route.snapshot.paramMap.get('id');
    // localStorage.setItem('customerId', id);
    console.log(id)
    let data = {
      customerId: id
    };

    this.customerId = id

    this.getCustomerAllDataById(this.customerId);
    this.cd.detectChanges();

  }

  getCustomerAllDataById(customerId: any) {
    let data = {
      customerId: customerId
    }

    this.post.getCustomerByCustomerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.details = JSON.stringify(res.data);
          this.dataDetails = JSON.parse(this.details);
          this.vpcorporateId = res.data[0].veelsPlusCorporateID;
          this.corporateSqlId = res.data[0].corporateId;
          this.logoLinkDoc = res.data[0].companyLogoLink
          this.corpId = res.data[0].corporateId;
          this.branchCodeForAddNewCode = res.data[0].veelsPlusBranchID;
          this.addressSQLId = res.data[0].addressId;
          this.personSQLId = res.data[0].personId;
          this.kycId = res.data[0].kycId;
          this.emailId = res.data[0].email1;
          this.fstKycStatus = res.data[0].fstKycStatus;
          this.corporateLogoLink = res.data[0].companyLogoLink;


          this.firstName = res.data[0].firstName;
          this.lastName = res.data[0].lastName;
          this.hostName = res.data[0].hostName;
          this.address1 = res.data[0].address1;
          this.address2 = res.data[0].address2;
          this.city = res.data[0].city;
          this.GSTNumber = res.data[0].GSTNumber;
          this.companyName = res.data[0].companyName;
          this.phone1 = res.data[0].phone1;
          this.email1 = res.data[0].email1;
          this.state = res.data[0].state;
          this.country = res.data[0].country;
          this.pin = res.data[0].pin;
          this.businessType = res.data[0].businessType

          localStorage.setItem('kycId', this.kycId);
          this.kycForm.controls["transporterBusinessType"].setValue(res.data[0].businessType)

          this.getBranchByCorporateVeelsplusId(this.vpcorporateId);
          this.cd.detectChanges();
          // this.getAllDocDetails(this.corporateSqlId)

          // this.setValueInForm();

        }
      })


  }

  getBranchByCorporateVeelsplusId(corporateId: string) {
    let data = {
      veelsplusCorporateId: "00" + corporateId
    }
    this.post.getBranchVeelsplusId(data)
      .subscribe(result => {

        this.allBranch = result.data[0];
        this.corporateId = result.data[0].veelsPlusCorporateID
        this.veelsPlusBranchID = result.data[0].veelsPlusBranchID

        this.getAllBranchByCorporateVeelsplusId(result.data[0].veelsPlusCorporateID);
        this.cd.detectChanges();


      })

  }

  getAllBranchByCorporateVeelsplusId(corporateId: any) {
    let data = {
      veelsplusCorporateId: corporateId
    }
    this.post.getAllBranchVeelsplusId(data)
      .subscribe(result => {
        this.allBranchdata = result;
        this.getBranchDetailByPhone(result.data[0].hostPhone);
        this.cd.detectChanges();
        // this.dropdownBranchForUser();


      })

  }

  getBranchDetailByPhone(branchPhone: any) {
    let branchPhonedata = {
      "phone1": branchPhone
    };

    this.post.getBranchByphoneNumberPOST(branchPhonedata)
      .subscribe(res => {
        this.branchDetilsData = res.data[0];
        this.GSTNumberBranch = res.data[0].GSTNumber;
        this.branchNameBranch = res.data[0].branchName;
        this.hostNameBranch = res.data[0].hostName;
        this.hostPhoneBranch = res.data[0].hostPhone;
        var corpId = localStorage.getItem('corpId');
        this.customerId = res.data[0].customerId;
        this.cd.detectChanges();
        // this.AllUserByVeelsplus(corpId)

      })
    let data = {
      customerId: this.customerId
    }
  }

  updateCustomerData() {

    this.customerId = localStorage.getItem('customerId');
    //Customer Update
    let data = {
      businessType: this.businessType,
      companyName: this.companyName,
      customerId: this.customerId,
      customerCreatedBy: this.localStoragecorporateId
    }
    this.post.updateCustomerPOST(data)
      .subscribe(res => {
        if (res) {
          alert(res.msg);
          this.cd.detectChanges();

        } else {
          alert(res.msg);
          this.cd.detectChanges();
        }
      })
    //Person Update
    let datap = {

      personId: this.personSQLId,
      email: this.email1,

    }

    this.post.updatePerson(datap)
      .subscribe(res => {
        if (res) {
          this.cd.detectChanges();

        } else {
          alert(res.msg);
          this.cd.detectChanges();
        }
      })

  }

  editCustDetail() {
    this.editCustDetails = true;
  }

  updateCorporate() {

    let data = {

      hostName: this.corporateForm.value.hostName,
      GSTNumber: this.corporateForm.value.GSTNumber,
      corporateId: this.corporateSqlId,
    }

    this.post.updateCorporatePOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert("Update Successfully..")
          this.cd.detectChanges();
        }
        else {
          alert(res.msg)
          this.cd.detectChanges();
        }
      })

  }

  editAddressDetail() {
    this.editAddressDetails = true;
  }
  onSubmitInfoAddress() {

    if (this.address1 && this.address2 && this.pin && this.city) {

      let data = {
        country: this.country,
        address1: this.address1,
        address2: this.address2,
        pin: this.pin,
        city: this.city,
        state: this.state,
        addressId: this.addressSQLId,
        cityArea: this.city,

      }
      this.post.postUpdateAddressPOST(data)
        .subscribe(res => {
          if (res) {
            alert(res.msg);
            this.cd.detectChanges();
          } else {
            alert(res.msg);
            this.cd.detectChanges();
          }
        })
    }

    else {
      alert("Please Fill all Fields!")
    }


  }

  editOtherDetail() {
    this.editOtherDetails = true;
  }

  requestDetail() {

    if (this.reqDescription) {

      let data =
      {
        ticketSource: "2",
        ticketDescription: this.reqDescription,
        ticketStatus: "Created",
        ticketRaisedByPersonId: this.personId,
        ticketCreatedDate: this.createdDate,

      }

      this.post.addNewTicketPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            alert("Request Send Successfully!")
            this.modalRef.close('close')
            this.cd.detectChanges();
          }
        })

    }
    else {
      alert("Please Enter Description!")
    }
  }
}
