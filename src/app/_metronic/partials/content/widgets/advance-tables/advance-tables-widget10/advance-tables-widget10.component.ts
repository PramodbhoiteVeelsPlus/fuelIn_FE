import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { Adv_TablesService } from '../adv_tables.services';
import moment from 'moment';

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
  selector: 'app-advance-tables-widget10',
  templateUrl: './advance-tables-widget10.component.html',
  styleUrl: './advance-tables-widget10.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class AdvanceTablesWidget10Component {
  allentityList: any = [];
  entityId: any;
  customerId: any;
  modalRef: any;
  closeResult: string;
  RedeemBypassAdd: any;
  lockedCoin: any;
  unLockedCoin: any;
  redeemCoin: any;
  redeemCoinValue: any;
  ActualLockedCoin: any = 0;
  redeemDate: any = new Date();
  redeemAmount: any = 0;
  suggestion: any;
  redeemValue: any;
  selectMonth: any = 0;

  constructor(private excelService: ExcelService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private post: Adv_TablesService,
    private cd: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '');
    this.getAllEntity();
    this.cd.detectChanges();
  }

  getAllEntity() {
    this.spinner.show();
    let data = {

    }
    this.post.getAllEntityIdPOST(data)
      .subscribe(res => {
        this.allentityList = res.data;
        this.spinner.hide();
      })

  }

  getcustomerIdByEntity(id: any) {
    this.entityId = id.target.value

    if (this.entityId) {
      this.customerIdByEntity(this.entityId);
    } else {

    }
  }

  customerIdByEntity(entityId: any) {
    let data = {
      entityId: entityId
    }
    this.post.getcustmerIdByEntityIdPOST(data)
      .subscribe(res => {
        this.customerId = res.data[0].corporateId
        // this.getCoinDataMonthWise(this.customerId)
        // this.getredeemCoinMonthWise(this.customerId)
        // this.getCoinbyCustomerId(this.customerId)
      })
    // this.getRechargeForFastag(entityId)

  }

  openRedeemModalBypass(RedeemBypassAdd: any) {

    this.modalRef = this.modalService.open(RedeemBypassAdd);
    this.modalRef.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  getCoinbyCustomerId(customerId: any) {
    let data = {
      customerId: customerId
    }
    this.post.getAllCoinConversionByCustomerIdLockedPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.lockedCoin = res.data[0].coinAllConversionAmountValue
        }
        if (res.unlockedData[0].coinAllConversionAmountValue) {
          this.unLockedCoin = res.unlockedData[0].coinAllConversionAmountValue
        } else {
          this.unLockedCoin = 0;
        }
        if (res.redeemData[0].redeemCoincoinConversionAmountValue) {
          this.redeemCoin = (res.redeemData[0].redeemCoincoinConversionAmountValue)
          this.redeemCoinValue = (res.redeemData[0].sumRedeemValue)


        } else {
          this.redeemCoin = 0;
        }
        this.ActualLockedCoin = Number(this.lockedCoin) - Number(this.unLockedCoin)

      })
  }

  addRedeemCoinByPass() {
    if (this.unLockedCoin >= this.redeemValue) {
      let persent = (this.redeemValue / this.redeemAmount) * 100
      let data = {
        corporateId: "",
        accountTransAmount: this.redeemAmount,
        customerId: this.customerId,
        redeemCoinCorporateId: "",
        redeemCoincoinConversionAmountValue: this.redeemValue,
        redeemCoinCustomerId: this.customerId,
        suggestion: this.suggestion,
        redeemCoinTransactionMonth: this.selectMonth,
        redeemStatus: 'Paid',
        redeemValue: this.redeemAmount,
        redeemPersent: persent,
        date: moment(this.redeemDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD')
      }
      this.post.addCoinDetailsByPassPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {

            alert(res.msg)
            this.modalRef.close('close')
            this.customerIdByEntity(this.entityId)
          }
        })
    } else {
      let persent = (this.unLockedCoin / this.redeemAmount) * 100
      let data = {
        corporateId: "",
        accountTransAmount: this.redeemAmount,
        customerId: this.customerId,
        redeemCoinCorporateId: "",
        redeemCoincoinConversionAmountValue: this.unLockedCoin,
        redeemCoinCustomerId: this.customerId,
        suggestion: this.suggestion,
        redeemCoinTransactionMonth: this.selectMonth,
        redeemStatus: 'Paid',
        redeemValue: this.redeemAmount,
        redeemPersent: persent
      }
      this.post.addCoinDetailsByPassPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {

            alert(res.msg)
            this.modalRef.close('close')
            this.customerIdByEntity(this.entityId)

          }

        })
    }
  }
}
