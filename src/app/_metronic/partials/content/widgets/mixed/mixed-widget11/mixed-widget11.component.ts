import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { MixedService } from '../mixed.services';
import { FormGroup, FormControl } from '@angular/forms';
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
  selector: 'app-mixed-widget11',
  templateUrl: './mixed-widget11.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class MixedWidget11Component implements OnInit {

  lubeTaxForm = new FormGroup({
    customer: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    selectCorporateMapIdLubeTax: new FormControl(),
  })

  addForm = new FormGroup({
    dueDate: new FormControl('')
  })

  customerName: any;
  dealerData: any;
  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  allCorporateList: any = [];
  lubeTaxData: any = [];
  isLubeTable: boolean = false;
  termsAndConditions: any;
  manualSno: any;
  hsnCode: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  fuelDealerCorpMapIdNew: any;
  manualNumberEnd: any;

  constructor(
    private post: MixedService,
    private post1: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private router: Router,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    this.accessGroup = element.accessGroupId;
    this.getFuelCreditRequestCorporateByfuelDealerId(this.fuelDealerId)
    this.cd.detectChanges()
  }

  getDetailsByCustomerName(id: any) {
    this.spinner.show()
    this.customerName = id.target.value;
    if (this.customerName == "ALL") {
      this.lubeTaxForm.controls["selectCorporateMapIdLubeTax"].setValue("");
    }
    this.getCorporateInfoByfuelDealerCustomerMapId(this.customerName);
    this.spinner.hide()
    // this.getCorporateInfoByfuelDealerCustomerMapId1(this.customerName);
    // this.getCorporateInfoByfuelDealerCustomerMapId2(this.customerName);
  }

  getCorporateInfoByfuelDealerCustomerMapId(customerName: any) {
  
    const data = {
      fuelDealerId: this.fuelDealerId,
      customerName: customerName,
    };
    this.post.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.fuelDealerCorpMapIdNew = res.data[0].fuelDealerCustomerMapId;
          this.manualNumberEnd =  res.data[0].manualNumberEnd
          this.lubeTaxForm.controls['selectCorporateMapIdLubeTax'].setValue(res.data[0].fuelDealerCustomerMapId);

        } else {
          this.spinner.hide()
        }
      });
  }

  getFuelCreditRequestCorporateByfuelDealerId(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId
    };
    this.post.getFuelCreditRequestCorporateByfuelDealerIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.allCorporateList = res.data;
          this.cd.detectChanges()
        } else {
        }
      }
      );
  }

  getLubeTaxStatement() {
    if (this.lubeTaxForm.value.selectCorporateMapIdLubeTax && this.lubeTaxForm.value.startDate && this.lubeTaxForm.value.endDate) {
      this.post.lrForInvoiceLube(this.lubeTaxForm.value.selectCorporateMapIdLubeTax, moment(this.lubeTaxForm.value.startDate, ["DD-MM-YYYY"]).format('DD-MM-YYYY'), moment(this.lubeTaxForm.value.endDate, ["DD-MM-YYYY"]).format('DD-MM-YYYY'), this.termsAndConditions);

      this.lubeTaxData = [];
      this.spinner.show();
      let data = {
        custMapId: this.lubeTaxForm.value.selectCorporateMapIdLubeTax,
        startDate: moment(this.lubeTaxForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.lubeTaxForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      }

      this.post.getLubeTaxStatementPOST(data).subscribe(res => {
        if (res.status == "OK" && res.allPurData.length) {
          this.lubeTaxData = res.allPurData;
          this.isLubeTable = true;
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          alert("Data Not Found..!")
          this.isLubeTable = false;
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
    } else {
      alert("Please Select Customer and Date Range..!")
    }
  }

  gotoLubeTaxStatement() {
    this.post.lubeTaxStatement("TRUE");
    if (this.lubeTaxData.length) {
      localStorage.setItem("manualSno", this.manualSno);
      if (this.addForm.value.dueDate) {
        localStorage.setItem("isDueDate", "TRUE");
        localStorage.setItem("dueDate", this.addForm.value.dueDate);
      } else {
        localStorage.setItem("isDueDate", "FALSE");
      }
      localStorage.setItem("hsnCode", this.hsnCode);
      localStorage.setItem("termsAndConditions", this.termsAndConditions)
      this.router.navigate(['/credit/lubeTaxStatement/' + '0'], { queryParams: { s: '0' } });

    } else {
      alert("Please click on submit first.. ")
    }
  }
  
  pageChangeEvent(event: number) {
    this.p = event;
    this.getLubeTaxStatement();
  }
}
