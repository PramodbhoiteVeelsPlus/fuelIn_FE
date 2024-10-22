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
  filterForm = new FormGroup({
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
  submitted: boolean = false;
  modalService: any;
  closeResult: string;

  get userMobile() {
    return this.filterForm.get("phone1");
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
    this.getBrandProductNameForDropdown()
    this.cd.detectChanges();
  }


  checkPhoneNumber() {
    let data = {
      phone: this.filterForm.value.phone1,
    };
    this.post.findPhoneNumberPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        alert("Mobile Number Already Exits! Use another Mobile Number");
        this.filterForm.reset({ phone1: "" });
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
    if (this.filterForm.value.companyName) {
        if (this.filterForm.value.cityArea) {
            if (this.filterForm.value.city) {
                const data = {
                    geoAddress:
                        this.filterForm.value.companyName +
                        "+" +
                        this.filterForm.value.cityArea +
                        "+" +
                        this.filterForm.value.city,
                };

                this.post.getGeoLocationPOST(data).subscribe((res) => {
                    if (res.status == "OK") {
                        alert(res.msg);
                        this.filterForm.controls[
                            "geoLocation"
                        ].setValue(
                            res.result.results[0].geometry.location.lat +
                                "," +
                                res.result.results[0].geometry.location.lng
                        );
                    } else {
                        this.filterForm.controls[
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
  
}
