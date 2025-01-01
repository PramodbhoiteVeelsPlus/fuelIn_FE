import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { WidgetService } from '../../widgets.services';
import { Router } from '@angular/router';

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
  selector: 'app-tables-widget2',
  templateUrl: './tables-widget2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget2Component {
  dealerLoginVPId: any;
  dealerAccess: boolean = false;
  liteAccess: boolean = false;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  infraDetails: any = [];
  dealerCorporateId: any;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    private router: Router,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,) {
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
    if (element.accessGroupId == 12 || element.accessGroupId == 14 || element.accessGroupId == 19 || element.accessGroupId == 21) {
      this.dealerAccess = true
      if (element.accessGroupId == 19 || element.accessGroupId == 21) {
        this.liteAccess = true
      }
    }
    this.getfuelDealerIdByCorporateId(this.dealerCorporateId)
    this.cd.detectChanges()
  }

  addInfra() {
    this.router.navigate(['/pump/infra']);
    this.cd.detectChanges()
  }

  // getfuelDealerIdByDealerCorporateId
  getfuelDealerIdByCorporateId(dealerCorporateId: any) {
    this.spinner.show()
    let data = {
      corporateId: dealerCorporateId
    }
    this.post.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.getTotalTANKDUByDealerId(this.fuelDealerId);
          // this.getFuelPriceByProductDateDealer(this.fuelDealerId);
          this.spinner.hide()
          this.cd.detectChanges()
        }
        else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      })
  }

  //getTotalTANKDUProductwise
  getTotalTANKDUByDealerId(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getTotalTANKDUProductwisePOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.infraDetails = []
        if (res.dataTK.length) {
          res.dataTK.map((res1: { productName: string; totalTank: number; fuelProductId: any; }) => {

            const dataJson = {
              productName: '',
              totalTank: 0,
              totalDU: 0,
              totalNZ: 0,
            };

            dataJson.productName = res1.productName;
            dataJson.totalTank = res1.totalTank;
            res.dataDU.map((res2: { fuelProductId: any; totalDU: number; }) => {
              if (res1.fuelProductId == res2.fuelProductId) {
                dataJson.totalDU = res2.totalDU;
              }
            })
            res.dataNZ.map((res3: { fuelProductId: any; totalNz: number; }) => {
              if (res1.fuelProductId == res3.fuelProductId) {
                dataJson.totalNZ = res3.totalNz;
              }
            })

            this.infraDetails.push(dataJson);
          });
          this.spinner.hide()
          this.cd.detectChanges()
        }

        this.spinner.hide()
        this.cd.detectChanges()

      }
    });
  }
}
