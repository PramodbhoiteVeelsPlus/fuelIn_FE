import { ChangeDetectorRef, Component, Injectable, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../stats.services';
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
  selector: 'app-stats-widget16',
  templateUrl: './stats-widget16.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class StatsWidget16Component {
  @ViewChild('content') content: any;
  isAlert: boolean = false;
  dealerMobile: any;
  fuelDealerId: any;

  corporateMappingForm = new FormGroup({
    carrierOwnerName: new FormControl(''),
    ownerPhone: new FormControl(''),
    maxCreditAmount: new FormControl('', Validators.required),
    bussinessPAN: new FormControl(''),
    individualPAN: new FormControl(''),
    corporatePAN: new FormControl(''),
    carrierName: new FormControl('', Validators.required),
    carrierVPId: new FormControl(''),
    personPan: new FormControl(''),
    personEmail: new FormControl(''),
    personMobile: new FormControl(''),
    personName: new FormControl(''),
    bussinessType: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    gstNo: new FormControl(''),
    address2: new FormControl(''),
    address1: new FormControl(''),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    creditDayLimit: new FormControl('', Validators.required),
    carrierEmail: new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),

  });
  acceesGroupId: any;
  error= '';
  isCarrierFound: boolean = false;
  customerId: any;
  viewCorpFlag: any = [];
  modalRef: any;
  modalService: any;
  closeResult: string;

  constructor(
    private post: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.dealerMobile = element.phone1;
    this.getDealerIdByPhone(this.dealerMobile);
    this.cd.detectChanges()
  }

  getDealerIdByPhone(dealerMobile: any) {
    let data = {
      mobileNumber: dealerMobile,
    };
    this.post.searchDealerByMobilePOST(data)
      .subscribe(res => {
        if ((res.status = "OK")) {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.cd.detectChanges()
        } else {
        }
      });
  }

  searchCorporateByPhone() {
    if (this.corporateMappingForm.value.phoneNumber) {
      this.spinner.show()
      const data = {
        mobileNumber: this.corporateMappingForm.value.phoneNumber,
      };
      this.post.searchCarrierByMobilePOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.acceesGroupId = res.data[0].accessGroupId
            if (res.data[0].accessGroupId == 2) {
              this.error = 'Carrier Found Successfully!';
              this.isCarrierFound = true;
              this.corporateMappingForm.controls["carrierVPId"].setValue(res.data[0].veelsPlusBranchID);
              this.customerId = res.data[0].customerId;
              this.getFlagStatusByCorpId(res.data[0].corporateId)
              // this.getCustomerAllDataById(this.customerId);
            } else {
              alert("This Mobile Number Already used for Petrol Pump..")
              this.corporateMappingForm.controls["phoneNumber"].setValue("")
              this.spinner.hide()
            }
          } else {
            let data = {
              phone: this.corporateMappingForm.value.phoneNumber
            }
            this.post.findPhoneNumberPOST(data)
              .subscribe(res => {
                if (res.status == "OK") {
                  alert("This Mobile Number Already used in System..!")
                  this.corporateMappingForm.controls["phoneNumber"].setValue("")
                  this.spinner.hide()
                } else {
                  this.spinner.hide()
                }
              });
          }
        })
    } else {
      ("Please Enter Valid Mobile Number!")
      this.spinner.hide()
    }
  }


  getFlagStatusByCorpId(corporateIdForFlag: any) {
    this.spinner.show();
    let data = {
      corporateIdForFlag: corporateIdForFlag
    }
    this.post.getFlagStatusByCorpIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.viewCorpFlag = res.data
          this.isAlert = true;
          this.openModal();
          setTimeout(() => {
            /** spinner ends after 3 seconds */
            this.isAlert = false;;
          }, 1000);
          setTimeout(() => {
            this.isAlert = true;;
          }, 2000);
          setTimeout(() => {
            this.isAlert = false;;
          }, 3000);
          setTimeout(() => {
            this.isAlert = true;;
          }, 4000);
          setTimeout(() => {
            this.isAlert = false;;
          }, 5000);
          setTimeout(() => {
            this.isAlert = true;;
          }, 6000);
          setTimeout(() => {
            this.isAlert = false;;
          }, 7000);
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      });
  }

  openModal() {
    this.modalRef = this.modalService.open(this.content, { centered: true });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

}