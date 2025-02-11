import { ChangeDetectorRef, Component, EventEmitter, Injectable, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ModalConfig } from '../modal.config';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalsService } from '../modals.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  selector: 'app-modal3',
  templateUrl: './modal3.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ],
})

export class Modal3Component {
  @Output() closed = new EventEmitter<any>();
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<Modal3Component>;

  private modalRef: NgbModalRef;

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

  mobile: any;
  accountNumber: any;
  ifsc: any;
  accountHolderName: any;
  bankName: any;
  branchName: any;
  upiId: any;
  accountType: any = "SAVING";
  dealerLoginVPId: any;
  accessGroupId: any;
  managerPersonId: any;
  managerVPPersonId: any;
  managerName: string;
  loginSQLCorporateId: any;
  FuelVeelsVendorID: any;
  fuelDealerId: any;
  personId: any;
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
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerCorporateId = localStorage.getItem('dealerCorporateId');
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.accessGroupId = element.accessGroupId;
    this.managerVPPersonId = element.veelsPlusId;
    this.managerPersonId = element.personId;
    this.managerName = element.firstName + " " + element.lastName;
    this.personId = element.personId
    this.addBankDetailsForm.controls["accountType"].setValue("SAVING")
    // this.getfuelDealerIdByCorporateId(this.dealerCorporateId)
    this.cd.detectChanges()
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
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
        }
      })
  }

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent, { size: 'lg' });
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

  
 addBankDetails() {
  if(this.addBankDetailsForm.value.accountNumber){
    if(this.addBankDetailsForm.value.AccPhoneNumber){
    if(this.addBankDetailsForm.value.ifsc){

      this.spinner.show()
      let data = {
        accountNumber:this.addBankDetailsForm.value.accountNumber,
        accountHolderName:this.addBankDetailsForm.value.accountHolderName,
        ifsc:this.addBankDetailsForm.value.ifsc,
        corporateId:this.dealerCorporateId,
        branchName:this.addBankDetailsForm.value.branchName,
        bankName:this.addBankDetailsForm.value.bankName,
        phone:this.addBankDetailsForm.value.AccPhoneNumber,
        personId:this.personId ,
        upiId: this.addBankDetailsForm.value.upiId ,
        accountType: this.addBankDetailsForm.value.accountType ,
        dealerId:this.fuelDealerId
      }
      this.post.addBankDetailsPOST(data)
        .subscribe(res=>{
          if (res.status == "OK"){
            alert(res.msg)
            this.closed.emit();
            this.spinner.hide();
            // this.getBankDetailsByDealerId(this.fuelDealerId)
            this.close();          
          }
          else{
            this.spinner.hide();
          }
        })
      }else{
        alert("Please Enter IFSC..!")
        this.spinner.hide();
      }}else{
        alert("Please Enter Mobile Number..!")
        this.spinner.hide();
      }}else{
        alert("Please Enter Account Number..!")
        this.spinner.hide();
      }
    }

    clear(){
      this.addBankDetailsForm.reset()
      this.addBankDetailsForm.controls['accountHolderName'].setValue("") 
      this.addBankDetailsForm.controls['bankName'].setValue("")
      this.addBankDetailsForm.controls['branchName'].setValue("")
      this.addBankDetailsForm.controls['upiId'].setValue("") 
      this.addBankDetailsForm.controls['accountType'].setValue("SAVING")
    }

}
