import { ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../stats.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { addVehicle } from './addVehicle.model';

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
  selector: 'app-stats-widget17',
  templateUrl: './stats-widget17.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class StatsWidget17Component {
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
    state: new FormControl(),
    creditDayLimit: new FormControl('', Validators.required),
    carrierEmail: new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    numberOfBranches: new FormControl(''),
    website: new FormControl(''),
    headQuarterName: new FormControl(''),

  });

  corporateMappingForm1 = new FormGroup({
    carrierOwnerName: new FormControl(''),
    ownerPhone: new FormControl(''),
    bussinessPAN: new FormControl(''),
    individualPAN: new FormControl(''),
    corporatePAN: new FormControl(''),
    carrierVPId: new FormControl(''),
    personPan: new FormControl(''),
    personEmail: new FormControl(''),
    personMobile: new FormControl(''),
    personName: new FormControl(''),
    bussinessType: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    address2: new FormControl(''),
    address1: new FormControl(''),
    city: new FormControl('', Validators.required),
    state: new FormControl(),
    carrierEmail: new FormControl('', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),

  });
  addVehicleForm = new FormGroup({
    selectedCorp: new FormControl(''),
    addVehicleDate: new FormControl('', Validators.required),
    vehicleNumber: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required)

  });

  dealerMobile: any;
  fuelDealerId: any;
  thisMonthCrSale: any;
  thisMonthCrPayment: any;
  totalOS: any;
  viewCorpFlag: any = [];
  isAlert: boolean = false;
  modalRef: any;
  closeResult: string;
  accessGroupId: any;
  error = '';
  isCarrierFound: boolean = false;
  customerId: any;
  details: string;
  dataDetails: any;
  corporateId: any;
  customerCorporateId: any;
  kycId: any;
  ischeckValidation: boolean = false;
  dateToday = new Date();
  success: string;
  fuelDealerCustomerMapId: any;
  showRefrsh: boolean = false;
  dateCode: any;
  monthCode: number;
  monthAlpha: string;
  yearCode: any;
  veelsPlusCorporateId: string;
  stateCode: any;
  veelsPlusBranchId: string;
  veelsUserTypePlusId: string;
  userRole:  any = "2";
  modalRef2: any;
  prevOutstanding: any;
  previousOutstandForModal: any;
  countAdvance: any = 1;
  addVehicle = new addVehicle();
  addVehicleData: any = [];
  count: number = 1;
  dealerCorporateId: any;
  isForm1: boolean = true;
  isForm2: boolean = false;
  isForm3: boolean = false;
  corporateLoginVPId: any;
  personIdLoginUser: any;
  personId: any;
  userId: any;
  addressId: any;
  customerIdforReg: any;
  dealerLoginVPId: any;
  corporateIdforReg: any;
  veelsPlusCorporateID: any;
  veelsplususerId: any;

  constructor(
    private post: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router) { }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    var dealerData = JSON.parse(localStorage.getItem("dealerData") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    this.dealerMobile = element.phone1;
    this.dealerCorporateId = dealerData.corporateId;
    this.corporateLoginVPId = element.veelsPlusCorporateID;
    this.personIdLoginUser = element.personId
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.veelsplususerId = element.veelsPlusId;
    // this.getDealerIdByPhone(this.dealerMobile);
    this.cd.detectChanges()
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
  content(content: any, arg1: { centered: true; }): any {
    throw new Error('Method not implemented.');
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
            this.accessGroupId = res.data[0].accessGroupId
            if (res.data[0].accessGroupId == 2) {
              this.error = 'Carrier Found Successfully!';
              this.isCarrierFound = true;
              this.corporateMappingForm1.controls["carrierVPId"].setValue(res.data[0].veelsPlusBranchID);
              this.customerId = res.data[0].customerId;
              this.getFlagStatusByCorpId(res.data[0].corporateId)
              this.getCustomerAllDataById(this.customerId);
              this.cd.detectChanges()
            } else {
              alert("This Mobile Number Already used for Petrol Pump..")
              this.corporateMappingForm.controls["phoneNumber"].setValue("")
              this.spinner.hide()
              this.cd.detectChanges()
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
                  this.cd.detectChanges()
                } else {
                  this.spinner.hide()
                  this.cd.detectChanges()
                }
              });
          }
        })
    } else {
      ("Please Enter Valid Mobile Number!")
      this.spinner.hide()
      this.cd.detectChanges()
    }
  }

  getCustomerAllDataById(customerId: any) {

    let data = {
      customerId: customerId
    }
    this.post.getCustomerByCustomerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.details = JSON.stringify(res.data);
          this.dataDetails = JSON.parse(this.details);
          if (res.data[0].companyName == 'undefined') {
            this.corporateMappingForm.controls["carrierName"].setValue('');
          } else {
            this.corporateMappingForm.controls["carrierName"].setValue(res.data[0].companyName);
          }
          this.corporateMappingForm.controls["bussinessType"].setValue(res.data[0].businessType);
          if (res.data[0].firstName == 'undefined') {
            this.corporateMappingForm.controls["firstName"].setValue('');
          } else {
            this.corporateMappingForm.controls["firstName"].setValue(res.data[0].firstName);
          }
          if (res.data[0].lastName == 'undefined') {
            this.corporateMappingForm.controls["lastName"].setValue('');
          } else {
            this.corporateMappingForm.controls["lastName"].setValue(res.data[0].lastName);
          }
          if (res.data[0].email1 == 'undefined') {
            this.corporateMappingForm.controls["carrierEmail"].setValue('');
          } else {
            this.corporateMappingForm.controls["carrierEmail"].setValue(res.data[0].email1);
          } if (res.data[0].phone1 == 'undefined') {
            this.corporateMappingForm.controls["ownerPhone"].setValue('');
          } else {
            this.corporateMappingForm.controls["ownerPhone"].setValue(res.data[0].phone1);
          }
          if (res.data[0].GSTNumber == 'undefined') {
            this.corporateMappingForm.controls["gstNo"].setValue('');
          } else {
            this.corporateMappingForm.controls["gstNo"].setValue(res.data[0].GSTNumber);
          }
          if (res.data[0].address1 == 'undefined') {
            this.corporateMappingForm.controls["address1"].setValue('');
          } else {
            this.corporateMappingForm.controls["address1"].setValue(res.data[0].address1);
          }
          if (res.data[0].address2 == 'undefined') {
            this.corporateMappingForm.controls["address2"].setValue('');
          } else {
            this.corporateMappingForm.controls["address2"].setValue(res.data[0].address2);
          }
          if (res.data[0].city == 'undefined') {
            this.corporateMappingForm.controls["city"].setValue('');
          } else {
            this.corporateMappingForm.controls["city"].setValue(res.data[0].city);
          }
          this.corporateMappingForm.controls["state"].setValue(res.data[0].state);


          this.corporateId = res.data[0].corporateId;
          this.customerCorporateId = res.data[0].corporateId;
          this.kycId = res.data[0].kycId;
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      })
  }

  getCreditDetailsByDealerId(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getCreditDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.dataSales[0].totalPurchase) {
            this.thisMonthCrSale = res.dataSales[0].totalPurchase
          } else {
            this.thisMonthCrSale = 0
          }

          if (res.dataPayment[0].totalPayment) {
            this.thisMonthCrPayment = res.dataPayment[0].totalPayment
          } else {
            this.thisMonthCrPayment = 0
          }
          this.totalOS = Number(res.outstanding).toFixed(2);
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  disableError() {
    this.error = '';
    if (this.corporateMappingForm.value.phoneNumber) {
      if (this.corporateMappingForm.value.carrierName) {
        if (this.corporateMappingForm.value.maxCreditAmount) {
          if (this.corporateMappingForm.value.creditDayLimit) {
            this.ischeckValidation = true;

          } else {
            alert('Please Enter Credit Limit Days')
          }
        } else {
          alert('Please Enter Credit Limit Amount')
        }
      } else {
        alert('Please Enter Khata Name')
      }
    } else {
      alert('Please Enter Mobile Number')
    }
  }

  submitNewCorp() {

    if (this.corporateMappingForm.value.firstName) {
      if (this.corporateMappingForm.value.carrierName) {
        if (this.corporateMappingForm.value.maxCreditAmount) {
          if (this.corporateMappingForm.value.creditDayLimit) {
            this.spinner.show()
            let data = {
              corporateId: this.corporateId,
              fuelDealerId: this.fuelDealerId,
              requestStatus: "APPROVED",
              mappingStatus: "ACTIVE",
              maxCreditAmount: this.corporateMappingForm.value.maxCreditAmount,
              creditDayLimit: this.corporateMappingForm.value.creditDayLimit,
              mappingCreatedDate: this.dateToday,
              requestSource: "DEALER",
              mappingCustomerName: this.corporateMappingForm1.value.firstName + ' ' + this.corporateMappingForm1.value.lastName,
              mappingCompanyName: this.corporateMappingForm.value.carrierName,
              mappingGST: this.corporateMappingForm.value.gstNo,
              mappingEmail: this.corporateMappingForm1.value.carrierEmail,
              mappingPreviousStatus: "TRUE",
              mappingAddress1: this.corporateMappingForm1.value.address1,
              mappingAddress2: this.corporateMappingForm1.value.address2,
              mappingCity: this.corporateMappingForm1.value.city,

            }
            this.post.sendReqForNewCustomerPOST(data)
              .subscribe(res => {
                if (res.status == "OK") {
                  this.corporateMappingForm.reset()
                  this.success = 'New Khata Created';
                  this.fuelDealerCustomerMapId = res.data.insertId
                  this.showRefrsh = true
                  this.isForm2 = false
                  this.isForm3 = true
                  this.nextStep1()
                  this.spinner.hide()
                  this.cd.detectChanges()
                } else {
                  this.corporateMappingForm.reset()
                  this.error = res.msg ? res.msg : '';
                  this.spinner.hide()
                }
              })
          } else {
            alert("Please Enter Days Limit..")
          }
        } else {
          alert("Please Enter Limit..")
        }
      } else {
        alert("Please Enter Company Name..")
      }
    } else {
      alert("Please Enter Name..")
    }


  }

  submit() {

    if (this.corporateMappingForm1.value.state) {
      if (this.corporateMappingForm.value.maxCreditAmount) {
        if (this.corporateMappingForm.value.creditDayLimit) {

          // this.spinner.show()
          this.createCorporateId();
          this.submitCorporateRegister();
        }
        else {
          alert("Please Enter Max Credit Days Amount!")
        }
      }
      else {
        alert("Please Enter Max Credit Amount!")
      }
    }
    else {
      alert("Please select state!")
    }

  }

  submitCorporateRegister() {
    if (this.corporateMappingForm1.value.firstName) {
      if (this.corporateMappingForm1.value.lastName) {
        if (this.corporateMappingForm.value.carrierName) {
          if (this.corporateMappingForm1.value.state) {
            if (this.corporateMappingForm.value.phoneNumber) {
              if (this.corporateMappingForm1.value.city) {

                this.createCorporateId();
                let data = {
                  firstName: this.corporateMappingForm1.value.firstName,
                  lastName: this.corporateMappingForm1.value.lastName,
                  phone1: this.corporateMappingForm.value.phoneNumber,
                  email1: this.corporateMappingForm1.value.carrierEmail,
                  kycStatus: "Accept",
                  veelsUserTypePlusId: this.veelsUserTypePlusId,
                  password: "1234",
                  accessGroupId: this.userRole,
                  veelsPlusCorporateID: this.veelsPlusCorporateId,
                  userCreatedBy: this.personIdLoginUser,
                  onBoardStatus: "FALSE"
                }

                this.post.userRegisterPOST(data)
                  .subscribe(res => {
                    if (res.status == "OK") {
                      this.personId = res.personId,
                        this.userId = res.data.insertId,
                        this.submitAddress()


                    } else {
                    }
                  })

              } else {
                alert('Please Enter City Name!')
              }
            } else {
              alert('Please Enter PhoneNumber!')
            }
          } else {
            alert('please select state!')
          }
        } else {
          alert('Please Enter Company Name!')
        }
      } else {
        alert('Please Enter Last Name!')
      }
    } else {
      alert('Please Enter First Name!')

    }



  }


  submitAddress() {
    const data1 = {
      state: this.corporateMappingForm1.value.state,
      address1: this.corporateMappingForm1.value.address1,
      address2: this.corporateMappingForm1.value.address2,
      city: this.corporateMappingForm1.value.city,
      personId: this.personId
    }
    this.post.addAddressPOST(data1)
      .subscribe(res => {
        if (res.status) {
          this.addressId = res.data.insertId;
          this.onSubmitAddCustomer();

        } else {
          this.spinner.hide()
        }
      });
  }

  onSubmitAddCustomer() {
    const data = {
      businessType: 'Fuel station',
      companyName: this.corporateMappingForm.value.carrierName,
      phone1: this.corporateMappingForm.value.phoneNumber,

    };

    this.post.addCustomerPOST(data)
      .subscribe(res => {
        if (res.status) {

          this.customerIdforReg = res.data.insertId;

          this.saveKycDoc()

        } else {
          alert(res.msg);
          this.spinner.hide()
        }
      });
  }

  saveKycDoc() {
    let data = {
      individualPancardNumber: "",
      individualPanName: "",
      individualPanCard: "",
      individualPanStatus: 'Pending',
      aadharcardfrontdoc: "",
      addharLinkDoc: "",
      aadharCardStatus: 'Pending',
      licenseNo: "",
      licencedob: "",
      licenceIssueDate: "",
      licenceLinkDoc: "",
      businessPancardNumber: "",
      businessPanName: "",
      businesspanCard: "",
      businessPanStatus: 'Pending',
      gstNumber: "",
      gstNumberDoc: "",
      personId: this.personId,
    }
    this.post.addkycPOST(data)
      .subscribe(result => {
        if (result.status == "OK") {
          this.kycId = result.data.insertId;
          this.submitCorporate();

        } else {
          this.spinner.hide()
        }

      })

  }

  submitCorporate() {
    this.createCorporateId();
    let data = {
      GSTNumber: this.corporateMappingForm.value.gstNo,
      numberOfBranches: this.corporateMappingForm.value.numberOfBranches,
      website: this.corporateMappingForm.value.website,
      numberOfEmployee: 1,
      hostName: this.corporateMappingForm1.value.firstName + ' ' + this.corporateMappingForm1.value.lastName,
      branchName: "HEAD OFFICE",
      headQuarterName: this.corporateMappingForm.value.headQuarterName,
      hostPhone: this.corporateMappingForm.value.phoneNumber,
      createdBy: this.dealerLoginVPId,
      addressId: this.addressId,
      customerId: this.customerIdforReg,
      kycId: this.kycId,
      veelsPlusCorporateID: this.veelsPlusCorporateId
    }

    this.post.addCorporatePOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.corporateIdforReg = res.data1.insertId;
          this.customerCorporateId = res.data1.insertId;
          this.corporateById(this.corporateIdforReg);
          this.nextStep1()
          this.cd.detectChanges()

        }
        else {
          alert(res.msg)
          this.spinner.hide()
          this.cd.detectChanges()
        }
      })

  }

  corporateById(cid: any) {
    let data = {
      corporateId: cid
    }
    this.post.getCorporateByIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.veelsPlusCorporateID = res.Id.veelsPlusCorporateID;
          this.veelsPlusBranchId = res.Id.veelsPlusBranchID;

          this.UpdateCorporateIdToUser();

        } else {
          this.veelsPlusCorporateID = "";
          this.spinner.hide()
        }
      })

  }

  UpdateCorporateIdToUser() {
    let data = {
      userId: this.userId,
      veelsPlusCorporateID: this.veelsPlusBranchId,
      approvedBy: this.veelsplususerId
    }
    this.post.updateVeelsPlusCorporateIdwithPermPOST(data)
      .subscribe(res => {
        this.success = 'New Khata Created';

        this.submitDealerReqForNew()
      })
  }

  submitDealerReqForNew() {

    let data = {

      corporateId: this.corporateIdforReg,
      fuelDealerId: this.fuelDealerId,
      requestStatus: "APPROVED",
      mappingStatus: "ACTIVE",
      maxCreditAmount: this.corporateMappingForm.value.maxCreditAmount,
      creditDayLimit: this.corporateMappingForm.value.creditDayLimit,
      mappingCreatedDate: this.dateToday,
      requestSource: "DEALER",
      PANno: '',
    }

    this.post.addNewCustDealerReqPOST(data)
      .subscribe(res => {
        if (res) {
          this.showRefrsh = true
          this.corporateMappingForm.reset();
          this.corporateMappingForm.controls["state"].setValue("");
          this.fuelDealerCustomerMapId = res.data.insertId
          this.spinner.hide()
        }

        else {
          alert("Error to Create Credit Account!")
          this.spinner.hide()
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

    this.veelsPlusCorporateId = "VB" + this.stateCode + '07' + this.monthAlpha + this.yearCode;
    this.veelsPlusBranchId = "BCVB" + this.stateCode + '07' + this.monthAlpha + this.yearCode;
    this.veelsUserTypePlusId = "VP" + this.stateCode + "0" + this.userRole + this.monthAlpha + this.yearCode;



  }

  createStateCode() {
    switch (this.corporateMappingForm1.value.state) {
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
        break;
    }
  }

  checkOutstandingInSavedStatement(previousOut: any) {
    this.spinner.show();
    let data = {
      customerMapId: this.fuelDealerCustomerMapId,
    };

    this.post.checkCustomerPreviousOutstandingIsAddedOrNotPOST(data)
      .subscribe(res => {

        if (res.data.length) {
          if (confirm("Using this outstanding you saved a statement. If you update your customer outstanding then your saved statement will be changed. Do you want to update your customer outstanding? ")) {

            this.spinner.hide();
            this.openPreOutstand(previousOut)
          } else {
            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
          this.openPreOutstand(previousOut)

        }
      })

  }


  openPreOutstand(openDate: any) {
    this.modalRef2 = this.modalService.open(openDate, { size: 'sm' });
    this.modalRef2.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      });
  }

  openVehicle(addVehicle: any) {
    this.modalRef2 = this.modalService.open(addVehicle);
    this.modalRef2.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      });
  }

  addOutstandAmount() {
    this.spinner.show();
    const data = {
      fuelDealerCustomerMapId: this.fuelDealerCustomerMapId,
      pendingOutstanding: this.prevOutstanding,
      previousOutstandForManage: this.previousOutstandForModal,
      createdDateTime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    };
    this.post.updatePreviousOutstandingPOST(data)
      .subscribe((res) => {
        if (res) {
          alert("Outstanding Added Successfully..!")
          this.modalRef2.close('close');
          this.spinner.hide();
          this.prevOutstanding = 0;
        }
        else {
          this.spinner.hide();
        }
      });

  }

  addVehicleForCr() {
    this.countAdvance = this.countAdvance + 1;
    if (this.countAdvance < 12) {
      this.addVehicle = new addVehicle();
      this.addVehicleData.push(this.addVehicle);
    }
    else {
      this.count = 11;
      alert("Please save 10 credit entries")
    }

  }
  setVehicleNumber() {
    this.addVehicleForm.controls["vehicleNumber"].setValue(this.addVehicle.vehicleNumber)
    this.checkFuelCreditVehicle();

  }

  checkFuelCreditVehicle() {
    let data = {
      fuelDealerCustomerMapId: this.fuelDealerCustomerMapId,
      dealerId: this.fuelDealerId,
      vehicleNumber: this.addVehicleForm.value.vehicleNumber

    }

    this.post.checkVehicleByfuelDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            alert(res.msg)
          }

        }

      })
  }

  removeVehicle(i: number) {
    this.addVehicleData.splice(i, 1);
    this.count = this.count - 1;
  }

  addFuelCreditVehicle() {
    if (this.fuelDealerCustomerMapId) {
      let createdDate = new Date
      let data = {
        addVehicleData: this.addVehicleData,
        fuelDealerCustomerMapId: this.fuelDealerCustomerMapId,
        dealerId: this.fuelDealerId,
        dealerCorporateId: this.dealerCorporateId,
        customerCorporateId: this.customerCorporateId,
        createdAt: createdDate,
        createdBy: this.fuelDealerId,
      }

      this.post.addFuelVehicleDetailsPOST(data)
        .subscribe(res => {

          alert(res.msg)
          this.addVehicleData = [];
          this.countAdvance = 1;
          this.addVehicleForCr();
          this.modalRef2.close('close')

        })
    }
    else {
      alert("Please Select Customer..")
    }

  }

  goToStep(step: any) {
    this.router.navigate(['/credit/viewAccount']);
  }

  nextStep() {
    if (this.corporateMappingForm.value.phoneNumber && this.corporateMappingForm.value.carrierName && this.corporateMappingForm.value.gstNo && this.corporateMappingForm.value.maxCreditAmount && this.corporateMappingForm.value.creditDayLimit) {
      this.isForm1 = false
      this.isForm2 = true
    } else {
      alert("Please Fill All the details..!")
    }
  }

  nextStep1() {
    this.isForm2 = false
    this.isForm3 = true
  }

  prevStep() {
    this.isForm1 = true
    this.isForm2 = false
  }

}