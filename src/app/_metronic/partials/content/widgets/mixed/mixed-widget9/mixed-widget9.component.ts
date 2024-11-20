import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { MixedService } from '../mixed.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  selector: 'app-mixed-widget9',
  templateUrl: './mixed-widget9.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class MixedWidget9Component implements OnInit {

  searchDiscountForm = new FormGroup({
    selectCorporateMapId: new FormControl('', Validators.required),
    customerName: new FormControl(),
    selectCorporate: new FormControl('', Validators.required),
    selectCorporateId: new FormControl('', Validators.required),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    type: new FormControl(''),
    selectPersonId: new FormControl('', Validators.required),
    vehicleNumber: new FormControl(),
    selectCorporateMapIdVehicle: new FormControl(),
  });

  addForm = new FormGroup({
    dueDate: new FormControl('')
  })

  customerName: any;
  fuelDealerId: any;
  allCorporateList: any = [];
  fuelDealerCorpMapIdVehicle: any;
  allVehicleList: any = [];
  allDiscountedData1: any = [];
  isTable1: boolean;
  manualSno: any;
  hsnCode: any;
  termAndCondition: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;

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
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.getFuelCreditRequestCorporateByfuelDealerId(this.fuelDealerId)
    this.termAndCondition = localStorage.getItem('termsAndConditions');
    this.cd.detectChanges()
  }


  getDetailsByCustomerName(id: any) {
    this.spinner.show()
    this.customerName = id.target.value;
    if (this.customerName == "ALL") {
      this.searchDiscountForm.controls["selectCorporateMapId"].setValue("");
      this.searchDiscountForm.controls["selectCorporateMapIdVehicle"].setValue("");
    }
    this.getCorporateInfoByfuelDealerCustomerMapId(this.customerName);
  }

  getCorporateInfoByfuelDealerCustomerMapId(customerName: any) {

    const data = {
      fuelDealerId: this.fuelDealerId,
      customerName: customerName,
    };
    this.post.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.fuelDealerCorpMapIdVehicle = res.data[0].fuelDealerCustomerMapId;
          this.searchDiscountForm.controls["selectCorporateMapIdVehicle"].setValue(res.data[0].fuelDealerCustomerMapId);
          this.getFuelCreditVehicleListByfuelDealerCustMapId(res.data[0].fuelDealerCustomerMapId)

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

  getFuelCreditVehicleListByfuelDealerCustMapId(fuelDealerCorpMapIdVehicle: any) {
    const data = {
      fuelDealerCustomerMapId: fuelDealerCorpMapIdVehicle
    };
    this.post.getFuelCreditVehicleListByfuelDealerCustMapIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.allVehicleList = res.data;
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      }
      );
  }

  showAllDataByVehicle() {
    // this.post.inilizeForInvoice();
    this.allDiscountedData1 = []
    if (this.searchDiscountForm.value.selectCorporateMapIdVehicle) {
      if (this.searchDiscountForm.value.vehicleNumber) {
        if (this.searchDiscountForm.value.startDate) {
          if (this.searchDiscountForm.value.endDate) {
            this.spinner.show()
            const data = {
              vehicleNumber: this.searchDiscountForm.value.vehicleNumber,
              fuelDealerCustomerMapId: this.fuelDealerCorpMapIdVehicle,
              startDate: moment(this.searchDiscountForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
              endDate: moment(this.searchDiscountForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")

            };
            this.post.getCRSalesByVehicleNumberPOST(data)
              .subscribe(res => {
                if (res.status == 'OK') {
                  if (res.data.length) {
                    this.isTable1 = true;
                    this.allDiscountedData1 = res.data;
                    this.post.lrForVehicleInvoice(res.data,res.data1,res.data2,this.searchDiscountForm.value.vehicleNumber, moment(this.searchDiscountForm.value.startDate, ["DD-MM-YYYY"]).format('DD-MM-YYYY'), moment(this.searchDiscountForm.value.endDate, ["DD-MM-YYYY"]).format('DD-MM-YYYY'), this.searchDiscountForm.value.selectCorporateMapIdVehicle);
                    this.spinner.hide();
                    this.cd.detectChanges();
                  } else {
                    this.isTable1 = false;
                    this.spinner.hide();
                    this.cd.detectChanges();
                  }
                } else {
                  this.spinner.hide();
                  this.cd.detectChanges();
                }
              });
          } else {
            alert('Please Select EndDate');
          }
        } else {
          alert('Please Select StartDate');
        }
      } else {
        alert('Please Select Vehicle');
      }
    } else {
      alert('Please Select Customer');
    }
  }

  gotoVehicleWiseStatement() {
    if (this.allDiscountedData1.length) {
      localStorage.setItem("manualSno", this.manualSno);
      if (this.addForm.value.dueDate) {
        localStorage.setItem("isDueDate", "TRUE");
        localStorage.setItem("dueDate", this.addForm.value.dueDate);
      } else {
        localStorage.setItem("isDueDate", "FALSE");
      }
      localStorage.setItem("hsnCode", this.hsnCode);
      localStorage.setItem("termsAndConditions", this.termAndCondition)
      this.router.navigate(['../credit/fuelCreditVehicleInvoiceDocument/' + '0'], { queryParams: { s: '0' } });
    } else {
      alert("Please click on submit first.. ")
    }
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.showAllDataByVehicle();
  }
}
