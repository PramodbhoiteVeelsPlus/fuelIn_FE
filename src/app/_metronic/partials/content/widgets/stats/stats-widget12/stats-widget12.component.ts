import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StatsService } from '../stats.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-stats-widget12',
  templateUrl: './stats-widget12.component.html',
  styleUrl: './stats-widget12.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class StatsWidget12Component {
  localStoragecorporateId: any;
  
  fuelVendorDetailsForm = new FormGroup({
    name: new FormControl("", Validators.required),
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    phone1: new FormControl("", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    kycStatus: new FormControl("", Validators.required),
    veelsUserTypePlusId: new FormControl("", Validators.required),
    veelsPlusCorporateID: new FormControl("", Validators.required),
    state: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
    companyName: new FormControl("", Validators.required),
    email: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
    ]),
    brandName: new FormControl("", Validators.required),
    address1: new FormControl("", Validators.required),
    address2: new FormControl("", Validators.required),
    city: new FormControl("", Validators.required),
    pin: new FormControl("", Validators.required),
    dist: new FormControl("", Validators.required),
    cityArea: new FormControl("", Validators.required),
    geoLocation: new FormControl("", Validators.required),
    phone2: new FormControl("", Validators.required),
    highwayNumber: new FormControl("", Validators.required),
    businessType: new FormControl("", Validators.required),
    GSTNumber: new FormControl("", Validators.required),
    uniqueCodeAssigned: new FormControl("", Validators.required),
    businessPanName: new FormControl("", Validators.required),
    businessPancardNumber: new FormControl("", Validators.required),
    businesspanCard: new FormControl("", Validators.required),
    gstNumberDoc: new FormControl("", Validators.required),
    individualPanCard: new FormControl("", Validators.required),
    licenceLinkDoc: new FormControl("", Validators.required),
    aadharcardfrontdoc: new FormControl("", Validators.required),
    addharLinkDoc: new FormControl("", Validators.required),
    CompanyLogo: new FormControl("", Validators.required),
    onOilCmpReceipt: new FormControl("", Validators.required),
});

  getAllOilBrandProductNameCodeDetails: any = [];
  submitted: boolean;
  modalService: any;
  closeResult: string;
  veelsUserTypePlusId: any;
  veelsPlusCorporateId: any;
  VPCorporateId: any;
  personId: any;
  dateCode: any;
  monthCode: number;
  monthAlpha: string;
  yearCode: any;
  stateCode: string;

  get userMobile() {
    return this.fuelVendorDetailsForm.get("phone1");
  }
  constructor(
    private post: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const currentDate = new Date();
    const year = moment(new Date()).subtract(1, 'year').format("YYYY");
    config.minDate = { year: 2020, month: 4, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.localStoragecorporateId = element.veelsPlusCorporateID
    this.VPCorporateId = element.veelsPlusCorporateID;
    this.personId = element.personId
    this.getBrandProductNameForDropdown()
    this.cd.detectChanges();
  }


  checkPhoneNumber() {
    let data = {
      phone: this.fuelVendorDetailsForm.value.phone1,
    };
    this.post.findPhoneNumberPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        alert("Mobile Number Already Exits! Use another Mobile Number");
        this.fuelVendorDetailsForm.reset({ phone1: "" });
        // this.router.navigate(['../listVendor/']);
      }
    });
  }

  getBrandProductNameForDropdown() {
    this.spinner.show()
    let data = {

    }
    this.post.getAllOilBrandProductNameCodePOST(data)
      .subscribe((res) => {
        if (res.status == "OK") {
          this.getAllOilBrandProductNameCodeDetails = res;
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      });
  }
  
  getGeoLocation() {
    this.submitted = true;
    if (this.fuelVendorDetailsForm.value.companyName) {
        if (this.fuelVendorDetailsForm.value.cityArea) {
            if (this.fuelVendorDetailsForm.value.city) {
                const data = {
                    geoAddress:
                        this.fuelVendorDetailsForm.value.companyName +
                        "+" +
                        this.fuelVendorDetailsForm.value.cityArea +
                        "+" +
                        this.fuelVendorDetailsForm.value.city,
                };

                this.post.getGeoLocationPOST(data).subscribe((res) => {
                    if (res.status == "OK") {
                        alert(res.msg);
                        this.fuelVendorDetailsForm.controls[
                            "geoLocation"
                        ].setValue(
                            res.result.results[0].geometry.location.lat +
                                "," +
                                res.result.results[0].geometry.location.lng
                        );
                    } else {
                        this.fuelVendorDetailsForm.controls[
                            "geoLocation"
                        ].setValue("lat:" + "" + ",lng:" + "");
                    }
                });
            } else {
                alert("Please Enter City");
            }
        } else {
            alert("Please Enter CityArea");
        }
    } else {
        alert("Please Enter Petrol Pump Name");
    }
}

opendoc(doc: any) {
  this.modalService.open(doc).result.then(
      (result: any) => {
          this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
  );
}
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
  } else {
      return `with: ${reason}`;
  }
}

addFuelVendor() {
  this.spinner.show();
    this.createCorporateId();

    let data = {
        firstName: this.fuelVendorDetailsForm.value.firstName,
        lastName: this.fuelVendorDetailsForm.value.lastName,
        phone1: this.fuelVendorDetailsForm.value.phone1,
        kycStatus: "pending",
        accessGroupId: "12",
        veelsUserTypePlusId: this.veelsUserTypePlusId,
        veelsPlusCorporateID: this.veelsPlusCorporateId,
        state: this.fuelVendorDetailsForm.value.state,
        password: this.fuelVendorDetailsForm.value.password,
        companyName: this.fuelVendorDetailsForm.value.companyName,
        email1: this.fuelVendorDetailsForm.value.email,
        brandName: this.fuelVendorDetailsForm.value.brandName,
        address1: this.fuelVendorDetailsForm.value.address1,
        address2: this.fuelVendorDetailsForm.value.address2,
        city: this.fuelVendorDetailsForm.value.city,
        hostName: this.fuelVendorDetailsForm.value.firstName+' '+this.fuelVendorDetailsForm.value.lastName ,
        hostPhone: this.fuelVendorDetailsForm.value.phone1,
        headQuarterName: this.fuelVendorDetailsForm.value.city,
        pin: this.fuelVendorDetailsForm.value.pin,
        dist: this.fuelVendorDetailsForm.value.dist,
        cityArea: this.fuelVendorDetailsForm.value.cityArea,
        geoLocation: this.fuelVendorDetailsForm.value.geoLocation,
        phone2: this.fuelVendorDetailsForm.value.phone2,
        highwayNumber: this.fuelVendorDetailsForm.value.highwayNumber,
        businessType: this.fuelVendorDetailsForm.value.businessType,
        GSTNumber: this.fuelVendorDetailsForm.value.GSTNumber,
        uniqueCodeAssigned: this.fuelVendorDetailsForm.value.uniqueCodeAssigned,
        businessPanName: this.fuelVendorDetailsForm.value.businessPanName,
        businessPancardNumber: this.fuelVendorDetailsForm.value.businessPancardNumber,
        fuelDealerCreateBy: this.VPCorporateId ,
        // businesspanCard: this.panBusLogoLinkDoc,
        // gstNumberDoc:this.gstLogoLinkDoc,
        // individualPanCard: this.panLogoLinkDoc,
        // licenceLinkDoc: this.dlLogoLinkDoc,
        // aadharcardfrontdoc: this.adhrFrontLogoLinkDoc,
        // addharLinkDoc: this.adhrBackLogoLinkDoc,
        // CompanyLogo: this.CompanyLogoLinkDoc,
        // oilReceipt:this.oilReceiptLinkDoc,
        businesspanCard: "",
        gstNumberDoc:"",
        individualPanCard: "",
        licenceLinkDoc: "",
        aadharcardfrontdoc: "",
        addharLinkDoc: "",
        CompanyLogo: "",
        oilReceipt: "",
        userCreatedBy:this.personId,
        onBoardStatus:"FALSE"
    };
    // console.log("data", data);
    this.post.fuelDealerRegister(data).subscribe((res) => {
        if (res) {
            
          this.spinner.hide();
            alert("Fuel Dealer Registered Successfully!")
            this.router.navigate(['/admin/listCustomerOnboarding']);

        }
        else{
            this.spinner.hide();
          alert("Error to Register Fuel Dealer!")
        }
    });
    this.spinner.hide();
}

createCorporateId() {
  this.createStateCode();
  this.dateCode = new Date();
  this.monthCode = this.dateCode.getMonth() + 1;

  switch (this.monthCode) {
      case 1:
          this.monthAlpha = "A";
          break;
      case 2:
          this.monthAlpha = "B";

          break;

      case 3:
          this.monthAlpha = "C";
          break;

      case 4:
          this.monthAlpha = "D";
          break;

      case 5:
          this.monthAlpha = "E";
          break;
      case 6:
          this.monthAlpha = "F";

          break;

      case 7:
          this.monthAlpha = "G";
          break;

      case 8:
          this.monthAlpha = "H";
          break;
      case 9:
          this.monthAlpha = "I";

          break;

      case 10:
          this.monthAlpha = "J";
          break;

      case 11:
          this.monthAlpha = "K";
          break;

      case 12:
          this.monthAlpha = "L";
          break;
  }
  this.yearCode = this.dateCode.getYear().toString().slice(1, 3);

  this.veelsUserTypePlusId = "VP" + this.stateCode + "12" + this.monthAlpha + this.yearCode;
  this.veelsPlusCorporateId="VB" + this.stateCode + "12" + this.monthAlpha+this.yearCode;
}

createStateCode() {
  switch (this.fuelVendorDetailsForm.value.state) {
      case "ANDHRA PRADESH":
          this.stateCode = "01";
          break;
      case "ARUNACHAL PRADESH":
          this.stateCode = "02";

          break;
      case "ASSAM":
          this.stateCode = "03";

          break;
      case "BIHAR":
          this.stateCode = "04";

          break;
      case "CHHATTISGARH":
          this.stateCode = "05";

          break;
      case "GOA":
          this.stateCode = "06";

          break;
      case "GUJARAT":
          this.stateCode = "07";

          break;

      case "HARYANA":
          this.stateCode = "08";

          break;

      case "HIMACHAL PRADESH":
          this.stateCode = "09";

          break;
      case "JHARKHAND":
          this.stateCode = "10";

          break;
      case "KARNATAKA":
          this.stateCode = "11";
          break;

      case "KERALA":
          this.stateCode = "12";
          break;

      case "MADHYA PRADESH":
          this.stateCode = "13";
          break;

      case "MAHARASHTRA":
          this.stateCode = "14";
          break;

      case "MANIPUR":
          this.stateCode = "15";
          break;

      case "MEGHALAYA":
          this.stateCode = "16";
          break;
      case "MIZORAM":
          this.stateCode = "17";
          break;
      case "NAGALAND":
          this.stateCode = "18";
          break;
      case "ODISHA":
          this.stateCode = "19";
          break;
      case "PUNJAB":
          this.stateCode = "20";
          break;
      case "RAJASTHAN":
          this.stateCode = "21";
          break;
      case "SIKKIM":
          this.stateCode = "22";
          break;
      case "TAMIL NADU":
          this.stateCode = "23";
          break;
      case "TELANGANA":
          this.stateCode = "24";
          break;
      case "TRIPURA":
          this.stateCode = "25";
          break;
      case "UTTAR PRADESH":
          this.stateCode = "26";
          break;
      case "UTTARAKHAND":
          this.stateCode = "27";
          break;
      case "WEST BENGAL":
          this.stateCode = "28";
          break;
      case "ANDAMAN AND NICOBAR ISLANDS":
          this.stateCode = "29";
          break;
      case "CHANDIGARH":
          this.stateCode = "30";
          break;
      case "DADRA AND NAGAR HAVELI AND DAMAN AND DIU":
          this.stateCode = "31";
          break;
      case "DELHI":
          this.stateCode = "32";
          break;
      case "LAKSHADWEEP":
          this.stateCode = "33";
          break;
      case "PUDUCHERRY":
          this.stateCode = "34";
          break;
      case "JAMMU AND KASHMIR":
          this.stateCode = "35";
          break;
      case "LADAKH":
          this.stateCode = "36";
          break;
      default:
          break;
  }
}
}
