import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TilesService } from '../tiles.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tiles-widget7',
  templateUrl: './tiles-widget7.component.html',
})
export class TilesWidget7Component {
  modalReference: any;
  closeResult: string;
  accessGroup: any;
  accountNumber: any;
  accountHolderName: any;
  ifsc: any;
  branchName: any;
  corporateIdForVendor: any;
  bankName: any;
  AccPhoneNumber: any;
  personId: any;
  upiId: any;
  bankAccList: any = [];
  loginSQLCorporateId: any;
  dealerLoginVPId: any;
  userId: any;
  ownerName: string;
  acceesGroup: any;
  dealerManager: boolean;
  fuelDealerId: any;
  modalRef: any;
  bankDetailsId: any;

  addBankDetailsForm = new FormGroup({
    accountHolderName: new FormControl(""),
    accountNumber: new FormControl("", Validators.required),
    ifsc: new FormControl("", Validators.required),
    AccPhoneNumber: new FormControl("", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    bankName: new FormControl(""),
    branchName: new FormControl(""),
    upiId: new FormControl(""),
    accountType: new FormControl("", Validators.required),
  });

  updateBankDetailsForm = new FormGroup({
    accountHolderName: new FormControl(""),
    accountNumber: new FormControl("", Validators.required),
    phone: new FormControl("", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    bankName: new FormControl(""),
    upiId: new FormControl(""),
    ifsc: new FormControl("", Validators.required),
    branchName: new FormControl(""),
  });
  off: any;

  get userMobile1() {
    return this.addBankDetailsForm.get('AccPhoneNumber')
  }
  get userMobile() {
    return this.updateBankDetailsForm.get('phone')
  }

  constructor(
    private modalService: NgbModal,
    private post: TilesService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.personId = element.personId;
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.addBankDetailsForm.controls['accountHolderName'].setValue("")
    this.addBankDetailsForm.controls['accountNumber'].setValue("")
    this.addBankDetailsForm.controls['ifsc'].setValue("")
    this.addBankDetailsForm.controls['AccPhoneNumber'].setValue("")
    this.addBankDetailsForm.controls['bankName'].setValue("")
    this.addBankDetailsForm.controls['branchName'].setValue("")
    this.addBankDetailsForm.controls['upiId'].setValue("")
    this.addBankDetailsForm.controls['accountType'].setValue("SAVING")
    this.getBankDetailsByDealerId(this.fuelDealerId)
  }

  //Add Bank Account Modal
  openAddBankAcc(addBankAcc: any) {
    this.modalReference = this.modalService.open(addBankAcc, { size: 'lg' })
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

  //Add Bank Account
  addBankDetails() {
    if (this.addBankDetailsForm.value.accountNumber) {
      if (this.addBankDetailsForm.value.AccPhoneNumber) {
        if (this.addBankDetailsForm.value.ifsc) {
          this.spinner.show()
          let data = {
            accountNumber: this.addBankDetailsForm.value.accountNumber,
            accountHolderName: this.addBankDetailsForm.value.accountHolderName,
            ifsc: this.addBankDetailsForm.value.ifsc,
            corporateId: this.loginSQLCorporateId,
            branchName: this.addBankDetailsForm.value.branchName,
            bankName: this.addBankDetailsForm.value.bankName,
            phone: this.addBankDetailsForm.value.AccPhoneNumber,
            personId: this.personId,
            upiId: this.addBankDetailsForm.value.upiId,
            accountType: this.addBankDetailsForm.value.accountType,
            dealerId: this.fuelDealerId
          }
          this.post.addBankDetailsPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                alert(res.msg)
                this.spinner.hide();
                this.getBankDetailsByDealerId(this.fuelDealerId)
                this.clear();
              } else {
                this.spinner.hide();
              }
            })
        } else {
          alert("Please Enter IFSC..!")
          this.spinner.hide();
        }
      } else {
        alert("Please Enter Mobile Number..!")
        this.spinner.hide();
      }
    } else {
      alert("Please Enter Account Number..!")
      this.spinner.hide();
    }
  }

  // Bank Details By fuelDealerId
  getBankDetailsByDealerId(fuelDealerId: any) {
    this.bankAccList.length = 0;
    let data = {
      dealerId: fuelDealerId
    }
    this.post.getBankDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.bankAccList = res.data;
          this.cd.detectChanges();
        } else {
          this.cd.detectChanges();
        }
      })
  }

  clear() {
    this.addBankDetailsForm.reset()
    this.addBankDetailsForm.controls['accountHolderName'].setValue("")
    this.addBankDetailsForm.controls['bankName'].setValue("")
    this.addBankDetailsForm.controls['branchName'].setValue("")
    this.addBankDetailsForm.controls['upiId'].setValue("")
    this.addBankDetailsForm.controls['accountType'].setValue("SAVING")
  }

  deletBankAcc(id: any) {
    let data = {
      bankDetailsId: id
    }
    this.post.getPOSByBankIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data.length) {
            alert("This Bank Account Attach with POS/Digital. Please Change Acc of POS or Delete the POS..")
            this.router.navigate(['../accounting/pos']);
          } else {
            let data = {
              bankDetailsId: id
            }
            if (confirm("Are you sure to delete ? ")) {
              this.post.deleteBankAccByDealerIdPOST(data)
                .subscribe(res => {
                  if (res.status == 'OK') {
                    alert("Bank Account Deleted..")
                    this.getBankDetailsByDealerId(this.fuelDealerId);
                  } else {
                    alert("Error to Delete..")
                  }
                })
            } else {
              this.spinner.hide()
            }
          }
        }
      })
  }

  statusBankEnable(event: any, bankDetailsId: any, dealerId: any) {
    let checkedStatus;
    if (event.target.checked == true) {
      checkedStatus = "TRUE"
    } else if (event.target.checked == false) {
      checkedStatus = "FALSE"
    }
    let data = {
      bankDetailsId: bankDetailsId,
      dealerId: dealerId,
      status: checkedStatus
    }
    this.post.updateAccountDetailsbyUniqueStatusPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          alert("Default Account Selected..!")
          this.getBankDetailsByDealerId(this.fuelDealerId);
        }
      })
  }

  //Update Bank..
  updateBank(editBank: any, bankDetailsId: any, bankName: any, accountHolderName: any, accountNumber: any, phone: any, upiId: any, ifsc: any, branchName: any) {
    this.modalRef = this.modalService.open(editBank, { size: 'lg' });
    this.bankDetailsId = bankDetailsId;
    this.updateBankDetailsForm.controls['bankName'].setValue(bankName)
    this.updateBankDetailsForm.controls['accountHolderName'].setValue(accountHolderName)
    this.updateBankDetailsForm.controls['accountNumber'].setValue(accountNumber)
    this.updateBankDetailsForm.controls['phone'].setValue(phone)
    this.updateBankDetailsForm.controls['upiId'].setValue(upiId)
    this.updateBankDetailsForm.controls['ifsc'].setValue(ifsc)
    this.updateBankDetailsForm.controls['branchName'].setValue(branchName)
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  clearModal() {
    this.updateBankDetailsForm.reset();
    this.modalRef.close('close')
  }

  updateBankAcc() {
    if (this.updateBankDetailsForm.value.accountNumber) {
      if (this.updateBankDetailsForm.value.phone) {
        if (this.updateBankDetailsForm.value.ifsc) {
          let data = {
            bankDetailsId: this.bankDetailsId,
            bankName: this.updateBankDetailsForm.value.bankName,
            accountHolderName: this.updateBankDetailsForm.value.accountHolderName,
            accountNumber: this.updateBankDetailsForm.value.accountNumber,
            phone: this.updateBankDetailsForm.value.phone,
            upiId: this.updateBankDetailsForm.value.upiId,
            branchName: this.updateBankDetailsForm.value.branchName,
            ifsc: this.updateBankDetailsForm.value.ifsc,
          }
          this.post.updateBankAccountDetailsPOST(data)
            .subscribe(res => {
              if (res.status == 'OK') {
                alert("Bank Account Updated Successfully..!")
                this.clearModal()
                this.getBankDetailsByDealerId(this.fuelDealerId);
              } else {
                alert("Error to Update")
              }
            })
        } else {
          alert("Please Enter ifsc..")
        }
      } else {
        alert("Please Enter mobile number..")
      }
    } else {
      alert("Please Enter acc number..")
    }
  }
}

