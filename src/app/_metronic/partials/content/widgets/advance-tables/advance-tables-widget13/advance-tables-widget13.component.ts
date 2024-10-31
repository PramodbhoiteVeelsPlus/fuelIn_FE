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

@Component({
  selector: 'app-advance-tables-widget13',
  templateUrl: './advance-tables-widget13.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class AdvanceTablesWidget13Component {

  isFastagReg: boolean = false;
  phoneSearch: any;
  dateCode: any;
  monthCode: number;
  monthAlpha: string;
  yearCode: any;
  veelsPlusCorporateId: string;
  stateCode: string;
  veelsPlusBranchId: string;
  veelsUserTypePlusId: string;
  userRole: string = "2";
  businessTypeCode: string;
  veelsPlusCorporateID: any;
  personId: any;
  userId: any;
  addressId: any;
  dealerLoginVPId: any;
  customerIdforReg: any;
  kycId: any;
  corporateIdforReg: any;
  veelsplususerId: any;
  isNumberFound: boolean = false;
  searchedCorpId: any;
  ftcorpId: any;
  isActive: any;
  thrLimit: any;
  personIdLoginUser: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;




  registerCorporateForm = new FormGroup({
    businessType: new FormControl('', Validators.required),
    companyName: new FormControl('', Validators.required),
    GSTNumber: new FormControl('', Validators.required),
    numberOfBranches: new FormControl('', Validators.required),
    website: new FormControl('', Validators.required),
    numberOfEmployee: new FormControl('', Validators.required),
    hostName: new FormControl('', Validators.required),
    hostPhone: new FormControl('', Validators.required),
    createdBy: new FormControl(''),
    addressId: new FormControl(''),
    customerId: new FormControl(''),
    headQuarterName: new FormControl(''),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phone1: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    email1: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
    password: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    address1: new FormControl('', Validators.required),
    address2: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    status: new FormControl('Pending'),
    thrLimit: new FormControl('', Validators.required),
    kitNo: new FormControl('', Validators.required),
    entityId: new FormControl('', Validators.required),
    fstKycStatus: new FormControl('', Validators.required)
  })

  searchBox: FormControl = new FormControl();
  customerLength: any = [];
  searchTerm: any = "";
  customerData: any = [];
  customerDetail: any = [];
  customerDetailData: any = [];
  isAdd: boolean = false;
  corpWalletEntityId: any;
  corpWalletCompanyName: any;
  isUpdate: boolean;
  corpWalletLQId: any;
  corpWalletAccNo: any;
  corpWalletIFSC: any;
  corpWalletUPI: any;

  get primEmail() {
    return this.registerCorporateForm.get('email1')
  }
  get userMobile() {
    return this.registerCorporateForm.get('phone1')
  }



  constructor(private excelService: ExcelService, private modalService: NgbModal,
    private spinner: NgxSpinnerService, private post: Adv_TablesService,
    private cd: ChangeDetectorRef,) {
    this.searchBox.valueChanges

  }

  ngOnInit(): void {
    this.showCustomer();
  }

  search() {
    let term = this.searchTerm;
    if (this.searchTerm) {
      this.customerDetailData = this.customerDetail.filter(function (res:any) {
        return res.hostPhone.indexOf(term) >= 0;
      });
    } else {
      this.showCustomer()
    }
  }
  
  pageChangeEvent(event: number) {
    this.p = event;
    this.showCustomer();
  }

  showCustomer() {
    this.post.getCorporateDetailsForFastagLQPost()
      .subscribe(res => {
        if (res) {
          this.customerData = res;
        
        this.customerData.data.map(
          (detail:any) => {
            this.customerDetailData.push(detail)
            this.customerDetail.push(detail)            
          })
          this.cd.detectChanges();
      }}
      );
  }

  addfastagStatus() {
    this.isFastagReg = true;
  }

  searchPhoneNumber() {
    let data = {
      phone: this.phoneSearch
    }
    this.post.searchPhoneForFuelDealerLQPost(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            if (res.data[0].entityId) {
              alert("Fastag Corporate Found Successfully!")
            } else {
              alert("Corporate Found Successfully But Need To add Fastag Info!")
              this.isAdd = true;
              this.isNumberFound = false;
              this.searchedCorpId = res.data[0].customerId;
              this.registerCorporateForm.controls["phone1"].setValue(this.phoneSearch);
            }
          } else {
            alert("Corporate Not Found. Please Register!")
            this.isNumberFound = true;
            this.isAdd = false;
          }
        }
      })
  }

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }

  submit() {
    if (this.registerCorporateForm.value.state) {
      if (this.registerCorporateForm.value.businessType) {
        if (this.registerCorporateForm.value.thrLimit && this.registerCorporateForm.value.phone1) {
          this.showSpinner()
          this.createCorporateId();
          this.submitCorporateRegister();
        }
        else {
          alert("Please Enter Fastag Details!")
        }
      } else {
        alert("Please Enter Business Type!")
      }
    }
    else {
      alert("Please select state!")
    }
  }

  createCorporateId() {
    this.createBusinessTypeCode();
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

  createBusinessTypeCode() {

    switch (this.registerCorporateForm.value.businessType) {
      case 'Proprietorship':
        this.businessTypeCode = '01'
        break;
      case 'Partnership':
        this.businessTypeCode = '02'

        break;
      case 'Private Limited Company':
        this.businessTypeCode = '03'
        break;

      case 'Public Limited Company':
        this.businessTypeCode = '04'
        break;

      case 'Foreign Company':
        this.businessTypeCode = '05'
        break;

      case 'Fuel station':
        this.businessTypeCode = '07'
        break;


      default:
        this.businessTypeCode = '06'

        break;



    }

  }

  createStateCode() {


    switch (this.registerCorporateForm.value.state) {
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

  submitCorporateRegister() {

    if (this.registerCorporateForm.value.firstName) {
      if (this.registerCorporateForm.value.lastName) {
        if (this.registerCorporateForm.value.companyName) {
          if (this.registerCorporateForm.value.state) {
            if (this.registerCorporateForm.value.phone1) {
              this.showSpinner()
              this.createCorporateId();
              let data = {
                firstName: this.registerCorporateForm.value.firstName,
                lastName: this.registerCorporateForm.value.lastName,
                phone1: this.registerCorporateForm.value.phone1,
                email1: this.registerCorporateForm.value.email1,
                kycStatus: "Accept",
                veelsUserTypePlusId: this.veelsUserTypePlusId,
                password: "1234",
                accessGroupId: this.userRole,
                veelsPlusCorporateID: this.veelsPlusCorporateID,
                userCreatedBy: this.personIdLoginUser,
                onBoardStatus: "FALSE"
              }

              this.post.userRegister(data)
                .subscribe(res => {
                  if (res.status == "OK") {
                    this.personId = res.personId,
                      this.userId = res.data.insertId,
                      this.submitAddress()


                  }
                })
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
      state: this.registerCorporateForm.value.state,
      address1: this.registerCorporateForm.value.address1,
      address2: this.registerCorporateForm.value.address2,
      city: this.registerCorporateForm.value.city,
      personId: this.personId
    }
    this.post.addAddress(data1)
      .subscribe(res => {
        if (res.status) {
          this.addressId = res.data.insertId;
          this.onSubmitAddCustomer();

        } else {
        }
      });
  }

  submitCorporate() {
    this.createCorporateId();
    let data = {
      GSTNumber: this.registerCorporateForm.value.GSTNumber,
      numberOfBranches: this.registerCorporateForm.value.numberOfBranches,
      website: this.registerCorporateForm.value.website,
      numberOfEmployee: 1,
      hostName: this.registerCorporateForm.value.firstName + ' ' + this.registerCorporateForm.value.lastName,
      branchName: "HEAD OFFICE",
      headQuarterName: this.registerCorporateForm.value.headQuarterName,
      hostPhone: this.registerCorporateForm.value.phone1,
      createdBy: this.dealerLoginVPId,
      addressId: this.addressId,
      customerId: this.customerIdforReg,
      kycId: this.kycId,
      veelsPlusCorporateID: this.veelsPlusCorporateId
    }

    this.post.addCorporate(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.corporateIdforReg = res.data1.insertId;
          this.corporateById(this.corporateIdforReg);

        }
        else {
          alert(res.msg)
        }
      })

  }

  corporateById(cid: any) {
    let data = {
      corporateId: cid
    }
    this.post.postCorporateById(data)
      .subscribe(res => {
        if (res) {
          this.veelsPlusCorporateID = res.Id.veelsPlusCorporateID;
          this.veelsPlusBranchId = res.Id.veelsPlusBranchID;

          this.UpdateCorporateIdToUser();

        } else {
          this.veelsPlusCorporateID = "";
        }
      })

  }

  onSubmitAddCustomer() {
    const data = {
      businessType: 'Fuel station',
      companyName: this.registerCorporateForm.value.companyName,
      phone1: this.registerCorporateForm.value.createdBy,
    };
    this.post.addCustomer(data)
      .subscribe(res => {
        if (res.status) {
          this.createBusinessTypeCode();
          this.customerIdforReg = res.data.insertId;
          this.searchedCorpId = res.data.insertId;
          this.saveKycDoc()
        } else {
          alert(res.msg);
        }
      });
  }

  UpdateCorporateIdToUser() {
    let data = {
      userId: this.userId,
      veelsPlusCorporateID: this.veelsPlusBranchId,
      approvedBy: this.veelsplususerId
    }
    this.post.updateVeelsPlusCorporateIdwithPermPost(data)
      .subscribe(res => {
        this.addFastagForCorp();
      })
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
    this.post.addKYC(data)
      .subscribe(result => {
        if (result.status == "OK") {
          this.kycId = result.data.insertId;
          this.submitCorporate();

        } else {

        }

      })

  }

  checkPhone() {
    let data = {
      phone: this.registerCorporateForm.value.phone1
    }
    this.post.findPhone(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
        }
      })
  }

  addFastagForCorp() {
    let data = {
      corporateId: this.searchedCorpId,
      thrLimit: this.registerCorporateForm.value.thrLimit,
      kitNo: this.registerCorporateForm.value.kitNo,
      fstKycStatus: 'success',
      entityId: this.registerCorporateForm.value.phone1,
      ftCreatedBy: "",
      isActive: "YES",
      createdAt: moment(new Date(), ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('hh:mm:ss'),

    }
    this.post.aadFastagDataLQPost(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert('User Registered Successfully For Fastag !')
          this.registerCorporateForm.reset();
          this.searchedCorpId = "";
          this.showCustomer();

        }
      })
  }

  cancelRegister() {
    this.isFastagReg = false;
    this.isAdd = false;
    this.isNumberFound = false;
  }
  modalReference: any;
  closeResult: string;

  openCorpModal(CorpContent: any, ftcorpId: any, isActive: any, thrLimit: any) {
    this.ftcorpId = ftcorpId;
    this.isActive = isActive;
    this.thrLimit = thrLimit;

    this.modalReference = this.modalService.open(CorpContent)
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

  editFastagForCorp() {
    let data = {
      ftcorpId: this.ftcorpId,
      isActive: this.isActive,
      thrLimit: this.thrLimit

    }
    this.post.updateCorpFastagPost(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
          this.showCustomer();
          this.modalReference.close('close')

        }
      })
  }

  exportAsXLSXCustomer(): void {
    this.excelService.exportAsExcelFile(this.customerDetailData, 'Fastag LQ Report');
  }


  //openCorpWalletModal
  openCorpWalletModal(CorpWalletContent: any, entityId: any, companyName: any) {
    this.corpWalletEntityId = entityId;
    this.corpWalletCompanyName = companyName;
    this.getCorpDetailsByEntity(this.corpWalletEntityId);
    this.modalReference = this.modalService.open(CorpWalletContent)
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //getCorpDetailsByEntity
  getCorpDetailsByEntity(corpWalletEntityId: any) {
    this.spinner.show();
    let data = {
      entityId: corpWalletEntityId,
    }
    this.post.getCorpWalletDetailsByEntityPOST(data)
      .subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.isUpdate = true;
          this.corpWalletLQId = res.data[0].corpWalletLQId;
          this.corpWalletAccNo = res.data[0].corpWalletAccNo;
          this.corpWalletIFSC = res.data[0].corpWalletIFSC;
          this.corpWalletUPI = res.data[0].corpWalletUPI;
          this.spinner.hide();
        } else {
          this.isUpdate = false;
          this.spinner.hide();
        }
      })
  }

  //submitCorpWalletDetails()
  submitCorpWalletDetails() {
    this.spinner.show()
    let data = {
      entityId: this.corpWalletEntityId,
      corpWalletAccNo: this.corpWalletAccNo,
      corpWalletIFSC: this.corpWalletIFSC,
      corpWalletUPI: this.corpWalletUPI,
    }
    this.post.addCorpWalletDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg);
          this.modalReference.close('close')
          this.spinner.hide()
        } else {
          alert(res.msg);
          this.spinner.hide()
        }
      })
  }

  //updateCorpWalletDetails()
  updateCorpWalletDetails() {
    this.spinner.show();
    let data = {
      corpWalletLQId: this.corpWalletLQId,
      corpWalletAccNo: this.corpWalletAccNo,
      corpWalletIFSC: this.corpWalletIFSC,
      corpWalletUPI: this.corpWalletUPI,
    }
    this.post.addCorpWalletDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg);
          this.modalReference.close('close')
          this.spinner.hide()
        } else {
          alert(res.msg);
          this.spinner.hide()
        }
      })
  }

}
